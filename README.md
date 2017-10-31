# Usage

```js
Promise.props = require('promise-allprops');

var obj = {
  one: new Promise(function(r, f) { setTimeout(r.bind(null, "success!"), 5000); });
  arr: [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]
};

obj.nested = obj.one.then(function() {
  //one is done, now do something
  return "Great success!"
});

Promise.props(obj).then(console.log).catch(console.error);
```
