"use server";

import { z } from "zod";
import { getFirstZodError } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

export async function sendContact(formData: FormData) {
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    throw new Error(getFirstZodError(validatedFields.error));
  }

  try {
    // Use values so linter doesn't complain while we're only simulating

    // Simulate 4s delay before responding
    await new Promise((resolve) => setTimeout(resolve, 4000));

    return { success: true };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
