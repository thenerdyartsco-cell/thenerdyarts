import { z } from "zod/v4";

export const purchaseSchema = z.object({
  artworkId: z.string().min(1, "Artwork ID is required"),
  artworkTitle: z.string().min(1, "Artwork title is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your full address"),
  consentGiven: z.literal(true, "You must agree to the terms and privacy policy"),
});

export const soldOutRequestSchema = z.object({
  artworkId: z.string().min(1, "Artwork ID is required"),
  artworkTitle: z.string().min(1, "Artwork title is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  consentGiven: z.literal(true, "You must agree to the terms and privacy policy"),
});

export const customRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  description: z.string().min(10, "Please describe your desired piece in more detail"),
  budget: z.string().min(1, "Please select a budget range"),
  consentGiven: z.literal(true, "You must agree to the terms and privacy policy"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  address: z.string().min(5, "Please enter your address"),
  consentGiven: z.literal(true, "You must agree to the terms and privacy policy"),
});

// ----- Admin -----

export const adminLoginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const otpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .regex(/[a-z]/, "Include a lowercase letter")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number"),
});

export const reviewSchema = z.object({
  name: z.string().min(2, "Name is required"),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(5, "Review text is required"),
  approved: z.boolean(),
});

export const artworkSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Add a short description"),
  price: z.number().int().positive("Price must be greater than 0"),
  images: z.array(z.string().url()).min(1, "Add at least one image"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["available", "sold"]),
  featured: z.boolean(),
  order: z.number().int().nonnegative(),
});

export type PurchaseFormData = z.infer<typeof purchaseSchema>;
export type SoldOutRequestFormData = z.infer<typeof soldOutRequestSchema>;
export type CustomRequestFormData = z.infer<typeof customRequestSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type AdminLoginData = z.infer<typeof adminLoginSchema>;
export type OtpData = z.infer<typeof otpSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type ArtworkFormData = z.infer<typeof artworkSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
