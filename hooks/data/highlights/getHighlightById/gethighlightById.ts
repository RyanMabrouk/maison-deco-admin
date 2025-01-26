'use server';
import { createClient } from '@/lib/supabase';

export async function getHighlightById(id: string) {
  const supabase = createClient();
  return await supabase
    .from('highlights')
    .select('*,highlights_translations(*)')
    .match({ id })
    .single();
}
