#!/usr/bin/env node

var dump = require('./')
var argv = require('minimist')(process.argv)
var mkdirp = require('mkdirp')
var path = require('path')

// treat --log as a flag, not an arg-accepting param
if ((argv.l || argv.log) && (argv.l !== true || argv.log !== true)) {
  argv._.push(argv.l || argv.log)
  argv.l = argv.log = true
}

if (!argv._[2] || argv.h || argv.help) {
  return printUsageAndDie()
}
var dir = argv._[2]

var hyperlog = require('hyperlog')
var level = require('level')
var fdstore = require('fd-chunk-store')
var osmdb = require('osm-p2p-db')
var path = require('path')

var db = {}

if (argv.l || argv.log) {
  var subdir = 'osm-p2p-dump-' + (''+Math.random()).substring(2)
  var tmpdir = path.join(require('os').tmpdir(), subdir)
  mkdirp.sync(tmpdir)
  db = {
    log: level(dir),
    index: level(path.join(tmpdir, 'index')),
    kdb: path.join(tmpdir, 'kdb')
  }
  console.error('Building indexes in', tmpdir)
} else {
  db = {
    log: level(path.join(dir, 'log')),
    index: level(path.join(dir, 'index')),
    kdb: path.join(dir, 'kdb')
  }
}

var osm = osmdb({
  log: hyperlog(db.log, { valueEncoding: 'json' }),
  db: db.index,
  store: fdstore(4096, db.kdb)
})

dump(osm, {
  json: argv.j || argv.json,
  heads: argv.h || argv.heads
})
  .pipe(process.stdout)

function printUsageAndDie () {
  var str = require('fs').createReadStream(path.join(__dirname, 'USAGE'))
  str.pipe(process.stdout)
  str.on('end', function () {
    process.exit(0)
  })
}
