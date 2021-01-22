$(document).ready(function () {
  console.log('notifications.js');
  // console.log(JSON.parse(localStorage.getItem('nPermission')));
  // notifyMe('low', 'w2')
  notificationsSet()
})

function notifyMe(what, id) {
  var title = 'Оповещение';
  if (what == 'low') title = 'Низкая температура';
  if (what == 'high') title = 'Высокая температура';
  var notification = new Notification(title, {
    // tag: 'werfasrtsert',
    body: 'Датчик ' + id,
    icon: '/img/icon-refresh.svg'
  });
}

function notificationsSet() {
  localStorage.setItem('nPermission', JSON.stringify('denied'));
  if (!('Notification' in window))
    alert('Браузер не поддерживает уведомления');
  else if (Notification.permission === 'granted') {
    localStorage.setItem('nPermission', JSON.stringify('granted'));
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (!('permission' in Notification))
        Notification.permission = permission;
      if (permission === 'granted')
        localStorage.setItem('nPermission', JSON.stringify('granted'));
    });
  }
}
