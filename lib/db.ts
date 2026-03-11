import { neon } from '@neondatabase/serverless';

// Create a single instance
export const sql = neon(process.env.DATABASE_URL!); 