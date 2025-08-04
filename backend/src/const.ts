
 
export const allowedHosts = [
    "http://localhost:80",
    "http://localhost:2440"
]

declare module 'express-session' {
  interface SessionData {
    user: { id: string; username: string; email: string };
    views?: number;
  }
}