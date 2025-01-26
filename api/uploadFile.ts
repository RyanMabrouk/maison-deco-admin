'use server';
import { UploadToBucket } from './UploadToBucket';

export async function uploadFile({
  formData,
  name,
  title
}: {
  formData: FormData;
  name: string;
  title: string;
}) {
  const file = formData.get(name) as File;
  if (!file || file.size === 0 || file.name === 'undefined') {
    throw new Error('No file selected or invalid file.');
  }
  const { data, error } = await UploadToBucket({
    file,
    fileName: title,
    bucketName: 'pictures'
  });
  if (error) {
    console.error(error);
  }
  return (process.env.SUPABASE_STORAGE_LINK as string) + '/' + data?.fullPath;
}
