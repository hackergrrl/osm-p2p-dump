#!/usr/bin/env node

var dump = require('./')
var argv = require('minimist')(process.argv)

if (!argv._[2] || argv.h || argv.help) {
  return printUsageAndDie()
}
var dir = argv._[2]

var hyperlog = require('hyperlog')
var level = require('level')
var fdstore = require('fd-chunk-store')
var osmdb = require('osm-p2p-db')
var path = require('path')

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

dump(osm, {
  json: argv.j || argv.json
})
  .pipe(process.stdout)

function printUsageAndDie () {
  var str = require('fs').createReadStream('USAGE')
  str.pipe(process.stdout)
  str.on('end', function () {
    process.exit(0)
  })
}
