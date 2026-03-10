/**
 * Test de integración: SqliteStoryRepository con base de datos real (SQLite :memory:)
 */
import Database from 'better-sqlite3';
import { createDatabase } from '../../infra/database';
import { SqliteProfileRepository } from './SqliteProfileRepository';
import { SqliteStoryRepository } from './SqliteStoryRepository';
import { ReaderProfile } from '../../domain/entities/ReaderProfile';
import { Story } from '../../domain/entities/Story';
import { StoryFragment } from '../../domain/entities/StoryFragment';
import { ReaderId } from '../../domain/value-objects/ReaderId';
import { StoryId } from '../../domain/value-objects/StoryId';
import { FragmentId } from '../../domain/value-objects/FragmentId';
import { ReadingLevel } from '../../domain/value-objects/ReadingLevel';
import { Theme } from '../../domain/value-objects/Theme';
import { v4 as uuidv4 } from 'uuid';

describe('SqliteStoryRepository (integración)', () => {
  let db: Database.Database;
  let profileRepo: SqliteProfileRepository;
  let storyRepo: SqliteStoryRepository;

  beforeAll(() => {
    db = createDatabase(':memory:');
    profileRepo = new SqliteProfileRepository(db);
    storyRepo = new SqliteStoryRepository(db);
  });

  afterAll(() => {
    db.close();
  });

  it('persiste y recupera un cuento con sus segmentos', async () => {
    const profileId = ReaderId.create(uuidv4());
    const profile = ReaderProfile.create(
      profileId,
      'Test Reader',
      ReadingLevel.create('basico'),
      [Theme.create('animales')]
    );
    await profileRepo.save(profile);

    const storyId = StoryId.create(uuidv4());
    const fragments = [
      StoryFragment.create(FragmentId.create(uuidv4()), storyId, 1, 'Había una vez'),
      StoryFragment.create(FragmentId.create(uuidv4()), storyId, 2, 'un niño valiente.'),
      StoryFragment.create(FragmentId.create(uuidv4()), storyId, 3, 'Y colorín colorado.'),
    ];
    const story = Story.create(storyId, 'El niño valiente', profileId, fragments);

    await storyRepo.save(story);

    const recovered = await storyRepo.findById(storyId);
    expect(recovered).not.toBeNull();
    expect(recovered!.getTitle()).toBe('El niño valiente');
    expect(recovered!.getFragmentCount()).toBe(3);
    expect(recovered!.getFragments()[0].getText()).toBe('Había una vez');
    expect(recovered!.getFragments()[1].getOrder()).toBe(2);
  });

  it('lista cuentos por profileId', async () => {
    const profileId = ReaderId.create(uuidv4());
    const profile = ReaderProfile.create(
      profileId,
      'Luna',
      ReadingLevel.create('intermedio'),
      []
    );
    await profileRepo.save(profile);

    const storyId = StoryId.create(uuidv4());
    const frag = StoryFragment.create(
      FragmentId.create(uuidv4()),
      storyId,
      1,
      'Párrafo uno'
    );
    const story = Story.create(storyId, 'Cuento de Luna', profileId, [frag]);
    await storyRepo.save(story);

    const byProfile = await storyRepo.findByProfileId(profileId);
    expect(byProfile.length).toBeGreaterThanOrEqual(1);
    expect(byProfile.some((s) => s.getTitle() === 'Cuento de Luna')).toBe(true);
  });
});
