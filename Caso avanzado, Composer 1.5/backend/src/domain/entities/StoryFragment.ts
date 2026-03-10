import { FragmentId } from '../value-objects/FragmentId';
import { StoryId } from '../value-objects/StoryId';

export class StoryFragment {
  private constructor(
    private readonly id: FragmentId,
    private readonly storyId: StoryId,
    private readonly order: number,
    private readonly text: string
  ) {}

  static create(id: FragmentId, storyId: StoryId, order: number, text: string): StoryFragment {
    if (order < 1) {
      throw new Error('El orden debe ser al menos 1');
    }
    if (!text || text.trim().length === 0) {
      throw new Error('El texto del fragmento no puede estar vacío');
    }
    return new StoryFragment(id, storyId, order, text.trim());
  }

  getId(): FragmentId {
    return this.id;
  }

  getStoryId(): StoryId {
    return this.storyId;
  }

  getOrder(): number {
    return this.order;
  }

  getText(): string {
    return this.text;
  }
}
