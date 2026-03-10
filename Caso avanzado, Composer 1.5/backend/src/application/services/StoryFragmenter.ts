/**
 * Servicio de dominio para dividir el texto de un cuento en fragmentos.
 * Estrategia: párrafos por \n\n; si exceden MAX_CHARS, dividir por oraciones.
 */
const MAX_CHARS_PER_FRAGMENT = 200;
const SENTENCE_ENDINGS = /[.!?]\s+/g;

export class StoryFragmenter {
  static fragment(fullText: string): string[] {
    if (!fullText || fullText.trim().length === 0) {
      return [];
    }

    const trimmed = fullText.trim();
    const paragraphs = trimmed.split(/\n\n+/).filter((p) => p.trim().length > 0);

    const fragments: string[] = [];

    for (const para of paragraphs) {
      if (para.length <= MAX_CHARS_PER_FRAGMENT) {
        fragments.push(para.trim());
      } else {
        const sentences = para.split(SENTENCE_ENDINGS);
        let current = '';

        for (const sentence of sentences) {
          const withEnding = sentence.trim() + '.';
          if (current.length + withEnding.length <= MAX_CHARS_PER_FRAGMENT) {
            current = current ? current + ' ' + withEnding : withEnding;
          } else {
            if (current) {
              fragments.push(current.trim());
            }
            current = withEnding;
          }
        }
        if (current) {
          fragments.push(current.trim());
        }
      }
    }

    return fragments.filter((f) => f.length > 0);
  }
}
