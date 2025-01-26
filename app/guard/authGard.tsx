'use server';
import YouAreNotAnAdmin from './youAreNotAnAdmin';
import { createClient } from '@/lib/supabase';

async function AuthGuard({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const user = await supabase
    .from('users')
    .select('*')
    .match({
      id: data.user?.id
    })
    .single();
  const isAdmin = user.data?.role == 'admin';

  return <>{isAdmin ? children : <YouAreNotAnAdmin />}</>;
}

export default AuthGuard;
