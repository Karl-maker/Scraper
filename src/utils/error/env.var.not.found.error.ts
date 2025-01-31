export class EnvironmentVariableNotFoundError extends Error {
    constructor(private variable_name: string, description?: string) {
        super(`Environment Variable [${variable_name}] Not Found${ description ? `: "${description}"` : "" }.`)
    }
}