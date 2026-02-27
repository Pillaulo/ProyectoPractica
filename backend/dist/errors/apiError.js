export class ApiError extends Error {
    status;
    code;
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
export function toErrorResponse(err) {
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
//# sourceMappingURL=apiError.js.map