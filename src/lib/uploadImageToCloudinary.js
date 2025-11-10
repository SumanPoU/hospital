
export default async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "janasambadh_upload");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dvhwrtaev/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (result.secure_url) {
      return { url: result.secure_url };
    }

    console.error("Cloudinary upload failed:", result);
    return null;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
}
