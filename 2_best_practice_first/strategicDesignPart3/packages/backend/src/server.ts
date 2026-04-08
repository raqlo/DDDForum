import { CompositionRoot } from './shared/compositionRoot';

const port = Number(process.env.PORT) || 3000;

const compositionRoot = CompositionRoot.getInstance(port);

const webServer = compositionRoot.getWebServer();

webServer.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
