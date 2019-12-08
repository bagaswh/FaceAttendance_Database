const _ = require('lodash');

function diff(object, base) {
  let idx = 0;
  function changes(object, base) {
    return _.transform(object, (result, value, key) => {
      if (!_.isEqual(value, base[key])) {
        result[idx++] = base[key];
      }
    });
  }

  let _diff = changes(object, base);
  return _diff.length ? _diff : null;
}

module.exports = { diff };
