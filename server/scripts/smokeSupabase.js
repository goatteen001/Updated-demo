import { supabase } from '../config/supabaseClient.js';

const tablesToCheck = [
  'profiles',
  'courses',
  'materials',
  'quizzes',
  'questions',
  'quiz_attempts',
  'student_progress',
  'material_progress',
  'telemetry',
  'content',
  'user_interactions',
  'recommendations',
];

async function main() {
  console.log('[Smoke] Checking Supabase tables...');
  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      if (error) {
        console.error(`[Smoke] ${table}: FAILED`, error.message);
        continue;
      }
      console.log(`[Smoke] ${table}: OK`, data ? `(rows=${data.length})` : '');
    } catch (err) {
      console.error(`[Smoke] ${table}: FAILED`, err instanceof Error ? err.message : String(err));
    }
  }

  console.log('[Smoke] Checking get_daily_engagement RPC...');
  try {
    const { data, error } = await supabase.rpc('get_daily_engagement', { days_back: 8 });
    if (error) throw error;
    console.log('[Smoke] get_daily_engagement: OK', Array.isArray(data) ? `(rows=${data.length})` : '');
  } catch (err) {
    console.error(
      '[Smoke] get_daily_engagement: FAILED',
      err instanceof Error ? err.message : String(err),
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

