import { ReadingLevel } from '../domain/value-objects/ReadingLevel';
import { Theme } from '../domain/value-objects/Theme';

export interface GenerateStoryParams {
  readerName: string;
  readingLevel: ReadingLevel;
  themes: Theme[];
  maxLength?: number;
}

export interface LLMProvider {
  generateStory(params: GenerateStoryParams): Promise<string>;
}
