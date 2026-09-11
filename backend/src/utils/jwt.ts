import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (JWT_SECRET === undefined) {
  throw new Error("JWT_SECRET is not defined");
}

const secret: string = JWT_SECRET;
export function generateAccessToken(userId: string) {
  return jwt.sign(
    {
      sub: userId,
      type: "access",
    },
    secret,
    {
      expiresIn: "1d",
    },
  );
}
