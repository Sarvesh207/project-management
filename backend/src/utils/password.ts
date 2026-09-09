import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export function hashPassword(password: string) {
  const hashedPassword = bcrypt.hash(password, SALT_ROUNDS);

  return hashedPassword;
}

export function comparePassword(password: string, hashPassword: string) {
  return bcrypt.compare(password, hashPassword);
}
