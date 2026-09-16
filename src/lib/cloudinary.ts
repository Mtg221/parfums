/**
 * Uploads an image file to Cloudinary using unsigned upload preset
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dm9iz5eqf';
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'aura_categories';

  if (!cloudName) {
    throw new Error("Nom de cloud Cloudinary non configuré (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)");
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("L'image est trop volumineuse (max 5 Mo)");
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    throw new Error("Format d'image non supporté. Utilisez JPG, PNG ou WEBP.");
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || "Échec de l'envoi de l'image sur Cloudinary. Vérifiez que l'upload preset 'aura_categories' est configuré en mode 'Unsigned'.");
  }

  const data = await response.json();
  return data.secure_url;
}

/**
 * Placeholder image helper for category images when Cloudinary image is loading or unprovided
 */
export const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  homme: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop',
  femme: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop',
  unisexe: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop',
  oriental: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
};
