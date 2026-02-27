import { Request, Response, NextFunction } from 'express';
import { storyRequestSchema } from '../validator/storyValidator';
import { generateAndSaveStory } from '../service/storyService';
import { z } from 'zod';

export const generateStoryHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Validate inputs
        const validatedData = storyRequestSchema.parse(req.body);

        // 2. Call Service
        const story = await generateAndSaveStory(validatedData);

        // 3. Return JSON
        res.status(200).json(story);
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Pass ValidationError to errorHandler
            return next({
                status: 400,
                code: 'VALIDATION_ERROR',
                message: (error as any).issues.map((e: any) => e.message).join(', ')
            });
        }
        next(error);
    }
};
