import {z} from "zod"

export const StyleTypeSchema = z.enum([
  'ghibli',
  'illustration',
  'csk',
  'pixar',
  'anime'
]);
export type StyleType = z.infer<typeof StyleTypeSchema>;


export const SubscriptionSchema = z.enum([
  'free',
  'pro',
  'premium'
])
export type Subscription = z.infer<typeof SubscriptionSchema>


export const TransformImageResponseSchema = z.object({
  transformed_image: z.string().startsWith("data:image/"),
  original_filename: z.string().min(1),
  style: StyleTypeSchema,
  created_at: z.string(),
  transformations_remaining: z.number().nullable().optional()
});
export type TransformImageResponse = z.infer<typeof TransformImageResponseSchema>;


export const HistoryItemSchema = z.object({
  id: z.string(),
  originalImage: z.string(),
  transformedImage: z.string().startsWith("data:image/png;base64"),
  style: StyleTypeSchema,
  createdAt: z.string()
});
export type HistoryItem = z.infer<typeof HistoryItemSchema>;


export const UsageInfoSchema = z.object({
  can_transform: z.boolean(),
  can_download: z.boolean(),
  transformations_remaining: z.number().nullable(),
  subscription_tier: SubscriptionSchema
})
export type UsageInfo = z.infer<typeof UsageInfoSchema>;


export interface ImageState {
  transformedImage: string | null; // Base64 data URI
  originalImage: string | null; // Object URL
  currentResponse: TransformImageResponse | null; // Full API response
  history: HistoryItem[];
  isLoading: boolean;
  error: string | null;
}