import { createAppConfig } from './config/appConfig.js';
import { IsimudNode } from './core/IsimudNode.js';

const config = createAppConfig();

const node = new IsimudNode({ config });

node.start();
