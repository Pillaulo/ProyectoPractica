import { ReaderId } from '../../domain/value-objects/ReaderId';
import { ReaderProfile } from '../../domain/entities/ReaderProfile';
import { ProfileRepository } from '../../ports/ProfileRepository';

export class InMemoryProfileRepository implements ProfileRepository {
  private readonly profiles = new Map<string, ReaderProfile>();

  async save(profile: ReaderProfile): Promise<void> {
    this.profiles.set(profile.getId().getValue(), profile);
  }

  async findById(id: ReaderId): Promise<ReaderProfile | null> {
    return this.profiles.get(id.getValue()) ?? null;
  }

  async findAll(): Promise<ReaderProfile[]> {
    return Array.from(this.profiles.values());
  }

  clear(): void {
    this.profiles.clear();
  }
}
