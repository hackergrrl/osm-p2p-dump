var YAML = require('js-yaml')
YAML.parse = YAML.safeLoad
YAML.stringify = YAML.safeDump

var through = require('through2')
var readonly = require('read-only-stream')

module.exports = function (osm, opts) {
  var t = through.obj(write)

  if (opts.heads) {
    osm.ready(function () {
      var q = osm.queryStream([[-Infinity, Infinity], [-Infinity, Infinity]], { order: 'type' })

      q.pipe(t)
    })
  } else {
    var r = osm.log.createReadStream()
    var x = through.obj(function (node, _, next) {
      var value = node.value
      var doc
      if (value.k) {
        doc = value.v
        doc.id = value.k
        doc.version = node.key
      } else {
        doc = {
          id: value.d,
          version: node.key,
          deleted: true
        }
      }
      next(null, doc)
    })
    r.pipe(x).pipe(t)
  }

  function write (doc, enc, next) {
    var str = opts.json ? JSON.stringify(doc) : YAML.stringify(doc)
    this.push(str + '\n')
    next()
  }

  return readonly(t)
}
