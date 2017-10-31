var _ = require('lodash');
_.mixin(require('lodash-flatkeystree'));

module.exports = function(o) {
  return new Promise(function(resolve, reject) {
    var allkeys = _.keysDeep(o);
    var promiseKeys = _.filter(allkeys, function(k) {
      return _.get(o, k) instanceof Promise;
    });
    var promiseValues = _.map(promiseKeys, function(k) {
      return _.get(o, k);
    });

    //clone o tree
    var o2 = {};
    _.each(allkeys, function(k) {
      var v = _.get(o, k);

      var t = v;

      if(/\.\d+\.*/.test(k)) {
        _.reduce(k.split("."), function(result, value, key) {
          if(result != '') {
            var i = _.get(o, result);
            if(i instanceof Promise) {
              //nothing
            } else if(Array.isArray(i)) {
              _.set(o2, result, []);
            } else if(typeof i == 'object') {
              _.set(o2, result, {});
            }
          }
          return ((result != "") ? result + '.' : '') + value;

        }, '');
      }


      if(v instanceof Promise)
        t = null

      _.set(o2, k, t);
    });

    Promise.all(promiseValues).catch(reject).then(function(results) {
      _.each(results, function(v, k) {
        var l = promiseKeys[k];

        _.set(o2, l, v);
        resolve(o2);
      });
    });
  });
};
