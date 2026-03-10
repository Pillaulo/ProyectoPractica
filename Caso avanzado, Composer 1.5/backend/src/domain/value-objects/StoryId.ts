export class StoryId {
  private constructor(private readonly value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('StoryId debe ser un string no vacío');
    }
  }

  static create(value: string): StoryId {
    return new StoryId(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: StoryId): boolean {
    return this.value === other.value;
  }
}
