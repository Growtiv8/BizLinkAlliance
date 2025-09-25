import { createClient } from '@supabase/supabase-js';

// Prefer environment variables; fall back to hardcoded values only for local/dev to avoid breaking build.
// NOTE: Replace the fallbacks below with real env vars and delete them before production.
const envUrl = import.meta?.env?.VITE_SUPABASE_URL;
const envAnon = import.meta?.env?.VITE_SUPABASE_ANON_KEY;

const fallbackUrl = 'https://akfoftskbtqxnxuwithh.supabase.co';
const fallbackAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrZm9mdHNrYnRxeG54dXdpdGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NzQ5MjEsImV4cCI6MjA3MzE1MDkyMX0.NKY__HHPQwKP1iExhUQLbviQbZSLYzTQrh1zFPFvAi8';

const supabaseUrl = envUrl || fallbackUrl;
const supabaseAnonKey = envAnon || fallbackAnon;

if (!envUrl || !envAnon) {
	// eslint-disable-next-line no-console
	console.warn('[supabase] Using fallback URL/key. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env for production.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);