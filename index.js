var YAML = require('js-yaml')
YAML.parse = YAML.safeLoad
YAML.stringify = YAML.safeDump

var through = require('through2')

module.exports = function (osm, opts) {
  var t = through.obj(write)

  osm.ready(function () {
    var q = osm.queryStream([[-Infinity, Infinity], [-Infinity, Infinity]], { order: 'type' })

    q.pipe(t)
  })

  function write (doc, enc, next) {
    var str = opts.json ? JSON.stringify(doc) : YAML.stringify(doc)
    this.push(str + '\n')
    next()
  }

  return t
}
