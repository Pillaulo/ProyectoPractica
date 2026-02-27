export type ApiErrorCode = 'VALIDATION_ERROR' | 'GROQ_ERROR' | 'INTERNAL_ERROR' | 'NOT_FOUND';

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: ApiErrorCode;

  constructor(status: number, code: ApiErrorCode, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function toErrorResponse(err: unknown): { status: number; body: { error: { code: string; message: string } } } {
  if (err instanceof ApiError) {
    return {
      status: err.status,
      body: { error: { code: err.code, message: err.message } },
    };
  }

  return {
    status: 500,
    body: { error: { code: 'INTERNAL_ERROR', message: 'Error inesperado.' } },
  };
}

