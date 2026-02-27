import { z } from 'zod';

export const storyRequestSchema = z.object({
    nombre_nino: z.string().trim().min(1, "El nombre no puede estar vacío"),
    edad: z.number().int().min(5, "La edad mínima es 5").max(9, "La edad máxima es 9"),
    tema: z.string().trim().min(1, "El tema no puede estar vacío"),
    personaje_principal: z.string().trim().min(1, "El personaje principal no puede estar vacío"),
    vocabulario: z.enum(['simple', 'medio'])
});

export type StoryRequestValidator = z.infer<typeof storyRequestSchema>;
