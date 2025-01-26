'use server';
import { createClient } from '@/lib/supabase';
import { HighlightsQueryArgs } from './highlightsQuery';

export async function getHighlights(args: HighlightsQueryArgs) {
  const supabase = createClient();
  return await supabase
    .from('highlights')
    .select('*,highlights_translations(*)', { count: 'exact', head: false })
    .match(args.match ?? {});
}
