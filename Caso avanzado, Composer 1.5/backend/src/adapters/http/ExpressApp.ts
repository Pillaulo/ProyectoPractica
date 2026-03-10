import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Container } from '../../infra/container';
import { CreateStory, ProfileNotFoundError } from '../../application/use-cases/CreateStory';
import { GetStory } from '../../application/use-cases/GetStory';
import { StoryNotFoundError } from '../../application/errors';
import { GetStorySegments } from '../../application/use-cases/GetStorySegments';
import { GetStoriesByProfile } from '../../application/use-cases/GetStoriesByProfile';
import { CreateReaderProfile } from '../../application/use-cases/CreateReaderProfile';
import { GetReaderProfiles } from '../../application/use-cases/GetReaderProfiles';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createExpressApp(container: Container): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/v1/profiles', async (req: Request, res: Response) => {
    try {
      const { name, readingLevel, themes } = req.body;
      if (!name || !readingLevel) {
        res.status(400).json({
          code: 'VALIDATION_ERROR',
          message: 'name y readingLevel son obligatorios',
        });
        return;
      }
      const result = await container.createReaderProfile.execute({
        name,
        readingLevel,
        themes: themes ?? [],
      });
      res.status(201).json(profileToJson(result.profile));
    } catch (err) {
      res.status(500).json(errorToJson(err));
    }
  });

  app.get('/api/v1/profiles', async (_req: Request, res: Response) => {
    try {
      const result = await container.getReaderProfiles.execute();
      res.json({ profiles: result.profiles.map(profileToJson) });
    } catch (err) {
      res.status(500).json(errorToJson(err));
    }
  });

  app.get('/api/v1/profiles/:id/stories', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || !UUID_REGEX.test(id)) {
        res.status(400).json({
          code: 'VALIDATION_ERROR',
          message: 'id debe ser un UUID válido',
        });
        return;
      }
      const result = await container.getStoriesByProfile.execute({ profileId: id });
      res.json({ stories: result.stories.map(storyToJson) });
    } catch (err) {
      res.status(500).json(errorToJson(err));
    }
  });

  app.post('/api/v1/stories', async (req: Request, res: Response) => {
    try {
      const { profileId, maxLength } = req.body;
      if (!profileId || !UUID_REGEX.test(profileId)) {
        res.status(400).json({
          code: 'VALIDATION_ERROR',
          message: 'profileId debe ser un UUID válido',
          details: { field: 'profileId' },
        });
        return;
      }
      const result = await container.createStory.execute({
        profileId,
        maxLength: maxLength ?? 200,
      });
      res.status(201).json(storyToJson(result.story));
    } catch (err) {
      if (err instanceof ProfileNotFoundError) {
        res.status(404).json({
          code: 'PROFILE_NOT_FOUND',
          message: err.message,
        });
        return;
      }
      res.status(500).json(errorToJson(err));
    }
  });

  app.get('/api/v1/stories/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || !UUID_REGEX.test(id)) {
        res.status(400).json({
          code: 'VALIDATION_ERROR',
          message: 'id debe ser un UUID válido',
        });
        return;
      }
      const result = await container.getStory.execute({ storyId: id });
      res.json(storyToJson(result.story));
    } catch (err) {
      if (err instanceof StoryNotFoundError) {
        res.status(404).json({
          code: 'STORY_NOT_FOUND',
          message: err.message,
        });
        return;
      }
      res.status(500).json(errorToJson(err));
    }
  });

  app.get('/api/v1/stories/:id/segments', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || !UUID_REGEX.test(id)) {
        res.status(400).json({
          code: 'VALIDATION_ERROR',
          message: 'id debe ser un UUID válido',
        });
        return;
      }
      const result = await container.getStorySegments.execute({ storyId: id });
      res.json(result);
    } catch (err) {
      if (err instanceof StoryNotFoundError) {
        res.status(404).json({
          code: 'STORY_NOT_FOUND',
          message: err.message,
        });
        return;
      }
      res.status(500).json(errorToJson(err));
    }
  });

  return app;
}

function profileToJson(profile: { getId: () => { getValue: () => string }; getName: () => string; getReadingLevel: () => { getValue: () => string }; getThemes: () => { getValue: () => string }[] }) {
  return {
    id: profile.getId().getValue(),
    name: profile.getName(),
    readingLevel: profile.getReadingLevel().getValue(),
    themes: profile.getThemes().map((t) => t.getValue()),
  };
}

function storyToJson(story: {
  getId: () => { getValue: () => string };
  getTitle: () => string;
  getProfileId: () => { getValue: () => string };
  getFragmentCount: () => number;
  getCreatedAt: () => Date;
}) {
  return {
    id: story.getId().getValue(),
    title: story.getTitle(),
    profileId: story.getProfileId().getValue(),
    segmentCount: story.getFragmentCount(),
    createdAt: story.getCreatedAt().toISOString(),
  };
}

function errorToJson(err: unknown): { code: string; message: string } {
  if (err instanceof Error) {
    return { code: 'INTERNAL_ERROR', message: err.message };
  }
  return { code: 'INTERNAL_ERROR', message: 'Error desconocido' };
}
