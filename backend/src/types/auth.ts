import { TokenType } from '../enums/token.enum';

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
  type: TokenType;
}

export interface DecodedToken {
  userId: string;
  email: string;
  username: string;
  type: TokenType;
  iat: number;
  exp: number;
}
