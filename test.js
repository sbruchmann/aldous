'use strict';

var Aldous = require('./')
var expect = require('chai').expect

describe('Aldous', function() {
  beforeEach(function() {
    var props = {
      property: 'value',
      deeply: {
        nested: {
          property: 'value'
        }
      }
    }

    this.aldous = Aldous(props)
    this.props = props
  })

  describe('#get', function() {
    it('returns the value of a requested property', function() {
      var actual = this.aldous.get('property')
      var expected = this.props.property
      expect(actual).to.equal(expected)
    })

    it('returns the value of a requested nested property', function() {
      var actual = this.aldous.get('deeply.nested.property')
      var expected = this.props.deeply.nested.property
      expect(actual).to.equal(expected)
    })
  })

  describe('#has', function() {
    it('returns true if the requested property is defined', function() {
      expect(this.aldous.has('deeply.nested.property')).to.equal(true)
    })
  })

  describe('#set', function() {
    it('sets the value of a property', function() {
      var actual, expected
      expected = 'foo'
      this.aldous.set('property', expected)
      actual = this.aldous.get('property')
      expect(actual).to.equal(expected)
    })

    it('sets the value of a nested property', function() {
      var actual, expected
      expected = 'foo'
      this.aldous.set('deeply.nested.property', expected)
      actual = this.aldous.get('deeply.nested.property')
      expect(actual).to.equal(expected)
    })

    it('extends properties', function() {
      var aldous = this.aldous

      aldous.set({
        newProperty: 'newValue',
        'deeply.nested.property': 'foo'
      })

      expect(aldous.get('newProperty')).to.equal('newValue')
      expect(aldous.get('deeply.nested.property')).to.equal('foo')
    })
  })

  describe("#use", function() {
    it('should mount a plugin', function() {
      var fn = function() {}
      this.aldous.use(fn)
      expect(this.aldous._plugins.fns[0]).to.equal(fn)
    })
  })

  describe('#run', function() {
    it('should run all plugins', function(done) {
      var count = 0
      this.aldous
        .use(function(input, aldous, next) {
          setImmediate(next)
          count += 1
        })
        .use(function(input, aldous, next) {
          setImmediate(next)
          count += 1
        })
        .use(function(input, aldous, next) {
          setImmediate(next)
          count += 1
        })
        .run([], function callback(err) {
          if (err) return done(err)
          expect(count).to.equal(3)
          done()
        })
    })
  })
})
