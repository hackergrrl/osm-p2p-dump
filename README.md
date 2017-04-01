# osm-p2p-dump

> dump an osm-p2p-db's documents as json or yaml

## CLI Usage

```
USAGE:

  osm-p2p-dump [OPTIONS]... [DIR]

  Where DIR is the osm-p2p-db directory containing at least the 'log'
  directory. If 'index' and/or 'kdb' DBs aren't present, they will be generated
  on-demand.

  -h, --help                display this help and exit
  -j, --json                output as newline-delimited json
  -y, --yaml                output as newline-delimited yaml (default)
  -l, --log                 operate on a hyperlog directly; generates temporary
                            indexes automatically
  -t, --top                 only print top-level (head) documents (not their
                            older revisions)
```

## API Usage

```js
var hyperlog = require('hyperlog')
var level = require('level')
var fdstore = require('fd-chunk-store')
var osmdb = require('osm-p2p-db')
var path = require('path')

var dir = './my-osm'

var db = {
  log: level(path.join(dir, 'log')),
  index: level(path.join(dir, 'index')),
  kdb: path.join(dir, 'kdb')
}
var osm = osmdb({
  log: hyperlog(db.log, { valueEncoding: 'json' }),
  db: db.index,
  store: fdstore(4096, db.kdb)
})

dump(osm, { yaml: true }).pipe(process.stdout)
```

outputs

```yaml
lon: '-77.33539890738986'
lat: '-1.247132436749568'
changeset: '4789966977437948099'
type: node
tags:
  waterway: river
  name: Oguinipare
  'source:gps': '1: 272'
id: '5787341593761533338'
version: c11c128bef5d4e42821de18c71aecfe6db6a5af4674e14d2c9fc007f5ec9787c

lon: '-77.30498626284746'
lat: '-1.2469688001361812'
changeset: '4789966999437948098'
type: node
id: '17939142601352302929'
version: 197fe82ae611444483e7185b661fb902f170a98eecc146f17a03b8fea404fd31

...
```

## API

```js
var dump = require('osm-p2p-dump')
```

### dump(osm[, opts])

Returns a readable stream of newline-delimited YAML or JSON, depending on
whether `opts.json` or `opts.yaml` is set. Defaults to YAML.

By default, all versions of all documents are dumped. To get only the latest
version of each document, set `opts.heads` to `true`.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install osm-p2p-dump
```

for API use, or

```
$ npm install -g osm-p2p-dump
```

for command-line use.

## License

ISC

