export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType?: string;
  originalFilename?: string;
};

type UploadCloudinaryImageOptions = {
  folder?: string;
  tags?: string[];
};

function getCloudinaryConfig() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to the admin env.",
    );
  }

  return { cloudName, uploadPreset };
}

export async function uploadCloudinaryImage(
  file: File,
  options: UploadCloudinaryImageOptions = {},
): Promise<CloudinaryUploadResult> {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  if (options.tags?.length) {
    formData.append("tags", options.tags.join(","));
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Cloudinary upload failed.");
  }

  return {
    secureUrl: payload.secure_url,
    publicId: payload.public_id,
    width: payload.width,
    height: payload.height,
    format: payload.format,
    resourceType: payload.resource_type,
    originalFilename: payload.original_filename,
  };
}
