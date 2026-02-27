const { z } = require("zod");

const storyResponseSchema = z.object({
  titulo: z.string().trim().min(1),
  frases: z.array(z.string().trim().min(1)).min(1),
  parrafos: z.array(z.string().trim().min(1)).min(1),
});

const parseStoryResponse = (payload) => storyResponseSchema.parse(payload);

module.exports = {
  parseStoryResponse,
};
