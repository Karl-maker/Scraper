import { Configuration } from ".";
import { EnvironmentVariableNotFoundError } from "../utils/error/env.var.not.found.error";

// Mock environment variables
const envMock = {
    VALID_VAR: "some_value",
    EMPTY_VAR: undefined,
};

describe("Configuration", () => {
    let config: Configuration;

    beforeEach(() => {
        config = new Configuration(envMock);
        config.data = {}; // Ensure a fresh instance
    });

    test("should load environment variables correctly", () => {
        const rules = [
            { required: true, name: "VALID_VAR", description: "A valid variable", default: "default_value" },
        ];

        config.load(rules);
        
        expect(config.data["VALID_VAR"]).toBe("some_value");
    });

    test("should throw error when required env variable is missing", () => {
        const rules = [
            { required: true, name: "MISSING_VAR", description: "Missing variable", default: "default_value" },
        ];

        expect(() => config.load(rules)).toThrow(EnvironmentVariableNotFoundError);
    });

    test("should use default value if optional env variable is missing", () => {
        const rules = [
            { required: false, name: "EMPTY_VAR", description: "Optional variable", default: "default_value" },
        ];

        config.load(rules);

        expect(config.data["EMPTY_VAR"]).toBe("default_value");
    });
});
