import { createClient } from '@/lib/supabase/client';

export async function uploadImage(file: File, folder: 'birds' | 'profile'): Promise<string | null> {
  const supabase = createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('plantel-images')
      .upload(filePath, file);

    if (uploadError) {
      return null;
    }

    const { data } = supabase.storage
      .from('plantel-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    return null;
  }
}