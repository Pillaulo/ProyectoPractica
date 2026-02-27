import { StoryRequest, StoryResponse } from '../types';
import { generateStoryFromGroq } from '../provider/groqProvider';
import { saveStorySession } from '../repository/sqliteRepository';

export const generateAndSaveStory = async (request: StoryRequest): Promise<StoryResponse> => {
    // 1. Call Groq Provider
    const storyResponse = await generateStoryFromGroq(request);

    // 2. Save to Data Layer (Repository)
    await saveStorySession(request, storyResponse);

    // 3. Return the response
    return storyResponse;
};
