var assert = require('assert');

describe("test Promise.props", function() {
  var o = {
    lvl1: Promise.resolve(1),
    lvl2: {
      a: Promise.resolve(1),
      b: [Promise.resolve(1), Promise.resolve(1), Promise.resolve(1), {i: Promise.resolve(1)}]
    },
    something: 3
  };

  o.nestedPromise = new Promise(function(resolve, reject) {
    o.lvl1.then(resolve.bind(null, {nested: 2})).catch(reject);
  });

  it("nested Promises", function() {
    Promise.props = require('../index.js');

    function success(results) {
      assert.equal(results.nestedPromise.nested, 2);
    }

    Promise.props(o).then(success).catch(assert.fail);
  });

  it("1 level deep", function() {

    Promise.props(o).then(function(results) {
      assert.equal(results.lvl1, 1)
    }).catch(assert.fail);
  });

  it("Not a promise value", function() {
    Promise.props(o).then(function(results) {
      assert.equal(results.something, 3);
    }).catch(assert.fail);
  });

});
