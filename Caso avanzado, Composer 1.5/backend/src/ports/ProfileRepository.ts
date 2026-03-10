import { ReaderId } from '../domain/value-objects/ReaderId';
import { ReaderProfile } from '../domain/entities/ReaderProfile';

export interface ProfileRepository {
  save(profile: ReaderProfile): Promise<void>;
  findById(id: ReaderId): Promise<ReaderProfile | null>;
  findAll(): Promise<ReaderProfile[]>;
}
