export class FragmentId {
  private constructor(private readonly value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('FragmentId debe ser un string no vacío');
    }
  }

  static create(value: string): FragmentId {
    return new FragmentId(value);
  }

  getValue(): string {
    return this.value;
  }
}
