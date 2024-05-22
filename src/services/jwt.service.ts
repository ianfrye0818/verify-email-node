import jwt, { JwtPayload } from 'jsonwebtoken';
// import { JWTPayload } from '../types';

export class JwtService {
  private static JWT_SECRET = process.env.JWT_SECRET;
  private static instance: JwtService;

  private constructor() {
    if (!JwtService.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable not set.');
    }
  }

  public static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }
    return JwtService.instance;
  }

  verifyJWT(token: string): JWTPayload | null {
    try {
      const decodedToken = jwt.verify(token, JwtService.JWT_SECRET) as JwtPayload;
      return {
        email: decodedToken.email,
        exp: decodedToken.exp!,
        iat: decodedToken.iat!,
      };
    } catch (error) {
      console.error('JWT verification failed: ', error);
      return null;
    }
  }

  setJWT(payload: any) {
    return jwt.sign(payload, JwtService.JWT_SECRET, { expiresIn: '1d' });
  }
}
