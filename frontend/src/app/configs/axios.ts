import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshToken = async (): Promise<string> => {
  try {
    const refresh_token = Cookies.get('refresh_token_level_up');
    if (!refresh_token) throw new Error('No refresh token available');

    const response: AxiosResponse<TokenResponse> = await axios.get(
      `${process.env.SERVER_URL}auth/refresh`,
      {
        headers: {
          Authorization: `Bearer ${refresh_token}`,
        },
      }
    );

    const { access_token, refresh_token: new_refresh_token } = response.data;

    // Manually set cookies with detailed options
    const cookieOptions = {
      secure: false, // Set to false for IP-based HTTP deployment
      sameSite: 'lax' as const,
      path: '/', // Ensure cookie is set for entire domain
      domain: undefined, // Remove domain to allow cookie on IP
    };

    // Set access token
    Cookies.set('access_token_level_up', access_token, {
      ...cookieOptions,
      expires: 1 / 288 // 5 minutes
    });

    // Set refresh token
    Cookies.set('refresh_token_level_up', new_refresh_token, {
      ...cookieOptions,
      expires: 7 // 7 days
    });

    // Fallback: set cookies using document.cookie if Cookies.set fails
    try {
      document.cookie = `access_token_level_up=${access_token}; path=/; secure=false; SameSite=Lax; max-age=${1/288 * 24 * 60 * 60}`;
      document.cookie = `refresh_token_level_up=${new_refresh_token}; path=/; secure=false; SameSite=Lax; max-age=${7 * 24 * 60 * 60}`;
    } catch (cookieError) {
      console.error('Fallback cookie setting failed:', cookieError);
    }

    return access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    
    // Remove cookies on refresh failure
    try {
      Cookies.remove('access_token_level_up');
      Cookies.remove('refresh_token_level_up');
      
      // Fallback removal
      document.cookie = 'access_token_level_up=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refresh_token_level_up=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (removalError) {
      console.error('Cookie removal failed:', removalError);
    }

    // Uncomment if you want to redirect on refresh failure
    // window.location.href = '/login';
    throw error;
  }
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('access_token_level_up');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token as string}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshToken();
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError instanceof Error ? refreshError : new Error('Token refresh failed'), null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export { axiosInstance as axios };