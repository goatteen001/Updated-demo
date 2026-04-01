import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure env vars are loaded before we read `process.env.*`.
// Without this, other modules may import this file before `server.js` calls `dotenv.config()`.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
// Prefer service-role key for backend writes/reads. Fall back for local dev.
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is required. Set it in `server/.env`.');
}
if (!supabaseServiceRoleKey) {
  throw new Error(
    'Supabase key is required. Set `SUPABASE_SERVICE_ROLE_KEY` (preferred) in `server/.env`.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);