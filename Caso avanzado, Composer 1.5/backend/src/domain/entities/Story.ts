import { ReaderId } from '../value-objects/ReaderId';
import { StoryId } from '../value-objects/StoryId';
import { StoryFragment } from './StoryFragment';

export class Story {
  private constructor(
    private readonly id: StoryId,
    private readonly title: string,
    private readonly profileId: ReaderId,
    private readonly fragments: StoryFragment[],
    private readonly createdAt: Date
  ) {}

  static create(
    id: StoryId,
    title: string,
    profileId: ReaderId,
    fragments: StoryFragment[],
    createdAt?: Date
  ): Story {
    if (!title || title.trim().length === 0) {
      throw new Error('El título no puede estar vacío');
    }
    if (!fragments || fragments.length === 0) {
      throw new Error('Un cuento debe tener al menos un fragmento');
    }
    return new Story(id, title.trim(), profileId, [...fragments], createdAt ?? new Date());
  }

  getId(): StoryId {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getProfileId(): ReaderId {
    return this.profileId;
  }

  getFragments(): StoryFragment[] {
    return [...this.fragments].sort((a, b) => a.getOrder() - b.getOrder());
  }

  getFragmentCount(): number {
    return this.fragments.length;
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }
}
