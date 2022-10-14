# HTTP API Reference

## Table of Content

1. Queues & Namespaces
   1. [POST /api/queues](#post-apiqueues)
   2. [GET /api/queues](#get-apiqueues)
   3. [GET /api/ns](#get-apins)
   4. [DELETE /api/ns/:ns](#delete-apinsns)
   5. [GET /api/ns/:ns/queues](#get-apinsnsqueues)
   6. [DELETE /api/ns/:ns/queues/:queueName](#delete-apinsnsqueuesqueuename)
2. Acknowledged Messages
   1. [GET /api/ns/:ns/queues/:queueName/acknowledged-messages](#get-apinsnsqueuesqueuenameacknowledged-messages)
   2. [DELETE /api/ns/:ns/queues/:queueName/acknowledged-messages](#delete-apinsnsqueuesqueuenameacknowledged-messages)
   3. [DELETE /api/ns/:ns/queues/:queueName/acknowledged-messages/:id](#delete-apinsnsqueuesqueuenameacknowledged-messagesid)
   4. [POST /api/ns/:ns/queues/:queueName/acknowledged-messages/:id/requeue](#post-apinsnsqueuesqueuenameacknowledged-messagesidrequeue)
3. Dead-lettered Messages
   1. [GET /api/ns/:ns/queues/:queueName/dead-lettered-messages](#get-apinsnsqueuesqueuenamedead-lettered-messages)
   2. [DELETE /api/ns/:ns/queues/:queueName/dead-lettered-messages](#delete-apinsnsqueuesqueuenamedead-lettered-messages)
   3. [DELETE /api/ns/:ns/queues/:queueName/dead-lettered-messages/:id](#delete-apinsnsqueuesqueuenamedead-lettered-messagesid)
   4. [POST /api/ns/:ns/queues/:queueName/dead-lettered-messages/:id/requeue](#post-apinsnsqueuesqueuenamedead-lettered-messagesidrequeue)
4. Pending Messages
   1. [GET /api/ns/:ns/queues/:queueName/pending-messages](#delete-apinsnsqueuesqueuenamepending-messages)
   2. [DELETE /api/ns/:ns/queues/:queueName/pending-messages](#delete-apinsnsqueuesqueuenamepending-messages)
   3. [DELETE /api/ns/:ns/queues/:queueName/pending-messages/:id](#delete-apinsnsqueuesqueuenamepending-messagesid)
5. Scheduled Messages
   1. [GET /api/main/scheduled-messages](#get-apimainscheduled-messages)
   2. [DELETE /api/main/scheduled-messages](#delete-apimainscheduled-messages)
   3. [DELETE /api/main/scheduled-messages/:id](#delete-apimainscheduled-messagesid)
6. Queue Rate limiting
   1. [POST /api/ns/:ns/queues/:queueName/rate-limit](#post-apinsnsqueuesqueuenamerate-limit)
   2. [GET /api/ns/:ns/queues/:queueName/rate-limit](#get-apinsnsqueuesqueuenamerate-limit)
   3. [DELETE /api/ns/:ns/queues/:queueName/rate-limit](#delete-apinsnsqueuesqueuenamerate-limit)
   
## Queues

### POST /api/queues

**JSON Body properties**

* `name` *(string): Required.* Queue name.
* `ns` *(string): Optional.* Queue namespace.
* `enablePriorityQueuing` *(boolean): Required* Enable/disable priority queuing.

Example:

```json

{
   "name": "my-queue",
   "enablePriorityQueuing": false
}

```

**Response Body**

```json
{
   "queue": {
      "name": "my-queue",
      "ns": "default"
   },
   "settings": {
      "priorityQueuing": false,
      "rateLimit": null,
      "exchange":null
   }
}
```

### GET /api/queues

**Response body**

```text
{
   "data": [
      {
         "ns": "my-application",
         "name": "notifications"
      },
      {
         "ns": "my-application",
         "name": "orders"
      },
      {
         "ns": "my-application",
         "name": "confirmation_emails"
      }
   ]
}
```

### GET /api/ns

**Response body**

```text
{
    "data": [
        "namespace_a",
        "namespace_b",
        "testing"
   ]
}
```

### DELETE /api/ns/:ns

**Path parameters**

* `ns` (string): Required. Namespace.

**Response Body**

```text
204 No Content
```

### GET /api/ns/:ns/queues

**Path parameters**

* `ns` (string): Required. Namespace.

**Response Body**

```text
{
   "data": [
      {
         "ns": "my-app-namespace",
         "name": "notifications"
      },
      {
         "ns": "my-app-namespace",
         "name": "orders"
      },
      {
         "ns": "my-app-namespace",
         "name": "confirmation_emails"
      }
   ]
}
```

### DELETE /api/ns/:ns/queues/:queueName

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.

**Response Body**

```text
204 No Content
```

## Acknowledged Messages

### GET /api/ns/:ns/queues/:queueName/acknowledged-messages

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.

**Query parameters**

* `skip` (number): Optional. Offset from where messages should be taken. Starts from 0.
* `take` (number): Optional. Max number of messages that should be taken. Starts from 1.

**Response Body**

```text
{
   "data": {
      "total": 1,
      "items": [
         {
            "sequenceId": 0,
            "message": {
               "body": {
                  "hello": "world"
               },
               "priority": null,
               "scheduledCron": null,
               "scheduledDelay": null,
               "scheduledRepeatPeriod": null,
               "scheduledRepeat": 0,
               "scheduledCronFired": false,
               "attempts": 0,
               "scheduledRepeatCount": 0,
               "delayed": false,
               "expired": false,
               "queue": {
                  "ns": "my-application",
                  "name": "test_queue"
               },
               "createdAt": 1635702165317,
               "publishedAt": 1737595989746,
               "scheduledAt": null,
               "uuid": "9e7b8046-200c-48de-aa9f-2caf0a172a83",
               "ttl": 0,
               "retryDelay": 0,
               "retryThreshold": 3,
               "consumeTimeout": 0
            }
         }
      ]
   }
}
```

### DELETE /api/ns/:ns/queues/:queueName/acknowledged-messages

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.

**Response Body**

```text
204 No Content
```

### DELETE /api/ns/:ns/queues/:queueName/acknowledged-messages/:id

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.
* `id` (string): Required. Message ID.

**Query parameters**

* `sequenceId` (number): Required. Message sequence ID.

**Response Body**

```text
204 No Content
```

### POST /api/ns/:ns/queues/:queueName/acknowledged-messages/:id/requeue

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.
* `id` (string): Required. Message ID.

**Query parameters**

* `sequenceId` (number): Required. Message sequence ID.

**Response Body**

```text
204 No Content
```

## Dead-lettered Messages

### GET /api/ns/:ns/queues/:queueName/dead-lettered-messages

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.

**Query parameters**

* `skip` (number): Optional. Offset from where messages should be taken. Starts from 0.
* `take` (number): Optional. Max number of messages that should be taken. Starts from 1.

**Response Body**

```text
{
   "data": {
      "total": 1,
      "items": [
         {
            "sequenceId": 0,
            "message": {
               "body": { "hello": "world" },
               "priority": null,
               "scheduledCron": null,
               "scheduledDelay": null,
               "scheduledRepeatPeriod": null,
               "scheduledRepeat": 0,
               "scheduledCronFired": false,
               "attempts": 2,
               "scheduledRepeatCount": 0,
               "delayed": false,
               "expired": false,
               "queue": {
                  "ns": "my-application",
                  "name": "test_queue"
               },
               "createdAt": 1635702165317,
               "publishedAt": 1737595989746,
               "scheduledAt": 1637523400376,
               "uuid": "9e7b8046-200c-48de-aa9f-2caf0a172a83",
               "ttl": 0,
               "retryDelay": 0,
               "retryThreshold": 3,
               "consumeTimeout": 0
            }
         }
      ]
   }
}
```

### DELETE /api/ns/:ns/queues/:queueName/dead-lettered-messages

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.

**Response Body**

```text
204 No Content
```

### DELETE /api/ns/:ns/queues/:queueName/dead-lettered-messages/:id

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.
* `id` (string): Required. Message ID.

**Query parameters**

* `sequenceId` (number): Required. Message sequence ID.

**Response Body**

```text
204 No Content
```

### POST /api/ns/:ns/queues/:queueName/dead-lettered-messages/:id/requeue

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.
* `id` (string): Required. Message ID.

**Query parameters**

* `sequenceId` (number): Required. Message sequence ID.
* `priority` (number): Optional. Message priority. When provided, the message will be re-queued with priority.

**Response Body**

```text
204 No Content
```

## Pending Messages

### GET /api/ns/:ns/queues/:queueName/pending-messages


**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.

**Query parameters**

* `skip` (number): Optional. Offset from where messages should be taken. Starts from 0.
* `take` (number): Optional. Max number of messages that should be taken. Starts from 1.

**Response Body**

```text
{
   "data": {
      "total": 1,
      "items": [
         {
            "sequenceId": 0,
            "message": {
               "body": { "hello": "world" },
               "priority": null,
               "scheduledCron": null,
               "scheduledDelay": null,
               "scheduledRepeatPeriod": null,
               "scheduledRepeat": 0,
               "scheduledCronFired": false,
               "attempts": 0,
               "scheduledRepeatCount": 0,
               "delayed": false,
               "expired": false,
               "queue": {
                  "ns": "my-application",
                  "name": "test_queue"
               },
               "createdAt": 1635702165317,
               "publishedAt": 1635702167654,
               "scheduledAt": null,
               "uuid": "9e7b8046-200c-48de-aa9f-2caf0a172a83",
               "ttl": 0,
               "retryDelay": 0,
               "retryThreshold": 3,
               "consumeTimeout": 0
            }
         }
      ]
   }
}
```

### DELETE /api/ns/:ns/queues/:queueName/pending-messages

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.

**Response Body**

```text
204 No Content
```

### DELETE /api/ns/:ns/queues/:queueName/pending-messages/:id

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.
* `id` (string): Required. Message ID.

**Query parameters**

* `sequenceId` (number): Required. Message sequence ID.

**Response Body**

```text
204 No Content
```

## Scheduled Messages

### GET /api/main/scheduled-messages

**Query parameters**

* `skip` (number): Optional. Offset from where messages should be taken. Starts from 0.
* `take` (number): Optional. Max number of messages that should be taken. Starts from 1.

**Response Body**

```text
{
   "data": {
      "total": 1,
      "items": [
         {
            "sequenceId": 0,
            "message": {
               "body": { "hello": "world" },
               "priority": null,
               "scheduledCron": null,
               "scheduledDelay": null,
               "scheduledRepeatPeriod": 10000,
               "scheduledRepeat": 6,
               "scheduledCronFired": false,
               "attempts": 0,
               "scheduledRepeatCount": 0,
               "delayed": false,
               "expired": false,
               "queue": {
                  "ns": "my-application",
                  "name": "test_queue"
               },
               "createdAt": 1635702165317,
               "publishedAt": null,
               "scheduledAt": 1635702163487,
               "uuid": "9e7b8046-200c-48de-aa9f-2caf0a172a83",
               "ttl": 0,
               "retryDelay": 0,
               "retryThreshold": 3,
               "consumeTimeout": 0
            }
         }
      ]
   }
}
```

### DELETE /api/main/scheduled-messages

**Path parameters**

* `queueName` (string): Required. Queue name.

**Response Body**

```text
204 No Content
```

### DELETE /api/main/scheduled-messages/:id

**Path parameters**

* `id` (string): Required. Message ID.

**Query parameters**

* `sequenceId` (number): Required. Message sequence ID.

**Response Body**

```text
204 No Content
```

## Queue Rate Limiting

### POST /api/ns/:ns/queues/:queueName/rate-limit

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.

**JSON Body properties**

* `limit` *(number): Required.* The maximum number of messages within an `interval`.
* `interval` *(number): Required.* The timespan for `limit` in milliseconds.

Example:

```json
{
   "interval": 10000,
   "limit": 15
}
```

**Response Body**

```text
204 No Content
```

### GET /api/ns/:ns/queues/:queueName/rate-limit

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.

**Response Body**

If a rate limit exists:

```text
{
   "data": {
      "interval": 10000,
      "limit": 15
   }
}
```

Otherwise:

```text
{
   "data": null
}
```

### DELETE /api/ns/:ns/queues/:queueName/rate-limit

**Path parameters**

* `ns` (string): Required. Queue namespace.
* `queueName` (string): Required. Queue name.

**Response Body**

```text
204 No Content
```