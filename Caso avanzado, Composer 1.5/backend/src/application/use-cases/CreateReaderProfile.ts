import { ReaderId } from '../../domain/value-objects/ReaderId';
import { ReadingLevel } from '../../domain/value-objects/ReadingLevel';
import { Theme } from '../../domain/value-objects/Theme';
import { ReaderProfile } from '../../domain/entities/ReaderProfile';
import { ProfileRepository } from '../../ports/ProfileRepository';
import { v4 as uuidv4 } from 'uuid';

export interface CreateReaderProfileInput {
  name: string;
  readingLevel: string;
  themes?: string[];
}

export interface CreateReaderProfileResult {
  profile: ReaderProfile;
}

export class CreateReaderProfile {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(input: CreateReaderProfileInput): Promise<CreateReaderProfileResult> {
    const id = ReaderId.create(uuidv4());
    const readingLevel = ReadingLevel.create(input.readingLevel);
    const themes = (input.themes ?? []).map((t) => Theme.create(t));
    const profile = ReaderProfile.create(id, input.name, readingLevel, themes);

    await this.profileRepository.save(profile);
    return { profile };
  }
}
