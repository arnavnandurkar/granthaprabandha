import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tmcgfjfszfeevdngpidv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtY2dmamZzemZlZXZkbmdwaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzIwODQsImV4cCI6MjA5MjgwODA4NH0.HfLGqr0pMItSt576938e-YTbLqrmPcZZNUzslRbKpKk';

export const supabase = createClient(supabaseUrl, supabaseKey);