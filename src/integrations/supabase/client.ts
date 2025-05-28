import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ausjawlweuraczcuupzf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1c2phd2x3ZXVyYWN6Y3V1cHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1Mjc1NjcsImV4cCI6MjA2MjEwMzU2N30.UMCKxZLmb6jHLJEyW6cIT73cQ7_G5_BlEWja46cQFl8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
