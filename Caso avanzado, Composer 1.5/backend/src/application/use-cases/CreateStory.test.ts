import { CreateStory, ProfileNotFoundError } from './CreateStory';
import { InMemoryProfileRepository } from '../../adapters/persistence/InMemoryProfileRepository';
import { InMemoryStoryRepository } from '../../adapters/persistence/InMemoryStoryRepository';
import { StubLLMProvider } from '../../adapters/llm/StubLLMProvider';
import { ReaderProfile } from '../../domain/entities/ReaderProfile';
import { ReaderId } from '../../domain/value-objects/ReaderId';
import { ReadingLevel } from '../../domain/value-objects/ReadingLevel';
import { Theme } from '../../domain/value-objects/Theme';
import { v4 as uuidv4 } from 'uuid';

describe('CreateStory', () => {
  const profileRepository = new InMemoryProfileRepository();
  const storyRepository = new InMemoryStoryRepository();
  const llmProvider = new StubLLMProvider();

  const createStory = new CreateStory(
    profileRepository,
    storyRepository,
    llmProvider
  );

  beforeEach(() => {
    profileRepository.clear();
    storyRepository.clear();
  });

  it('lanza ProfileNotFoundError cuando el perfil no existe', async () => {
    const fakeProfileId = uuidv4();

    await expect(
      createStory.execute({ profileId: fakeProfileId })
    ).rejects.toThrow(ProfileNotFoundError);

    await expect(
      createStory.execute({ profileId: fakeProfileId })
    ).rejects.toThrow(`Perfil no encontrado: ${fakeProfileId}`);
  });

  it('genera y persiste un cuento cuando el perfil existe', async () => {
    const profileId = ReaderId.create(uuidv4());
    const profile = ReaderProfile.create(
      profileId,
      'Luna',
      ReadingLevel.create('basico'),
      [Theme.create('animales')]
    );
    await profileRepository.save(profile);

    const result = await createStory.execute({
      profileId: profileId.getValue(),
    });

    expect(result.story).toBeDefined();
    expect(result.story.getTitle()).toBeTruthy();
    expect(result.story.getFragmentCount()).toBeGreaterThan(0);
    expect(result.story.getProfileId().equals(profileId)).toBe(true);

    const persisted = await storyRepository.findById(result.story.getId());
    expect(persisted).not.toBeNull();
    expect(persisted?.getId().equals(result.story.getId())).toBe(true);
  });

  it('divide el texto del LLM en fragmentos ordenados', async () => {
    llmProvider.setMockResponse(
      'Párrafo uno.\n\nPárrafo dos.\n\nPárrafo tres.'
    );

    const profileId = ReaderId.create(uuidv4());
    const profile = ReaderProfile.create(
      profileId,
      'Leo',
      ReadingLevel.create('intermedio'),
      []
    );
    await profileRepository.save(profile);

    const result = await createStory.execute({
      profileId: profileId.getValue(),
    });

    const fragments = result.story.getFragments();
    expect(fragments.length).toBe(3);
    expect(fragments[0].getOrder()).toBe(1);
    expect(fragments[1].getOrder()).toBe(2);
    expect(fragments[2].getOrder()).toBe(3);
    expect(fragments[0].getText()).toContain('Párrafo uno');
  });
});
