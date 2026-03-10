export type ReadingLevelValue = 'inicial' | 'basico' | 'intermedio' | 'avanzado';

export class ReadingLevel {
  private constructor(private readonly value: ReadingLevelValue) {}

  static create(value: string): ReadingLevel {
    const valid: ReadingLevelValue[] = ['inicial', 'basico', 'intermedio', 'avanzado'];
    if (!valid.includes(value as ReadingLevelValue)) {
      throw new Error(`Nivel inválido: ${value}`);
    }
    return new ReadingLevel(value as ReadingLevelValue);
  }

  getValue(): ReadingLevelValue {
    return this.value;
  }
}
