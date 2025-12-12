//utils/cloudinary.js
import * as ImagePicker from "expo-image-picker";

const CLOUD_NAME = "dda16ge2b";
const UPLOAD_PRESET = "user_avatar";

export async function pickImageFromLibrary() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}

export async function uploadImageToCloudinary(uri) {
  const data = new FormData();
  data.append("file", {
    uri,
    type: "image/jpeg",
    name: "avatar.jpg",
  });
  data.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  const json = await res.json();
  if (!res.ok) throw new Error("فشل رفع الصورة");

  return json.secure_url;
}
