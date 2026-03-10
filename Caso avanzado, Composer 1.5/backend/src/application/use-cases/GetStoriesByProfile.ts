import { ReaderId } from '../../domain/value-objects/ReaderId';
import { Story } from '../../domain/entities/Story';
import { StoryRepository } from '../../ports/StoryRepository';

export interface GetStoriesByProfileInput {
  profileId: string;
}

export interface GetStoriesByProfileResult {
  stories: Story[];
}

export class GetStoriesByProfile {
  constructor(private readonly storyRepository: StoryRepository) {}

  async execute(input: GetStoriesByProfileInput): Promise<GetStoriesByProfileResult> {
    const profileId = ReaderId.create(input.profileId);
    const stories = await this.storyRepository.findByProfileId(profileId);
    return { stories };
  }
}
