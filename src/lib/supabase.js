import { createClient } from '@supabase/supabase-js';

// Pega aquí tus dos datos de Supabase:
const SUPABASE_URL = 'https://vafzurqedbuawdfreldd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2lBs3gR60w5rIC2kGAVi4Q_3YP0szsj';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);