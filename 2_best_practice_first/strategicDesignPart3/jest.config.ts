import { Config } from "jest";

const config: Config = {
    verbose: true,
    projects: [
        {
            preset: 'ts-jest',
            displayName: 'e2e',
            testEnvironment: 'node',
            testMatch: ['<rootDir>/packages/backend/tests/e2e/**/*.spec.ts'],
            rootDir: '.',
            transform: {
                '^.+\\.(t|j)s$': 'ts-jest',
            },
            transformIgnorePatterns: [
                // npm: exclude all node_modules except @faker-js
                'node_modules/(?!@faker-js).+',
                // pnpm: exclude all node_modules except @faker-js
                'node_modules/.pnpm/.+/node_modules/(?!@faker-js).+'
            ],
            moduleFileExtensions: ['js', 'json', 'ts'],
        },
        {
            preset: 'ts-jest',
            displayName: 'e2efront',
            testEnvironment: 'node',
            testMatch: ['<rootDir>/packages/frontend/tests/e2e/**/*.spec.ts'],
            rootDir: '.',
            transform: {
                '^.+\\.(t|j)s$': 'ts-jest',
            },
            transformIgnorePatterns: [
                // npm: exclude all node_modules except @faker-js
                'node_modules/(?!@faker-js).+',
                // pnpm: exclude all node_modules except @faker-js
                'node_modules/.pnpm/.+/node_modules/(?!@faker-js).+'
            ],
            moduleFileExtensions: ['js', 'json', 'ts'],
        },
    ],
    // Run one at a time to avoid port and other conflicts
    maxWorkers: 1,
};

export default config;