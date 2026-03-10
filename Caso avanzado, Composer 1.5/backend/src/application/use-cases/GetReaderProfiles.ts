import { ReaderProfile } from '../../domain/entities/ReaderProfile';
import { ProfileRepository } from '../../ports/ProfileRepository';

export interface GetReaderProfilesResult {
  profiles: ReaderProfile[];
}

export class GetReaderProfiles {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(): Promise<GetReaderProfilesResult> {
    const profiles = await this.profileRepository.findAll();
    return { profiles };
  }
}
