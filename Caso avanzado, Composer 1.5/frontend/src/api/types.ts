export interface Profile {
  id: string;
  name: string;
  readingLevel: string;
  themes: string[];
}

export interface Story {
  id: string;
  title: string;
  profileId: string;
  segmentCount: number;
  createdAt: string;
}

export interface Segment {
  id: string;
  storyId: string;
  order: number;
  text: string;
}

export interface SegmentsResponse {
  storyId: string;
  segments: Segment[];
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
