import './loaders';
import { runInCluster } from './utils';
import { bootstrap } from './app';

if (process.env.CLUSTER_MODE === 'on') {
  runInCluster(bootstrap);
} else {
  bootstrap();
}
