<div align="center" style="text-align: center">
  <p><a href="https://github.com/weyoss/redis-smq"><img alt="RedisSMQ" src="./logo.png" /></a></p>
  <p>A simple high-performance Redis message queue for Node.js.</p>
</div>

# RedisSMQ Monitor

<p>
    <a href="https://github.com/weyoss/redis-smq-monitor/actions/workflows/tests.yml"><img src="https://github.com/weyoss/redis-smq-monitor/actions/workflows/tests.yml/badge.svg" alt="Tests" style="max-width:100%;" /></a>
    <a href="https://npmjs.org/package/redis-smq" rel="nofollow"><img src="https://img.shields.io/npm/v/redis-smq.svg" alt="NPM version" /></a>
    <a href="https://codecov.io/github/weyoss/redis-smq-monitor?branch=master" rel="nofollow"><img src="https://img.shields.io/codecov/c/github/weyoss/redis-smq-monitor" alt="Coverage Status" /></a>
    <a href="https://lgtm.com/projects/g/weyoss/redis-smq-monitor/context:javascript" rel="nofollow"><img src="https://img.shields.io/lgtm/grade/javascript/github/weyoss/redis-smq-monitor.svg?logo=lgtm&logoWidth=18" alt="Code quality" /></a>
</p>

RedisSMQ Monitor is an application which lets you monitor, debug, and manage [RedisSMQ message queue](https://github.com/weyoss/redis-smq).

It provides the following components:

- [Message Rate plugins](/docs/plugins/message-rate.md). A couple of plugins are required to be registered within the RedisSMQ for viewing the 
  rate at which messages are produced, consumed, or dead-lettered across different queues and consumers.  
- [An HTTP API](/docs/http-api.md). The `HTTP API` interface enables you to manage the message queue from your application using the HTTP protocol.

The monitor uses and ships with [RedisSMQ Monitor Client](https://github.com/weyoss/redis-smq-monitor-client) as a default Web UI client.

## Configuration

```javascript
'use strict';

module.exports = {
  redis: {
    client: 'redis',
    options: {
      host: '127.0.0.1',
      port: 6379,
      connect_timeout: 3600000,
    },
  },
  logger: {
    enabled: true,
    options: {
      level: 'info',
      /*
      streams: [
          {
              path: path.normalize(`${__dirname}/../logs/redis-smq-monitor.log`)
          },
      ],
      */
    },
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
    socketOpts: {
      // ...
    }
  }
};
```

**Parameters**

- `redis` *(object): Optional.* See [Redis Configuration](https://github.com/weyoss/redis-smq-common/blob/master/docs/redis.md) for more details.

- `logger` *(object): Optional.* See [Logs Configuration](https://github.com/weyoss/redis-smq-common/blob/master/docs/logs.md) for more details.

- `server`*(object): Optional.*

- `server.host` *(String): Optional.* IP address of the monitor server. By default, `0.0.0.0`.

- `server.port` *(Integer): Optional.* Port of the monitor server. By default, `7210`.

- `server.basePath` *(String): Optional.* Let the Web UI know that it is running behind a reverse proxy server and use a base path (for example `/monitor`) to render links and redirects correctly. See [Running the Web UI behind a reverse proxy](#running-the-web-ui-behind-a-reverse-proxy).

- `server.socketOpts` *(Object): Optional.* WebSocket parameters for `socket.io`. See [https://socket.io/docs/v4/server-api/#new-serverport-options](https://socket.io/docs/v4/server-api/#new-serverport-options) for more details.

## Usage

The Web UI can be launched and used as shown in the example bellow:

```javascript
'use strict';
const config = require('./config');
const { MonitorServer } = require('redis-smq-monitor');

const monitorServer = MonitorServer.createInstance(config);
await monitorServer.listen();
```

When running the example above, the expected output should be:

```text
[MonitorServer] Going up...
[MonitorServer] Up and running on 127.0.0.1:3000...
```

### Running the Web UI behind a reverse proxy

To run the Web UI behind a reverse proxy server you need first to configure correctly your server.

Depending on your setup, some extra steps may be required. The easiest way to start with is to serve the Web UI using a transparent proxy.

I am using Nginx as a proxy server, but you can use any other server depending on your preferences.

#### Transparent reverse proxy

Sample Nginx configuration:

```text
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}
upstream redis-smq {
    server 127.0.0.1:3000;
}
server {
    listen       5000;
    listen  [::]:5000;
    location / {
        proxy_pass http://redis-smq;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    }
}
```

No additional configuration is required.

#### Reverse proxy with URL rewrite

Sample Nginx configuration:

```text
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}
upstream redis-smq {
    server 127.0.0.1:3000;
}
server {
    listen       5000;
    listen  [::]:5000;
    location /monitor {
        proxy_pass http://redis-smq;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        rewrite  ^/monitor/(.*)  /$1 break;
    }
}
```

Additionally, you need to configure the basePath.

Sample RedisSMQ configuration:

```javascript
'use strict';

module.exports = {
  host: '127.0.0.1',
  port: 3000,
  basePath: '/monitor' // <-- using the base path
};
```

## License

[MIT](https://github.com/weyoss/redis-smq-monitor/blob/master/LICENSE)