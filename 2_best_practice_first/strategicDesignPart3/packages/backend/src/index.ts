/**
 * Application Entry Point
 *
 * This file exports the Express app for:
 * - Testing (import app without starting server)
 * - E2E tests with supertest
 *
 * To start the actual server, run server.ts instead.
 *
 * Usage:
 * - Tests: import { app } from './index'
 * - Production: node server.js (runs server.ts)
 */

import { CompositionRoot } from './shared/compositionRoot';

const compositionRoot = CompositionRoot.getInstance();

export const app = compositionRoot.getApp();
