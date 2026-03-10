import { ProfileRepository } from '../ports/ProfileRepository';
import { StoryRepository } from '../ports/StoryRepository';
import { LLMProvider } from '../ports/LLMProvider';
import { InMemoryProfileRepository } from '../adapters/persistence/InMemoryProfileRepository';
import { InMemoryStoryRepository } from '../adapters/persistence/InMemoryStoryRepository';
import { SqliteProfileRepository } from '../adapters/persistence/SqliteProfileRepository';
import { SqliteStoryRepository } from '../adapters/persistence/SqliteStoryRepository';
import { createDatabase } from './database';
import { GroqProvider } from '../adapters/llm/GroqProvider';
import { StubLLMProvider } from '../adapters/llm/StubLLMProvider';
import { CreateStory } from '../application/use-cases/CreateStory';
import { GetStory } from '../application/use-cases/GetStory';
import { GetStorySegments } from '../application/use-cases/GetStorySegments';
import { GetStoriesByProfile } from '../application/use-cases/GetStoriesByProfile';
import { CreateReaderProfile } from '../application/use-cases/CreateReaderProfile';
import { GetReaderProfiles } from '../application/use-cases/GetReaderProfiles';
import { loadConfig } from './config';

export interface Container {
  createStory: CreateStory;
  getStory: GetStory;
  getStorySegments: GetStorySegments;
  getStoriesByProfile: GetStoriesByProfile;
  createReaderProfile: CreateReaderProfile;
  getReaderProfiles: GetReaderProfiles;
}

export function createContainer(): Container {
  const config = loadConfig();

  let profileRepository: ProfileRepository;
  let storyRepository: StoryRepository;

  if (config.databasePath) {
    const db = createDatabase(config.databasePath);
    profileRepository = new SqliteProfileRepository(db);
    storyRepository = new SqliteStoryRepository(db);
  } else {
    profileRepository = new InMemoryProfileRepository();
    storyRepository = new InMemoryStoryRepository();
  }

  const llmProvider: LLMProvider =
    config.groqApiKey && config.groqApiKey.length > 0
      ? new GroqProvider(config.groqApiKey)
      : new StubLLMProvider();

  return {
    createStory: new CreateStory(profileRepository, storyRepository, llmProvider),
    getStory: new GetStory(storyRepository),
    getStorySegments: new GetStorySegments(storyRepository),
    getStoriesByProfile: new GetStoriesByProfile(storyRepository),
    createReaderProfile: new CreateReaderProfile(profileRepository),
    getReaderProfiles: new GetReaderProfiles(profileRepository),
  };
}
