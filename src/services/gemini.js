import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const MODEL_NAME = "gemini-2.5-flash-image";
// const MODEL_NAME = "gemini-3-pro-image-preview";

export const generatePackaging = async (
  capturedImageBase64,
  accessories,
  userName
) => {
  if (!API_KEY) {
    throw new Error("Missing Google API Key");
  }

  // Accessories string
  const accessoriesText =
    accessories.length > 0
      ? `Inside the collectible box, next to the figure, are the following accessories: ${accessories.join(
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

  const prompt = `**Type**: 3D Product Render, Macro Photography
**Subject**: Collectible Action Figure and oversized accessories inside Blister Packaging

**Reference Handling**:
- PRIMARY REFERENCE (Image 1): Use this image as the strict source for the person's identity, skin tone, AND clothing.
- SECONDARY REFERENCE (Image 2): Use this image as the exact brand logo displayed prominently on the top header of the cardboard backing.

**1. Layout & Composition (Left/Right Split):**
- **LEFT ZONE**: The action figure stands prominently on the left side.
- **RIGHT ZONE**: All accessories are arranged neatly in a vertical column on the right side.
- The action figure is scaled to occupy the left 60% of the bubble, leaving the right 40% for the accessories.

**2. The Action Figure (Left Side - CRITICAL FIDELITY):**
- **Skin Tone Accuracy**: PRECISE MATCH. Use the exact skin tone visible in Image 1. Do not darken the skin or apply heavy shadowing that obscures the natural tone. Keep lighting on the face neutral and even to preserve the true skin color.
- **Outfit/Costume**: REPLICATE IMAGE 1. The figure must be wearing the EXACT clothing worn by the person in Image 1 (same shirt, style, pattern, and colors). Do not invent a superhero costume or generic armor.
- **Clothing Texture**: Sculpt the clothing to look like high-quality molded plastic (smooth folds, painted details) while maintaining the design from the photo.
- **Facial Likeness**: High-fidelity 3D caricature. Preserve the exact facial structure, nose shape, and hair style.
- **Toy Finish**: Apply a semi-matte vinyl finish to the skin (smooth, no realistic pores). Eyes should be slightly enlarged (110%) with a glossy "toy" sheen.

**3. The Accessories (Right Side):**
- **Scale**: SIGNIFICANTLY OVERSIZED "Hero Props".
- **Placement**: Arranged vertically on the right side.
- **Items**: ${accessoriesText}
- **Texture**: Chunky, molded plastic matching the figure's aesthetic.

**4. The Packaging (Container):**
- **Structure**: Clear, vacuum-formed plastic blister bubble on a cardboard backing.
- **Cardboard Header (Top Section):** This area must prominently feature the Logo (Image 2). Directly below or beside the logo, clearly render the name: **"${userName}"**.
- **Username Styling**: The name "${userName}" must be rendered in BOLD, stylized, uppercase letters that look like a printed action figure title (e.g., white text with a thick colored outline matching the packaging theme). It must be easily readable.
- **Cardboard Colors & Graphics**: Use #583594, #A973FF, #EEEEF0, #FDC83A for abstract geometric background shapes.
- **Text Constraint**: Aside from the required Logo and the exact name "${userName}", NO other text, slogans, or fake product details should be generated on the packaging.

**5. Lighting & Environment (NEW PREMIUM STUDIO):**
- **Lighting**: Sophisticated studio lighting setup. Use softboxes to create bright, even illumination on the figure's face (preserving skin tone). Add distinct, sharp rim lighting to the edges of the plastic blister pack to make it sparkle and define its shape against the background.
- **Background Environment**: Professional studio "infinity cove" backdrop.
- **Background Color/Texture**: A smooth, soft atmospheric gradient transitioning subtly from a light purple (#A973FF) at the top to a neutral light grey (#EEEEF0) near the bottom surface.
- **Depth**: The background should be smoothly blurred (shallow depth of field) to keep all focus heavily on the sharp details of the packaging.

**Technical Specifications**:
- Aspect Ratio: 2:3
- Style: High-fidelity 3D render, Octane Render style.`;

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
        temperature: 1,
        responseModalities: ["IMAGE"],
        imageConfig: {
          aspectRatio: "9:16",
          // imageSize: "1K",
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
