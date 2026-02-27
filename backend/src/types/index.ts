export interface StoryRequest {
    nombre_nino: string;
    edad: number;
    tema: string;
    personaje_principal: string;
    vocabulario: 'simple' | 'medio';
}

export interface StoryResponse {
    titulo: string;
    frases: string[];
    parrafos: string[];
}

export interface StorySession extends StoryRequest, StoryResponse {
    id: number;
    created_at: string;
}

export interface ApiError {
    error: {
        code: string;
        message: string;
    };
}
