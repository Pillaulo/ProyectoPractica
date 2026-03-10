import { ReaderId } from '../../domain/value-objects/ReaderId';
import { StoryId } from '../../domain/value-objects/StoryId';
import { FragmentId } from '../../domain/value-objects/FragmentId';
import { ReaderProfile } from '../../domain/entities/ReaderProfile';
import { Story } from '../../domain/entities/Story';
import { StoryFragment } from '../../domain/entities/StoryFragment';
import { ProfileRepository } from '../../ports/ProfileRepository';
import { StoryRepository } from '../../ports/StoryRepository';
import { LLMProvider } from '../../ports/LLMProvider';
import { StoryFragmenter } from '../services/StoryFragmenter';
import { v4 as uuidv4 } from 'uuid';

export interface CreateStoryInput {
  profileId: string;
  maxLength?: number;
}

export interface CreateStoryResult {
  story: Story;
}

export class CreateStory {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly storyRepository: StoryRepository,
    private readonly llmProvider: LLMProvider
  ) {}

  async execute(input: CreateStoryInput): Promise<CreateStoryResult> {
    const profileId = ReaderId.create(input.profileId);
    const profile = await this.profileRepository.findById(profileId);

    if (!profile) {
      throw new ProfileNotFoundError(profileId.getValue());
    }

    const rawText = await this.llmProvider.generateStory({
      readerName: profile.getName(),
      readingLevel: profile.getReadingLevel(),
      themes: profile.getThemes(),
      maxLength: input.maxLength ?? 200,
    });

    const textFragments = StoryFragmenter.fragment(rawText);
    if (textFragments.length === 0) {
      throw new Error('El LLM no devolvió texto válido para fragmentar');
    }

    const storyId = StoryId.create(uuidv4());
    const domainFragments: StoryFragment[] = textFragments.map((text, index) => {
      const fragmentId = FragmentId.create(uuidv4());
      return StoryFragment.create(fragmentId, storyId, index + 1, text);
    });

    const title = this.extractTitle(textFragments[0]);
    const story = Story.create(
      storyId,
      title,
      profile.getId(),
      domainFragments,
      new Date()
    );

    await this.storyRepository.save(story);
    return { story };
  }

  private extractTitle(firstFragment: string): string {
    const firstSentence = firstFragment.split(/[.!?]/)[0]?.trim() ?? firstFragment;
    return firstSentence.length > 80 ? firstSentence.substring(0, 77) + '...' : firstSentence;
  }
}

export class ProfileNotFoundError extends Error {
  constructor(profileId: string) {
    super(`Perfil no encontrado: ${profileId}`);
    this.name = 'ProfileNotFoundError';
  }
}
