// schemas/eventSchema.ts

import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string(),  // Optional description field
  date: z.date().nullable().optional(), // Optional date field
  time: z.string().min(1, "Time is required"),  // Time field as string with validation
});
