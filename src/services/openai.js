/* OPENAI IMPLEMENTATION - COMMENTED OUT
import OpenAI from "openai";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const generatePackaging = async (capturedImageBase64, accessories) => {
  if (!OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API Key");
  }

  // Accessories string
  const accessoriesText =
    accessories.length > 0
      ? `Inside the blister pack, next to the figure, are the following accessories: ${accessories.join(
          ", "
        )}.`
      : "No accessories included.";

  const prompt = `Premium collectible blister pack packaging with a photorealistic full-body person from the input photo. The person must look completely HUMAN and natural - preserve exact skin tone, features, and expression. Add realistic human legs in casual pants to complete the figure. ${
    accessoriesText
      ? `Show these accessories as separate miniature items in their own compartment: ${accessories.join(
          ", "
        )}.`
      : ""
  } Place a clean modern logo at top center of the cardboard backing. The person is enclosed in a clear plastic bubble. Entire packaging fits in frame on pure white background. Studio lighting, sharp details, no text beyond logo. Vertical 9:16 format.`;

  try {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
    });

    console.log("🚀 Sending request to OpenAI API...");
    console.log("Model: dall-e-2");

    const startTime = Date.now();

    // Convert the input image to proper PNG format
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = capturedImageBase664;
    });

    // Create a canvas to convert to PNG
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Convert to PNG blob
    const pngBlob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png", 1.0);
    });

    // Check size and compress if needed
    let finalBlob = pngBlob;
    if (pngBlob.size > 4 * 1024 * 1024) {
      // If larger than 4MB
      console.log(
        `⚠️ Image too large (${(pngBlob.size / 1024 / 1024).toFixed(
          2
        )}MB), resizing...`
      );
      // Resize to fit under 4MB
      const scale = Math.sqrt((4 * 1024 * 1024) / pngBlob.size) * 0.9; // 90% to be safe
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      finalBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png", 1.0);
      });
      console.log(
        `✅ Resized to ${(finalBlob.size / 1024 / 1024).toFixed(2)}MB`
      );
    }

    const file = new File([finalBlob], "input.png", { type: "image/png" });
    console.log(
      `📦 Final file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    );

    const response = await openai.images.edit({
      model: "dall-e-2",
      image: file,
      prompt: prompt,
      size: "1024x1024", // DALL-E-2 only supports square images
    });

    const endTime = Date.now();
    console.log(`✅ Response received in ${(endTime - startTime) / 1000}s`);
    console.log("Full response:", JSON.stringify(response, null, 2));

    // OpenAI images.edit returns URLs
    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      console.error("❌ No image URL in response");
      throw new Error("No image URL received from API");
    }

    console.log("✅ Image URL found:", imageUrl);

    // Return the URL directly - the browser can display it
    // Note: The URL is temporary and will expire after a few hours
    return imageUrl;
  } catch (error) {
    console.error("❌ OpenAI Error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw error;
  }
};
*/
