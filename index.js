'use strict';

var Promise = require('bluebird')
var prop = require('dot-prop')
var ware = require('ware')

function Aldous(props) {
  if (!(this instanceof Aldous)) {
    return new Aldous(props)
  }

  this._plugins = ware()
  this._props = props || {}

  return this
}

Aldous.prototype.get = function get(name) {
  return prop.get(this._props, name)
}

Aldous.prototype.has = function has(name) {
  var props = this._props
  var key, path

  if (name.indexOf('.') === -1) {
    return props.hasOwnProperty(name)
  }

  path = name.split('.')
  key = path.pop()
  props = this.get(path.join('.'))

  return props && props.hasOwnProperty(key)
}

Aldous.prototype.run = function run(input, callback) {
  var runAsync = Promise.promisify(this._plugins.run.bind(this._plugins))
  var promise = runAsync(input, this)
  var retval = promise

  if (callback) {
    retval = this
    promise.nodeify(callback)
  }

  return retval
}

Aldous.prototype.set = function set(name, value) {
  var self = this
  if (typeof name === 'string') {
    prop.set(this._props, name, value)
  } else if (typeof name === 'object') {
    Object.keys(name).forEach(function(key) {
      self.set(key, name[key])
    })
  }
  return this
}

Aldous.prototype.toJSON = function toJSON() {
  return JSON.parse(JSON.stringify(this._props))
}

Aldous.prototype.toObject = function toObject() {
  return this._props
}

Aldous.prototype.toString = function toString() {
  return JSON.stringify(this._props)
}

Aldous.prototype.use = function use(plugin) {
  this._plugins.use(plugin)
  return this
}

module.exports = Aldous
