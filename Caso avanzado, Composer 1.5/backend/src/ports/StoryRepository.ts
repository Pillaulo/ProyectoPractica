import { ReaderId } from '../domain/value-objects/ReaderId';
import { Story } from '../domain/entities/Story';
import { StoryId } from '../domain/value-objects/StoryId';

export interface StoryRepository {
  save(story: Story): Promise<void>;
  findById(id: StoryId): Promise<Story | null>;
  findByProfileId(profileId: ReaderId): Promise<Story[]>;
  delete(id: StoryId): Promise<void>;
}
