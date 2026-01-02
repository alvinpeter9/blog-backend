import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/config/generated/client.js";
import bcrypt from "bcrypt";
import { logger } from "../src/utils/logger.js";

if (!process.env.DATABASE_URL) {
  logger.error(
    "Missing DATABASE_URL in environment (.env). Set DATABASE_URL to your Postgres connection string."
  );
  process.exit(1);
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("❌ Seeding is disabled in production");
  }
  logger.info("🧹 Cleaning database...");

  const user = await prisma.user.findFirst();
  const category = await prisma.category.findFirst();
  if (user || category) {
    logger.info("⚠️  Existing data found. Cleaning up...");
    // Order matters due to foreign keys
    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.category.deleteMany(),
    ]);
  }

  logger.info("🌱 Seeding database...");

  /* -------------------- USERS -------------------- */
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const [alice, bob] = await Promise.all([
    prisma.user.create({
      data: {
        email: "alice@example.com",
        firstName: "Alice",
        lastName: "Johnson",
        password: passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: "bob@example.com",
        firstName: "Bob",
        lastName: "Smith",
        password: passwordHash,
      },
    }),
  ]);

  /* -------------------- CATEGORIES -------------------- */
  const [tech, business, lifestyle] = await Promise.all([
    prisma.category.create({
      data: {
        name: "Technology",
        description: "Articles about software, engineering, and tech trends",
        imageUrl: "https://example.com/images/technology.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Business",
        description: "Insights on startups, finance, and entrepreneurship",
        imageUrl: "https://example.com/images/technology.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Lifestyle",
        description: "Health, productivity, and personal growth",
        imageUrl: "https://example.com/images/technology.jpg",
      },
    }),
  ]);

  /* -------------------- POSTS -------------------- */
  await Promise.all([
    prisma.post.create({
      data: {
        title: "Introduction to Node.js Microservices",
        content:
          "A practical guide to building scalable Node.js microservices.",
        published: true,
        authorId: alice.id,
        categoryId: tech.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Scaling a Startup in 2025",
        content: "Key lessons learned from scaling modern SaaS businesses.",
        published: true,
        authorId: bob.id,
        categoryId: business.id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Daily Habits for Better Focus",
        content: "Simple habits to improve focus and mental clarity.",
        published: false,
        authorId: alice.id,
        categoryId: lifestyle.id,
      },
    }),
  ]);

  logger.info("✅ Seeding completed successfully");
}

main()
  .catch((e) => {
    logger.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
