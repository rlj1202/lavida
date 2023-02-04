/**
 * https://www.rfc-editor.org/rfc/rfc7519
 */
export interface JwtPayload {
  /** Issuer */
  iss?: string;
  /** Subject */
  sub?: string;
  /** Audience */
  aud?: string;
  /** Expires at */
  exp?: Date;
  /** Not Before */
  nbf?: Date;
  /** Issued At */
  iat?: Date;
  /** JWT ID */
  jti?: string;

  id: number;
  username: string;
  email: string;
}
