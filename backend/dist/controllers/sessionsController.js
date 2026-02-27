import { ApiError } from '../errors/apiError.js';
export class SessionsController {
    service;
    constructor(service) {
        this.service = service;
    }
    listSessions = async (_req, res) => {
        const items = await this.service.listSessions();
        res.json(items);
    };
    getSession = async (req, res) => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            throw new ApiError(400, 'VALIDATION_ERROR', 'id inválido.');
        }
        const session = await this.service.getSession(id);
        res.json(session);
    };
}
//# sourceMappingURL=sessionsController.js.map