import { Config } from "jest";

const config: Config = {
    verbose: true,
    projects: [
        {
            preset: 'ts-jest',
            displayName: 'backend-unit',
            testEnvironment: 'node',
            testMatch: ['<rootDir>/packages/backend/src/**/*.{test,spec}.ts'],
            rootDir: '.',
            moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
        },
        {
            preset: 'ts-jest',
            displayName: 'e2e',
            testEnvironment: 'node',
            testMatch: ['<rootDir>/packages/shared/tests/acceptance/**/*.spec.ts'],
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