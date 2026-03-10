import { StoryId } from '../../domain/value-objects/StoryId';
import { StoryRepository } from '../../ports/StoryRepository';
import { StoryFragment } from '../../domain/entities/StoryFragment';
import { StoryNotFoundError } from '../errors';

export interface GetStorySegmentsInput {
  storyId: string;
}

export interface SegmentDTO {
  id: string;
  storyId: string;
  order: number;
  text: string;
}

export interface GetStorySegmentsResult {
  storyId: string;
  segments: SegmentDTO[];
}

export class GetStorySegments {
  constructor(private readonly storyRepository: StoryRepository) {}

  async execute(input: GetStorySegmentsInput): Promise<GetStorySegmentsResult> {
    const storyId = StoryId.create(input.storyId);
    const story = await this.storyRepository.findById(storyId);

    if (!story) {
      throw new StoryNotFoundError(input.storyId);
    }

    const fragments = story.getFragments();
    const segments: SegmentDTO[] = fragments.map((f: StoryFragment) => ({
      id: f.getId().getValue(),
      storyId: f.getStoryId().getValue(),
      order: f.getOrder(),
      text: f.getText(),
    }));

    return {
      storyId: storyId.getValue(),
      segments,
    };
  }
}
