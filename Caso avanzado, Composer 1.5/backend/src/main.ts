import { createContainer } from './infra/container';
import { createExpressApp } from './adapters/http/ExpressApp';
import { loadConfig } from './infra/config';

async function main(): Promise<void> {
  const config = loadConfig();
  const container = createContainer();
  const app = createExpressApp(container);

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
