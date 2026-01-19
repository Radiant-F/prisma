/**
 * Environment configuration with validation
 * Uses Bun's built-in env support
 */

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  // Database
  DATABASE_URL: getEnvVar("DATABASE_URL"),

  // JWT Secrets
  JWT_ACCESS_SECRET: getEnvVar("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnvVar("JWT_REFRESH_SECRET"),

  // Token Expiration
  ACCESS_TOKEN_EXPIRES_IN: getEnvVar("ACCESS_TOKEN_EXPIRES_IN", "15m"),
  REFRESH_TOKEN_EXPIRES_IN: getEnvVar("REFRESH_TOKEN_EXPIRES_IN", "7d"),

  // Server
  PORT: parseInt(getEnvVar("PORT", "3000"), 10),

  // Seed (optional)
  SEED_ADMIN_USERNAME: process.env.SEED_ADMIN_USERNAME,
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
} as const;

export type Env = typeof env;
