'use strict';

var Aldous = require('../../')
var fs = require('fs')
var locals = require('./locals.json')
var path = require('path')

function getSourceSync(dirPath) {
  return fs.readdirSync(dirPath).map(function(file) {
    var filePath = path.resolve(dirPath, file)
    return {
      path: filePath,
      source: fs.readFileSync(filePath)
    }
  })
}

function dumpOutput(output) {
  output.forEach(function(file) {
    file.source = file.source.toString()
    console.log(JSON.stringify(file, null, 2))
  })
}

Aldous({locals: locals})
  .set('locals.build_date', new Date())
  .use(function replaceVars(input, aldous, done) {
    var pattern = /\{([\w.]+)\}/gi
    setImmediate(done)
    input.forEach(function(file) {
      file.source = new Buffer(file.source.toString().replace(pattern, function(match, key) {
        var value = aldous.get('locals.' + key)

        if (value === undefined) {
          value = '[[Warning: Local variable "' + key + '" is undefined]]'
        }

        return value
      }))
    })
  })

  .run(
    getSourceSync(path.join(__dirname, 'source')),
    function(err, output) {
      if (err) throw err
      dumpOutput(output)
    }
  )
