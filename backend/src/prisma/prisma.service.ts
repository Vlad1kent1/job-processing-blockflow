import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Обов'язково перевірте, чи зчитується URL
    const connectionString = process.env["DATABASE_URL"];
    
    if (!connectionString) {
      console.error("❌ DATABASE_URL is missing in .env file! ", process.env["DATABASE_URL"]);
    } else {
      console.log("✅ DATABASE_URL loaded successfully: ", connectionString);
    }

    const pool = new Pool({ 
      connectionString,
      // Додаємо SSL для Supabase (це критично для хмарних БД)
      ssl: { rejectUnauthorized: false } 
    });
    
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}