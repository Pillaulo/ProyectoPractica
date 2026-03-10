import { ReaderId } from '../../domain/value-objects/ReaderId';
import { Story } from '../../domain/entities/Story';
import { StoryId } from '../../domain/value-objects/StoryId';
import { StoryRepository } from '../../ports/StoryRepository';

export class InMemoryStoryRepository implements StoryRepository {
  private readonly stories = new Map<string, Story>();

  async save(story: Story): Promise<void> {
    this.stories.set(story.getId().getValue(), story);
  }

  async findById(id: StoryId): Promise<Story | null> {
    return this.stories.get(id.getValue()) ?? null;
  }

  async findByProfileId(profileId: ReaderId): Promise<Story[]> {
    return Array.from(this.stories.values()).filter((s) =>
      s.getProfileId().equals(profileId)
    );
  }

  async delete(id: StoryId): Promise<void> {
    this.stories.delete(id.getValue());
  }

  clear(): void {
    this.stories.clear();
  }
}
