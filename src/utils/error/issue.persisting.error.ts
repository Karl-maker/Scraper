export class IssuePersistingError extends Error {
    constructor(entity: string) {
        super(`Issue persisting the entity: ${entity}`);
        this.name = 'IssuePersistingError';
    }
}