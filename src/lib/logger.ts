import { TConfig } from '../../types';
import { logger } from 'redis-smq-common';
import { ICompatibleLogger, TLoggerConfig } from 'redis-smq-common/dist/types';

function getConfigParams(config: TConfig): TLoggerConfig {
  return (
    config.logger ?? {
      enabled: true,
    }
  );
}

export function getLoggerInstance(config: TConfig): ICompatibleLogger {
  return logger.getLogger(getConfigParams(config));
}

export function getNamespacedLoggerInstance(
  config: TConfig,
  namespace: string,
): ICompatibleLogger {
  return logger.getNamespacedLogger(getConfigParams(config), namespace);
}
