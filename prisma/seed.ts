import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  await prisma.user.createMany({
    data: [
      { email: "markwaterous@gmail.com", name: "Marcus Ohreallius" },
      { email: "alice@prisma.io", name: "Alice Prismaner" },
      { email: "bob@prisma.io", name: "Bob Prismaner" },
    ]
  })
}

seed().then(() => prisma.$disconnect())
