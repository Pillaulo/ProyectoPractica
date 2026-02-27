import { z } from 'zod';

export const storyRequestSchema = z.object({
  nombre_nino: z
    .string()
    .trim()
    .min(1, 'nombre_nino es obligatorio.'),
  edad: z
    .number({ invalid_type_error: 'edad debe ser un número.' })
    .int('edad debe ser un entero.')
    .min(5, 'edad debe estar entre 5 y 9.')
    .max(9, 'edad debe estar entre 5 y 9.'),
  tema: z
    .string()
    .trim()
    .min(1, 'tema es obligatorio.'),
  personaje_principal: z
    .string()
    .trim()
    .min(1, 'personaje_principal es obligatorio.'),
  vocabulario: z.enum(['simple', 'medio'], { message: 'vocabulario debe ser simple o medio.' }),
});

export type StoryRequestInput = z.infer<typeof storyRequestSchema>;

