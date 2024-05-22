declare namespace NodeJS {
  export interface ProcessEnv {
    JWT_SECRET: string;
    SENDGRID_API_KEY: string;
    JWT_TOKEN_SECRET: string;
  }
}

declare interface JWTPayload {
  email: string;
  exp: number;
  iat: number;
}
