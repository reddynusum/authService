import bcrypt from "bcryptjs";

/**
 * Hash password before storing
 */
export async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare login password with stored hash
 */
export async function comparePassword(
  password: string,
  hash: string
) {
  return await bcrypt.compare(password, hash);
}
