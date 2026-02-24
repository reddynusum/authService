import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET missing");
}

export interface TokenPayload {
  userId: string;
  email: string;
  role:string;
}


export function generateAccessToken(payload: TokenPayload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: "15m",
      }
    );
  }
  
export function generateRefreshToken(payload: TokenPayload) {
    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
  }
  
export function verifyAccessToken(token: string) {
    try {
      return jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as TokenPayload;
    } catch {
      return null;
    }
  }

  export function verifyRefreshToken(token: string) {
    try {
      return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string
      ) as TokenPayload;
    } catch {
      return null;
    }
  }
