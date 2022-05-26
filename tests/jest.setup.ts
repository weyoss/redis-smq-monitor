import { startUp } from './common/start-up';
import { shutDown } from './common/shut-down';
import { initialize } from './common/initialize';

beforeAll(initialize);

afterAll(() => void 0);

beforeEach(async () => {
  await startUp();
});

afterEach(async () => {
  await shutDown();
});

jest.setTimeout(160000);
