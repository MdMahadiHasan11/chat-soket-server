import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateToken = (
  playLoad: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(playLoad, secret, { expiresIn } as SignOptions);
  return token;
};

export const verifyToken = (token: string, secret: string) => {
  const verified = jwt.verify(token, secret);
  return verified;
};
