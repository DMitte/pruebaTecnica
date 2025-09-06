import jwt from "jsonwebtoken";

export const createToken = async (role:string) => {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined in environment variables");
  const token = jwt.sign(
    { role },
    secret,
    { expiresIn: '24h' }
  );
  console.log("Generated Token:", token);
  return token;
};