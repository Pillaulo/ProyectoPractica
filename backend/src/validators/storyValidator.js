const { z } = require("zod");

const storyRequestSchema = z.object({
  nombre_nino: z.string().trim().min(1, "nombre_nino es obligatorio"),
  edad: z.coerce
    .number({ message: "edad debe ser numerica" })
    .int("edad debe ser entera")
    .min(5, "edad minima es 5")
    .max(9, "edad maxima es 9"),
  tema: z.string().trim().min(1, "tema es obligatorio"),
  personaje_principal: z
    .string()
    .trim()
    .min(1, "personaje_principal es obligatorio"),
  vocabulario: z.enum(["simple", "medio"], {
    message: "vocabulario debe ser simple o medio",
  }),
});

const parseStoryRequest = (payload) => storyRequestSchema.parse(payload);

module.exports = {
  parseStoryRequest,
};
