import { StoryId } from '../../domain/value-objects/StoryId';
import { Story } from '../../domain/entities/Story';
import { StoryRepository } from '../../ports/StoryRepository';
import { StoryNotFoundError } from '../errors';

export interface GetStoryInput {
  storyId: string;
}

export interface GetStoryResult {
  story: Story;
}

export class GetStory {
  constructor(private readonly storyRepository: StoryRepository) {}

  async execute(input: GetStoryInput): Promise<GetStoryResult> {
    const storyId = StoryId.create(input.storyId);
    const story = await this.storyRepository.findById(storyId);

    if (!story) {
      throw new StoryNotFoundError(input.storyId);
    }

    return { story };
  }
}
