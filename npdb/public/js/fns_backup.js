function putLastValue(id, val) {
  var logObj = JSON.parse(localStorage.getItem('log'));
  var now = getHoursMins();
  var nowStamp = getHoursMins(true) / 1000;
  var minus10Stamp = nowStamp - 600;
  if (!logObj) logObj = {};
  // if no widget obj
  if (typeof logObj[id] !== 'object') {
    logObj[id] = {};
    logObj[id][nowStamp] = {
      now,
      val
    };
  } else {
    // if no stamp entry
    if (typeof logObj[id][nowStamp] !== 'object') {
      logObj[id][nowStamp] = {
        now,
        val
      };
    } else {
      // dont add but cut to 10 min last entries
      var currentObject = logObj[id];
      var slicedObject = {};
      for (var stamp in currentObject) {
        if (parseInt(stamp) > minus10Stamp) {
          slicedObject[stamp] = currentObject[stamp];
        }
      }
      logObj[id] = slicedObject;
    }
  }

  // then count object
  var objectLength = 0;
  for (var stamp in logObj[id]) {
    if (parseInt(stamp) > minus10Stamp) {
      objectLength++;
    }
  }

  // last or prelast value
  var lastValue = {
    now: '00:00',
    val: '00'
  };
  if (objectLength == 1) {
    lastValue = logObj[id][nowStamp];
  } else if (objectLength > 1) {
    lastValue = Object.entries(logObj[id]).slice(-2, -1)[0][1];
  }

  localStorage.setItem('log', JSON.stringify(logObj));
  // return string for 'last value' block
  return lastValue;
}
