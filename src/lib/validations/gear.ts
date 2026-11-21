import { z } from "zod";

export const gearFormSchema = z.object({
  name: z.string().min(3, "Equipment name must be at least 3 characters"),
  brand: z.string().min(2, "Brand is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Please choose a category"),
  pricePerDay: z.number().min(1, "Price must be at least $1 per day"),
  stock: z.number().int().min(1, "Stock must be at least 1 unit"),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export type GearFormData = z.infer<typeof gearFormSchema>;
