const { z } = require('zod');

const storyRequestSchema = z.object({
  nombre_nino: z
    .string()
    .trim()
    .min(1, 'El nombre del niño es obligatorio'),
  edad: z
    .number()
    .int('La edad debe ser un número entero')
    .min(5, 'La edad mínima es 5 años')
    .max(9, 'La edad máxima es 9 años'),
  tema: z
    .string()
    .trim()
    .min(1, 'El tema es obligatorio'),
  personaje_principal: z
    .string()
    .trim()
    .min(1, 'El personaje principal es obligatorio'),
  vocabulario: z.enum(['simple', 'medio'], {
    errorMap: () => ({ message: 'El vocabulario debe ser "simple" o "medio"' }),
  }),
});

function validateStoryRequest(data) {
  const result = storyRequestSchema.safeParse(data);
  if (!result.success) {
    const messages = result.error.errors.map((e) => e.message).join('; ');
    return { success: false, error: messages };
  }
  return { success: true, data: result.data };
}

module.exports = { validateStoryRequest };
