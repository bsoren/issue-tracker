import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter: new PrismaMariaDb({
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT ?? "4000"),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl: {
            minVersion: "TLSv1.2",
            rejectUnauthorized: true,
        },
        connectionLimit: 5,
        allowPublicKeyRetrieval: true,
        connectTimeout: 10_000,
        acquireTimeout: 20_000,
    }),
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
