// ──────────────────────────────────────────────────────────
//  Capa: Validator
//  Responsabilidad: Validar y sanear el cuerpo del request
//  antes de que llegue al service. Usa Zod.
// ──────────────────────────────────────────────────────────

import { z } from 'zod';

export const storyRequestSchema = z.object({
  nombre_nino: z
    .string({ required_error: 'El nombre del niño es requerido' })
    .trim()
    .min(1, 'El nombre del niño no puede estar vacío')
    .max(50, 'El nombre del niño es demasiado largo'),

  edad: z
    .number({ required_error: 'La edad es requerida', invalid_type_error: 'La edad debe ser un número' })
    .int('La edad debe ser un número entero')
    .min(5, 'La edad mínima es 5 años')
    .max(9, 'La edad máxima es 9 años'),

  tema: z
    .string({ required_error: 'El tema es requerido' })
    .trim()
    .min(1, 'El tema no puede estar vacío')
    .max(100, 'El tema es demasiado largo'),

  personaje_principal: z
    .string({ required_error: 'El personaje principal es requerido' })
    .trim()
    .min(1, 'El personaje principal no puede estar vacío')
    .max(100, 'El nombre del personaje es demasiado largo'),

  vocabulario: z.enum(['simple', 'medio'], {
    errorMap: () => ({ message: 'El vocabulario debe ser "simple" o "medio"' }),
  }),
});

export type ValidatedStoryRequest = z.infer<typeof storyRequestSchema>;
