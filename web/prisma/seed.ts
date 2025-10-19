/**
 * Prisma Database Seeding Script
 * Populates the database with initial data for development
 */

import bcrypt from "bcryptjs";
import { PrismaClient, UserRole, UserStatus } from "./generated/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create admin user
  const adminEmail = "admin@genesis.local";
  const adminPassword = await bcrypt.hash("admin123", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Genesis Admin",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      preferences: {
        theme: "system",
        notifications: true,
        sidebarCollapsed: false,
      },
      passwords: {
        create: {
          hash: adminPassword,
          salt: "admin_salt",
        },
      },
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);

  // Create test user
  const testEmail = "user@genesis.local";
  const testPassword = await bcrypt.hash("user123", 12);

  const testUser = await prisma.user.upsert({
    where: { email: testEmail },
    update: {},
    create: {
      email: testEmail,
      name: "Test User",
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
      preferences: {
        theme: "light",
        notifications: true,
        sidebarCollapsed: false,
      },
      passwords: {
        create: {
          hash: testPassword,
          salt: "user_salt",
        },
      },
    },
  });

  console.log(`✅ Created test user: ${testUser.email}`);

  // Create utilities
  const utilities = [
    {
      name: "json-formatter",
      title: "JSON Formatter",
      description: "Format, validate, and beautify JSON data",
      category: "text",
      icon: "code",
      path: "/utilities/json-formatter",
      metadata: {
        features: ["format", "validate", "minify", "sort"],
        keywords: ["json", "format", "validate", "parser"],
      },
    },
    {
      name: "text-diff",
      title: "Text Diff",
      description: "Compare differences between two text blocks",
      category: "text",
      icon: "compare",
      path: "/utilities/text-diff",
      metadata: {
        features: ["diff", "compare", "merge", "highlight"],
        keywords: ["diff", "compare", "text", "merge"],
      },
    },
    {
      name: "url-encoder",
      title: "URL Encoder/Decoder",
      description: "Encode and decode URLs and URI components",
      category: "encoding",
      icon: "link",
      path: "/utilities/url-encoder",
      metadata: {
        features: ["encode", "decode", "component", "full-url"],
        keywords: ["url", "encode", "decode", "uri"],
      },
    },
    {
      name: "base64-converter",
      title: "Base64 Converter",
      description: "Encode and decode Base64 strings",
      category: "encoding",
      icon: "transform",
      path: "/utilities/base64-converter",
      metadata: {
        features: ["encode", "decode", "file-support"],
        keywords: ["base64", "encode", "decode", "convert"],
      },
    },
    {
      name: "hash-generator",
      title: "Hash Generator",
      description: "Generate MD5, SHA-1, SHA-256, and other hashes",
      category: "security",
      icon: "shield",
      path: "/utilities/hash-generator",
      metadata: {
        features: ["md5", "sha1", "sha256", "sha512"],
        keywords: ["hash", "md5", "sha", "checksum"],
      },
    },
  ];

  for (const utility of utilities) {
    const created = await prisma.utility.upsert({
      where: { name: utility.name },
      update: {},
      create: utility,
    });
    console.log(`✅ Created utility: ${created.title}`);
  }

  // Create user utility associations (favorites)
  await prisma.userUtility.upsert({
    where: {
      userId_utilityId: {
        userId: testUser.id,
        utilityId: (await prisma.utility.findUnique({
          where: { name: "json-formatter" },
        }))!.id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      utilityId: (await prisma.utility.findUnique({
        where: { name: "json-formatter" },
      }))!.id,
      isFavorite: true,
      usageCount: 5,
      lastUsedAt: new Date(),
    },
  });

  // Create app configuration
  const configs = [
    {
      key: "app.name",
      value: "Genesis Utilities",
      type: "STRING" as const,
      isPublic: true,
    },
    {
      key: "app.version",
      value: "1.0.0",
      type: "STRING" as const,
      isPublic: true,
    },
    {
      key: "features.registration",
      value: true,
      type: "BOOLEAN" as const,
      isPublic: true,
    },
    {
      key: "features.telemetry",
      value: false,
      type: "BOOLEAN" as const,
      isPublic: false,
    },
  ];

  for (const config of configs) {
    await prisma.appConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
    console.log(`✅ Created config: ${config.key}`);
  }

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
