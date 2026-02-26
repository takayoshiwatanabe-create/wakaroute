import { z } from "zod";

// Define the maximum image size in bytes (e.g., 4MB)
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export const decomposeInputSchema = z.object({
  textInput: z.string().trim().optional(),
  imageFile: z.instanceof(File).optional().refine(
    (file) => !file || file.size <= MAX_FILE_SIZE,
    `Image size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
  ).refine(
    (file) => !file || file.type.startsWith("image/"),
    "Only image files are allowed."
  ),
}).refine((data) => data.textInput || data.imageFile, {
  message: "Either text input or an image file must be provided.",
  path: ["textInput"], // Point to textInput as a general indicator
});

export type DecomposeInput = z.infer<typeof decomposeInputSchema>;

