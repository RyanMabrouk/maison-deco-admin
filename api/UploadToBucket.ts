'use client';
import { createCsrClient } from '@/lib/client.supabase';
export async function UploadToBucket({
  file,
  fileName,
  bucketName
}: {
  file: File;
  fileName: string;
  bucketName: string;
}) {
  const supabase = createCsrClient();
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  return { data, error };
}
