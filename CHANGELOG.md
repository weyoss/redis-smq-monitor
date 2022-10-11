# CHANGELOG

## 7.1.1 (2022-10-11)

* build: bump up redis-smq to v7.1.1 (c78a291)
* build: bump up redis-smq-monitor-client to v7.1.1 (f8f61d0)
* Fix(ConsumerEventListener): fix event listener memory leak (35b26b3)

## 7.1.0 (2022-10-06)

* build: bump up redis-smq-monitor-client to v7.1.0 (a8a9885)
* test: fix test errors (095b1c0)
* build: fix broken import (e35d23a)
* build: fix type-coverage warnings (77c3ac3)
* build: bump up redis-smq to v7.1.0 (e0d00d0)
* docs: update README.md (604fb8a)
* test: increase code coverage (d8e624b)
* fix(ExchangeService): use createExchange() instead of saveExchange() (f80082a)
* feat(config): add an option for upstream redis-smq configuration (a2738f5)
* docs(examples): fix typing error (15bc340)
* feat: allow to create a queue from home page (e0d1401)
* feat(message-exchange): add ExchangesService and ExchangesController (76f1303)
* test: reorganize test files (09e92ad)
* test: increase code coverage (f67428a)
* refactor(common): improve MessageDTO (aefc927)
* test: fix broken tests (4584105)
* feat(message-exchange): pull changes from redis-smq, update codebase (b9d692a)

## 7.0.7 (2022-08-11)

* Update tests (53d03cd)
* Bump up redis-smq-common to v1.0.2 and redis-smq to v7.0.7 (93e1ce7)
* Update NPM dependencies (43723c5)

## 7.0.6 (2022-07-20)

* Sync event listeners with redis-smq v7.0.5 updates (fb84d6c)
* Bump up redis-smq to v7.0.5 (09a4c11)

## 7.0.5 (2022-07-15)

* Update installation info (aacfbb7)
* Make redis-smq-common as a peer dependency (011c8d9)
* Bump up typescript to v4.7.4 (f599892)

## 7.0.4 (2022-07-12)

* Improve redis-smq peer dependency version syntax (9cc00f8)
* Fix npm vulnerability warnings (1f8e7c6)

## 7.0.3 (2022-06-28)

* Fix type-coverage errors (758e692)
* Bump up redis-smq-monitor-client to v7.0.3 (0bd6815)
* Bump up socket.io to v4.4.1 (bd86e5c)

## 7.0.2 (2022-06-20)

* Fix peer dependencies (502c88a)

## 7.0.1 (2022-06-20)

* Bump up redis-smq to v7.0.1 (ad1ed80)
* Merge branch 'master' of https://github.com/weyoss/redis-smq-monitor (7cf4268)
* Bump up redis-smq-monitor-client to v7.0.0 (322a385)

## 7.0.0-rc.5 (2022-06-12)

* Add examples (965c2e4)
* Disable logging by default (258c233)
* Clean up WebsocketRateStreamWorker (9b1ae86)
* Fix package-lock.json (a4978a9)
* Add .codecov.yml (ea93fdf)
* 7.0.0-rc.4 (5bf5923)
* Update docs (9939159)
* Bump up redis-smq to v7.0.0-rc.8, refactor (81bb8d3)
* Fix type coverage (0dbe132)

## 7.0.0-rc.4 (2022-06-09)

* Update docs (9939159)
* Bump up redis-smq to v7.0.0-rc.8, refactor (81bb8d3)
* Fix type coverage (0dbe132)

## 7.0.0-rc.3 (2022-06-01)

* Update redis-keys.ts (70851b9)
* Support node-redis v4 (5099a3e)
* Update README.md (91650d0)
* Drop support for Node.js v12 (6601adb)

## 7.0.0-rc.2 (2022-05-27)

* Fix .npmignore file

## 7.0.0-rc.1 (2022-05-27)

* Add missing docs
* Update README.md
* Fix github workflows
* Fix husky scripts
* Initial commit, move monitor files from redis-smq