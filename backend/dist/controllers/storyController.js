import { ApiError } from '../errors/apiError.js';
import { storyRequestSchema } from '../validators/storyValidator.js';
export class StoryController {
    service;
    constructor(service) {
        this.service = service;
    }
    createStory = async (req, res) => {
        const parsed = storyRequestSchema.safeParse(req.body);
        if (!parsed.success) {
            const message = parsed.error.issues[0]?.message ?? 'Datos inválidos.';
            throw new ApiError(400, 'VALIDATION_ERROR', message);
        }
        const story = await this.service.generateAndSaveStory(parsed.data);
        res.json(story);
    };
}
//# sourceMappingURL=storyController.js.map