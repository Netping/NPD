function count(obj) {
  var count = 0;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) ++count;
  }
  return count;
}

function getHoursMins(ts = false) {
  var d = new Date();
  if (ts) {
    var coeff = 1000 * 60;
    var output = Math.round(d.getTime() / coeff) * coeff;
  } else {
    var hours = d.getHours();
    var minutes = "0" + d.getMinutes();
    var output = hours + ':' + minutes.substr(-2);
  }
  return output;
}

function clearLogs() {
  localStorage.removeItem('log');
}
