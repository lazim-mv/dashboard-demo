// "use client";
// import { jwtDecode } from "jwt-decode";
// import { useEffect } from "react";

// type DecodedToken = {
//   exp: number;
// };

// export function useRefreshToken(access_token: string | undefined) {
//   useEffect(() => {
//     if (typeof window === "undefined" || !access_token) return;

//     const decodedToken: DecodedToken = jwtDecode(access_token);
//     const currentUnixTime = Date.now() / 1000;

//     const expInSeconds =
//       decodedToken.exp > 9999999999
//         ? decodedToken.exp / 1000
//         : decodedToken.exp;
//     const isTokenExpired = currentUnixTime >= expInSeconds;

//     if (isTokenExpired) {
//       const refreshAccessToken = async () => {
//         try {
//           const refreshResponse = await fetch("/api/refresh", {
//             method: "GET",
//           });

//           if (refreshResponse.ok) {
//             const {
//               access_token: newAccessToken,
//               refresh_token: newRefreshToken,
//             } = await refreshResponse.json();
//             console.log("New access token:", newAccessToken);
//           } else {
//             console.error("Failed to refresh token");
//           }
//         } catch (error) {
//           console.error("Error calling refresh API:", error);
//         }
//       };

//       refreshAccessToken();
//     }

//     console.log(access_token, "fdjsaklfkalsfjkal");
//   }, [access_token]);
// }
