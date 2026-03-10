export class ReaderId {
  private constructor(private readonly value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('ReaderId debe ser un string no vacío');
    }
  }

  static create(value: string): ReaderId {
    return new ReaderId(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ReaderId): boolean {
    return this.value === other.value;
  }
}
