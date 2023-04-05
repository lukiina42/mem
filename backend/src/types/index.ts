export interface JWTReqUser {
  user: {
    email: string;
    userId: number;
  };
  [key: string]: any;
}
