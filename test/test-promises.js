var assert = require('assert');

describe("test Promise.props", function() {
  it("nested Promises", function() {
    Promise.props = require('../index.js');

    assert.equal(1,1);
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

    function success(results) {
      assert.equal(results.lvl1, 1)
      assert.equal(results.something, 3);
      assert.equal(results.nestedPromise.nested, 2);
    }

    Promise.props(o).then(success).catch(assert.fail);

  });
});
