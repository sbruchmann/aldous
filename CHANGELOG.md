Changelog
=========

1.2.1
-----

### Fixes

 - `Aldous#run`: Fix signature of callback function

1.2.0
-----

### Changes

  - `Aldous#get` can now return a default value if the requested property is undefined
  - `Aldous#run` now returns a promise if no callback was specified


1.1.1
-----

### Changes

  - Clarified intent of Aldous. (Version bump needed for publishing on npm)


1.1.0
-----


### New APIs

  - `Aldous#has`: Returns whether a property exists.
  - Serialization: An instance of Aldous can now be serialized in to `JSON`, `object` or `string` by calling the corresponding methods `Aldous#toJSON`, `Aldous#toObject` and `Aldous#toString`.
