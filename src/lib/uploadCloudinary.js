import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "$env/static/private";
import crypto from "crypto";

export async function uploadKeCloudinary(file) {
  try {
    const timestamp = Math.round(Date.now() / 1000).toString();

    // buat signature untuk signed upload
    const signatureString = `timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    const body = new FormData();
    body.append("file", file);
    body.append("api_key", CLOUDINARY_API_KEY);
    body.append("timestamp", timestamp);
    body.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body }
    );
    
    if (!res.ok) return null;

    const json = await res.json();
    return json.secure_url ?? null;

  } catch {
    return null;
  }
}