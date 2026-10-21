import { v2 as cloudinary } from "cloudinary";

const configured = Boolean(
  process.env.CLOUDINARY_NAME &&
    process.env.CLOUDINARY_KEY &&
    process.env.CLOUDINARY_SECRET,
);

if (configured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
  });
}

export interface UploadResult {
  url: string;
  width: number;
  height: number;
  format: string;
  publicId: string;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
): Promise<UploadResult> {
  if (!configured) {
    throw new Error("Cloudinary no está configurado (CLOUDINARY_NAME/KEY/SECRET)");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "vitrina-social",
        use_filename: true,
        unique_filename: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary no devolvió resultado"));
        resolve({
          url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          publicId: result.public_id,
        });
      },
    );
    stream.end(buffer);
  });
}

export async function destroyFromCloudinary(publicId: string): Promise<void> {
  if (!configured) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // best-effort
  }
}
