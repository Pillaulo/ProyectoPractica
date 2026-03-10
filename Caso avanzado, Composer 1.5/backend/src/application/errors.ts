export class StoryNotFoundError extends Error {
  constructor(storyId: string) {
    super(`Cuento no encontrado: ${storyId}`);
    this.name = 'StoryNotFoundError';
  }
}
