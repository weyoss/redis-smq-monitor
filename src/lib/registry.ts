import { errors, RedisClient } from 'redis-smq-common';
import { ICompatibleLogger } from 'redis-smq-common/dist/types';
import { TConfig } from '../../types';

export type TRegistryItems = {
  redis: RedisClient;
  logger: ICompatibleLogger;
  config: TConfig;
};

export type TRegistry = {
  register<T extends keyof TRegistryItems>(
    key: T,
    value: TRegistryItems[T],
  ): void;
  getItem<T extends keyof TRegistryItems>(key: T): TRegistryItems[T];
  reset(): void;
};

let registryMap: Record<string, any> = {};

export const registry: TRegistry = {
  register<T extends keyof TRegistryItems>(
    key: T,
    value: TRegistryItems[T],
  ): void {
    if (registryMap[key]) {
      throw new errors.PanicError(
        `An item with key [${key}] is already registered`,
      );
    }
    registryMap[key] = value;
  },

  getItem<T extends keyof TRegistryItems>(key: T): TRegistryItems[T] {
    if (!registryMap[key]) {
      throw new errors.PanicError(`Item with key [${key}] is not registered`);
    }
    return registryMap[key];
  },

  reset(): void {
    registryMap = {};
  },
};
