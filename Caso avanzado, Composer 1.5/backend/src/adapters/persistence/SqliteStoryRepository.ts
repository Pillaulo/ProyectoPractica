import Database from 'better-sqlite3';
import { ReaderId } from '../../domain/value-objects/ReaderId';
import { StoryId } from '../../domain/value-objects/StoryId';
import { FragmentId } from '../../domain/value-objects/FragmentId';
import { Story } from '../../domain/entities/Story';
import { StoryFragment } from '../../domain/entities/StoryFragment';
import { StoryRepository } from '../../ports/StoryRepository';

interface StoryRow {
  id: string;
  title: string;
  profile_id: string;
  created_at: string;
}

interface SegmentRow {
  id: string;
  story_id: string;
  order_index: number;
  text: string;
}

export class SqliteStoryRepository implements StoryRepository {
  constructor(private readonly db: Database.Database) {}

  async save(story: Story): Promise<void> {
    const storyId = story.getId().getValue();
    const profileId = story.getProfileId().getValue();
    const createdAt = story.getCreatedAt().toISOString();

    const insertStory = this.db.prepare(`
      INSERT OR REPLACE INTO stories (id, title, profile_id, created_at)
      VALUES (?, ?, ?, ?)
    `);
    insertStory.run(storyId, story.getTitle(), profileId, createdAt);

    this.db.prepare('DELETE FROM story_segments WHERE story_id = ?').run(storyId);

    const insertSegment = this.db.prepare(`
      INSERT INTO story_segments (id, story_id, order_index, text)
      VALUES (?, ?, ?, ?)
    `);

    for (const fragment of story.getFragments()) {
      insertSegment.run(
        fragment.getId().getValue(),
        fragment.getStoryId().getValue(),
        fragment.getOrder(),
        fragment.getText()
      );
    }
  }

  async findById(id: StoryId): Promise<Story | null> {
    const storyRow = this.db
      .prepare('SELECT id, title, profile_id, created_at FROM stories WHERE id = ?')
      .get(id.getValue()) as StoryRow | undefined;

    if (!storyRow) return null;

    const segmentRows = this.db
      .prepare('SELECT id, story_id, order_index, text FROM story_segments WHERE story_id = ? ORDER BY order_index')
      .all(storyRow.id) as SegmentRow[];

    const storyId = StoryId.create(storyRow.id);
    const profileId = ReaderId.create(storyRow.profile_id);
    const fragments = segmentRows.map((row) =>
      StoryFragment.create(
        FragmentId.create(row.id),
        storyId,
        row.order_index,
        row.text
      )
    );

    return Story.create(
      storyId,
      storyRow.title,
      profileId,
      fragments,
      new Date(storyRow.created_at)
    );
  }

  async findByProfileId(profileId: ReaderId): Promise<Story[]> {
    const storyRows = this.db
      .prepare('SELECT id, title, profile_id, created_at FROM stories WHERE profile_id = ? ORDER BY created_at DESC')
      .all(profileId.getValue()) as StoryRow[];

    const stories: Story[] = [];
    for (const storyRow of storyRows) {
      const story = await this.findById(StoryId.create(storyRow.id));
      if (story) stories.push(story);
    }
    return stories;
  }

  async delete(id: StoryId): Promise<void> {
    this.db.prepare('DELETE FROM story_segments WHERE story_id = ?').run(id.getValue());
    this.db.prepare('DELETE FROM stories WHERE id = ?').run(id.getValue());
  }
}
