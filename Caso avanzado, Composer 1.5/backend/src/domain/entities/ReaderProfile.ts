import { ReaderId } from '../value-objects/ReaderId';
import { ReadingLevel } from '../value-objects/ReadingLevel';
import { Theme } from '../value-objects/Theme';

export class ReaderProfile {
  private constructor(
    private readonly id: ReaderId,
    private readonly name: string,
    private readonly readingLevel: ReadingLevel,
    private readonly themes: Theme[]
  ) {}

  static create(
    id: ReaderId,
    name: string,
    readingLevel: ReadingLevel,
    themes: Theme[] = []
  ): ReaderProfile {
    if (!name || name.trim().length === 0) {
      throw new Error('El nombre no puede estar vacío');
    }
    return new ReaderProfile(id, name.trim(), readingLevel, themes);
  }

  getId(): ReaderId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getReadingLevel(): ReadingLevel {
    return this.readingLevel;
  }

  getThemes(): Theme[] {
    return [...this.themes];
  }
}
