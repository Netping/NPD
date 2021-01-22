function renderWidget(formObj) {
  $.ajax({
    url: '/device',
    data: formObj,
  }).done(function (data) {
    $('.workplace').append(data);
    // minmax markers
    let $widget = $('#' + formObj.id);
    $widget.data('min', formObj.npmin);
    $widget.data('max', formObj.npmax);
    $widget.css({
      left: formObj.left < 0 ? 2 : formObj.left,
      top: formObj.top < 0 ? 2 : formObj.top,
    });
    $widget.draggable({
      stop: function (event, ui) {
        let draggetID = ui.helper[0].id;
        editWidget(draggetID, ui.position);
      }
    });
    refreshWidget(formObj);
  });
}

function putLastValue(id, val) {
  var logObj = JSON.parse(localStorage.getItem('log'));
  var time = getHoursMins();
  var stamp = getHoursMins(true) / 1000;
  var newValue = {
    stamp: stamp,
    time: time,
    val: val
  };
  if (!logObj) logObj = {};
  if (typeof logObj[id] !== 'object') {
    logObj[id] = {
      lastChanged: {
        stamp: stamp,
        time: time,
        val: val
      },
      current: {
        stamp: stamp,
        time: time,
        val: val
      }
    };
  } else {
    // change current to new
    if (val != logObj[id].current.val) {
      // but first change last to current
      if (logObj[id].current.val != logObj[id].lastChanged.val) {
        logObj[id].lastChanged = logObj[id].current
      }
      logObj[id].current = newValue;
    }
  }

  localStorage.setItem('log', JSON.stringify(logObj));
  // return string for 'last value' block
  return logObj[id].lastChanged;
}

function refreshWidget(formObj, firstInit = false) {
  // write last data
  $.ajax({
    url: '/getinfo',
    data: formObj,
  }).done(function (data) {
    let $widget = $('#' + formObj.id);
    $widget.find('.data .current span').text(data);
    let lastValue = putLastValue(formObj.id, data);
    $widget.find('.data .last .time').text(lastValue.time);
    $widget.find('.data .last .temp').text(lastValue.val);
    let $dataWrapper = $widget.find('> div');
    let dataNum = parseInt(data);
    let min = parseInt($widget.data('min'));
    let max = parseInt($widget.data('max'));
    // $dataWrapper.removeClass();
    if (dataNum < min) {
      if (!$dataWrapper.hasClass('low') && firstInit) notifyMe('low', formObj.id)
      $dataWrapper.addClass('low');
    } else if (dataNum > max) {
      if (!$dataWrapper.hasClass('high') && firstInit) notifyMe('high', formObj.id)
      $dataWrapper.addClass('high');
    } else $dataWrapper
      .removeClass('high')
      .removeClass('low')
      .addClass('ok');
    // console.log(lastValue);
  });
}

function addWidget(formObj) {
  var widgetsObj = JSON.parse(localStorage.getItem('widgets'));
  if (!widgetsObj) widgetsObj = {};
  var newID = 'w';
  for (var i = 0; i < (count(widgetsObj) + 1); i++) {
    if (!widgetsObj.hasOwnProperty('w' + i)) {
      newID = 'w' + i;
      formObj['id'] = newID;
      break;
    }
  }
  widgetsObj[newID] = formObj;
  localStorage.setItem('widgets', JSON.stringify(widgetsObj));
  renderWidget(formObj);
}

function removeWidget(id) {
  var widgetsObj = JSON.parse(localStorage.getItem('widgets'));
  if (widgetsObj) {
    delete widgetsObj[id];
  }
  var widgetsObjJson = JSON.stringify(widgetsObj);
  localStorage.setItem('widgets', widgetsObjJson);
  $('#' + id).remove();
}

function getWidgetOptions(id) {
  var widgetsObj = JSON.parse(localStorage.getItem('widgets'));
  var options = widgetsObj[id];
  return options;
}

function editWidget(id, formObj, reRender = false) {
  var widgetsObj = JSON.parse(localStorage.getItem('widgets'));
  var updatedObject = {
    ...widgetsObj[id],
    ...formObj
  };
  widgetsObj[id] = updatedObject;
  localStorage.setItem('widgets', JSON.stringify(widgetsObj));

  // keep same place
  if (reRender) {
    $('#' + id).remove();
    renderWidget(updatedObject);
  }
}

function clearStorage() {
  localStorage.removeItem('widgets');
}
