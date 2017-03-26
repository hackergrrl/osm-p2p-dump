var YAML = require('js-yaml')
YAML.parse = YAML.safeLoad
YAML.stringify = YAML.safeDump

module.exports = function (osm, opts) {
  osm.ready(function () {
    var q = osm.queryStream([[-Infinity, Infinity], [-Infinity, Infinity]], { order: 'type' })

    q.on('data', function (doc) {
      var str = opts.json ? JSON.stringify(doc) : YAML.stringify(doc)
      console.log(str)
    })
  })
}
