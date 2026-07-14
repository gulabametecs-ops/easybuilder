import "dotenv/config";
import { jwtVerify } from "jose";
import { readFileSync } from "node:fs";

async function main() {
  const token = process.argv[2] ?? readFileSync(process.argv[2] ?? "", "utf8");
  console.log("AUTH_SECRET seen:", JSON.stringify(process.env.AUTH_SECRET));
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret-change-me");
  try {
    const { payload } = await jwtVerify(token, secret);
    console.log("VERIFIED payload:", payload);
  } catch (e) {
    console.log("VERIFY FAILED:", (e as Error).message);
  }
}
main();
