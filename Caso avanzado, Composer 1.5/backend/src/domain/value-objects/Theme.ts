export type ThemeValue = 'animales' | 'fantasia' | 'aventuras' | 'amistad' | 'naturaleza';

export class Theme {
  private constructor(private readonly value: ThemeValue) {}

  static create(value: string): Theme {
    const valid: ThemeValue[] = ['animales', 'fantasia', 'aventuras', 'amistad', 'naturaleza'];
    if (!valid.includes(value as ThemeValue)) {
      throw new Error(`Tema inválido: ${value}`);
    }
    return new Theme(value as ThemeValue);
  }

  getValue(): ThemeValue {
    return this.value;
  }
}
