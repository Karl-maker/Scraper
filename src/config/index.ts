import { ConfigurationRule } from "../types/configuration.type";
import { EnvironmentVariableNotFoundError } from "../utils/error/env.var.not.found.error";

export class Configuration {
    public data: Record<string, string> = {};
    private env: Record<string, string | undefined> = {};
    /**
     * @param env this is process.env
     */
    constructor(env: Record<string, string | undefined>) {
        this.env = { ...env }
    }

    load (rules: ConfigurationRule[]) : void {
        for(let i = 0; i < rules.length; i++) {
            const current = rules[i];
            const data = this.env[current.name];

            if(!data && current.required) throw new EnvironmentVariableNotFoundError(current.name, current.description);
            if(!data) 
                this.data[current.name] = current.default ?? "";
            else 
                this.data[current.name] = data;
        }
    }
    
}