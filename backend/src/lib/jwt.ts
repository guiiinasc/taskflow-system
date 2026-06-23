import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

console.log("JWT SECRET:", SECRET);


export function generateToken(payload: any) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}