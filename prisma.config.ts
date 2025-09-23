import type { PrismaConfig } from "prisma";
import path from "node:path";

export default {
  schema: path.join(__dirname, "prisma/schema.prisma"),
  migrations: {
    seed: `ts-node ${path.join(__dirname, "prisma/seed.ts")}`,
  }
} satisfies PrismaConfig;
