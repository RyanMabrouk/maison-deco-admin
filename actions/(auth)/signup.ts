'use server';
import { createClient } from '@/lib/supabase';
import { Enums } from '@/types/database.types';
import { headers } from 'next/headers';

export default async function signUp({
  email,
  password,
  full_name,
  role
}: {
  email: string;
  password: string;
  full_name: string;
  role?: Enums<'user_role'>;
}) {
  const headersList = headers();
  const header_url = headersList.get('host') || '';
  const proto = headersList.get('x-forwarded-proto') || 'http';
  const supabase = createClient();
  const { data, error: signUpErr } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${proto}://${header_url}/auth/callback`
    }
  });

  if (signUpErr) {
    return {
      error: { message: signUpErr.message, type: 'SignUp Error' },
      data: null
    };
  }

  if (!data?.user || data.user.identities?.length === 0) {
    return {
      error: { message: 'You already have an account', type: 'SignUp Error' },
      data: null
    };
  }

  await supabase.from('users').update({
    full_name,
    role
  });

  return { data, error: null };
}
