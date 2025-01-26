"use server";
import { createClient } from "@/lib/supabase";
export default async function updatePassword({email,currentPassword,
  newPassword,
}: {
  newPassword: string;
  email: string;
  currentPassword: string;

}) {
  const supabase = createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword
  });
  if (signInError) {
    return {
      error: {
        message: `${signInError.message}`,
      }
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (updateError) {
    return {
      error: {
        message: `${updateError.message}`,
      }
    };
  }



}
