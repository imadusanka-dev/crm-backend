import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../customer/schema/customer.schema';
import * as dotenv from 'dotenv';
dotenv.config();

const databaseProvider = {
  provide: 'DRIZZLE_DB',
  useFactory: async () => {
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: false,
    });

    // Test connection
    try {
      await pool.query('SELECT NOW()');
    } catch (error) {
      throw new Error(
        `Database connection failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return drizzle(pool, { schema });
  },
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
