// Load .env.local then .env (local wins) without a dependency — Node ≥20.12.
// Secrets live in .env.local, which .gitignore excludes.
for (const f of [".env.local", ".env"]) {
  try { process.loadEnvFile(f); } catch { /* file absent — fine */ }
}
