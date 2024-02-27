import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@notifications/config';
import { winstonLogger } from '@remus1504/micrograde';

import { Logger } from 'winston';

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_ENDPOINT}`,
  'notificationElasticSearchServer',
  'debug',
);

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_ENDPOINT}`,
});

export async function checkConnection(): Promise<void> {
  let Connected = false;
  while (!Connected) {
    try {
      const healthOfConnection: ClusterHealthResponse =
        await elasticSearchClient.cluster.health({});
      log.info(
        `Notification Elasticsearch health  - ${healthOfConnection.status}`,
      );
      Connected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed.');
      log.log('error', 'NotificationService Connection() method:', error);
    }
  }
}
