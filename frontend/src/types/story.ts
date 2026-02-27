export type VocabularyLevel = 'simple' | 'medio';

export type StoryRequest = {
  nombre_nino: string;
  edad: number;
  tema: string;
  personaje_principal: string;
  vocabulario: VocabularyLevel;
};

export type StoryResponse = {
  titulo: string;
  frases: string[];
  parrafos: string[];
};

export type SessionListItem = {
  id: number;
  created_at: string;
  nombre_nino: string;
  tema: string;
  titulo: string;
};

export type SessionDetail = SessionListItem & {
  edad: number;
  personaje_principal: string;
  vocabulario: VocabularyLevel;
  frases: string[];
  parrafos: string[];
};

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

