import { extname } from 'path';
export function splitString(inputString: string): string[] {
  return inputString.split('#');
}

// Utility function to generate a random string of specified length
export function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Utility function to get file extension from the original filename
export function getFileExtension(originalname: string): string {
  return extname(originalname);
}

export function formatDate(date) {
  let day = date.getDate().toString().padStart(2, '0');
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
