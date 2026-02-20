import { z } from 'zod';

export const PlateParamsSchema = z.object({
  plate: z.string()
    .min(1, 'Kenteken is verplicht')
    .max(10, 'Kenteken is te lang')
    .regex(/^[A-Z0-9-]+$/i, 'Ongeldig kenteken formaat'),
});

export type PlateParams = z.infer<typeof PlateParamsSchema>;

export function validatePlateParams(params: unknown) {
  return PlateParamsSchema.safeParse(params);
}

export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.unknown().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
