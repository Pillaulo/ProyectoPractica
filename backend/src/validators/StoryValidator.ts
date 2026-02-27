/**
 * Validación de entrada para generación de cuentos
 * Capa: Validator
 */

import { z } from 'zod';

export const StoryRequestSchema = z.object({
  nombre_nino: z
    .string()
    .trim()
    .min(1, 'nombre_nino no puede estar vacío'),
  edad: z.coerce
    .number()
    .int('edad debe ser un número entero')
    .min(5, 'edad debe estar entre 5 y 9')
    .max(9, 'edad debe estar entre 5 y 9'),
  tema: z
    .string()
    .trim()
    .min(1, 'tema no puede estar vacío'),
  personaje_principal: z
    .string()
    .trim()
    .min(1, 'personaje_principal no puede estar vacío'),
  vocabulario: z.enum(['simple', 'medio'], {
    errorMap: () => ({ message: 'vocabulario debe ser "simple" o "medio"' }),
  }),
});

export type ValidatedStoryRequest = z.infer<typeof StoryRequestSchema>;
