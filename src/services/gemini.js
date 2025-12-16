import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const MODEL_NAME = "gemini-2.5-flash-image";
// const MODEL_NAME = "gemini-3-pro-image-preview";

export const generatePackaging = async (capturedImageBase64, accessories) => {
  if (!API_KEY) {
    throw new Error("Missing Google API Key");
  }

  // Accessories string
  const accessoriesText =
    accessories.length > 0
      ? `Inside the blister pack, next to the figure, are the following accessories: ${accessories.join(
          ", "
        )}.`
      : "No accessories included.";

  // Fetch logo to include in prompt context (optional, but good for "include logo" instruction)
  // We can convert the logo.png to base64
  let logoBase64 = null;
  try {
    const response = await fetch("/logo.png");
    const blob = await response.blob();
    logoBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    // Remove prefix
    logoBase64 = logoBase64.replace(/^data:image\/\w+;base64,/, "");
  } catch (e) {
    console.warn("Failed to load logo for generation:", e);
  }

  const prompt = `Create a premium blister pack packaging design featuring a real person.
  
  **Input Reference**:
  - The FIRST image provided is the **Subject** (Person).
  - The SECOND image provided is the **Brand Logo**.
  
  **Subject**: The person from the first input photo must be depicted as a full-body figure inside the packaging.
  - **Legs**: Generate natural, human legs wearing appropriate casual clothing (jeans/pants) to complete the half-body input.
  - **Likeness**: Strictly preserve the user's exact skin tone, facial features, and expression.
  
  **Accessories**: ${accessoriesText}
  - **IMPORTANT**: The accessories should be displayed as SEPARATE ITEMS in their own compartment/section within the packaging, NOT worn or held by the person.
  - Show them as miniature realistic objects laid out beside or around the figure within the blister packaging.
  
  **Packaging Design**:
  - Style: A high-end, custom collectible packaging.
  - **Logo Placement**: Take the SECOND input image (the Logo) and composite it EXACTLY as it is onto the top center of the packaging card. It must be clearly visible and legible.
  - Container: The person is enclosed in a clear, realistic plastic blister bubble attached to the card.
  - **Composition**: Ensure the entire packaging (card + blister + figure) fits perfectly within the frame. Do not crop the top logo or bottom details.
  - **NO TEXT**: Do not render any additional text, labels, or typography on the packaging beyond the provided logo. No product names, descriptions, or other text elements.
  
  **Technical**:
  - Aspect Ratio: 9:16.
  - **Background**: Solid PURE WHITE background.
  - Quality: Professional studio photography, sharp details, realistic lighting.`;

  // Remove data:image/jpeg;base64, prefix if present
  const userImageBase64 = capturedImageBase64.replace(
    /^data:image\/\w+;base64,/,
    ""
  );

  const parts = [
    { text: prompt },
    {
      inlineData: {
        // Changed from inline_data
        mimeType: "image/jpeg", // Changed from mime_type
        data: userImageBase64,
      },
    },
  ];

  if (logoBase64) {
    parts.push({
      inlineData: {
        // Changed from inline_data
        mimeType: "image/png", // Changed from mime_type
        data: logoBase64,
      },
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    console.log("🚀 Sending request to Gemini API...");
    console.log("Model:", MODEL_NAME);
    console.log("Parts count:", parts.length);

    const startTime = Date.now();

    const sdkResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: parts,
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: {
          aspectRatio: "9:16",
          imageSize: "1K",
        },
      },
    });

    const endTime = Date.now();
    console.log(`✅ Response received in ${(endTime - startTime) / 1000}s`);
    console.log("Full response:", JSON.stringify(sdkResponse, null, 2));

    // Parsing SDK Response
    const resultParts = sdkResponse.candidates?.[0]?.content?.parts;
    if (resultParts) {
      console.log("Result parts found:", resultParts.length);
      for (const part of resultParts) {
        if (part.inlineData) {
          console.log(
            "✅ Image data found, mime type:",
            part.inlineData.mimeType
          );
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    console.error("❌ No image found in response");
    throw new Error("No image generated in response.");
  } catch (error) {
    console.error("❌ Gemini SDK Error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw error;
  }
};
