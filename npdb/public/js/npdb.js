// /*Variables*/
// var uploadPanelButton = document.querySelector("#upload_background_btn");
// var addDeviceButton = document.querySelector("#add_device_btn");
// var settingsButton = document.querySelector("#settings_panel_btn");
// var modal = document.querySelector("#my_modal");
// var modal_content = document.querySelector("#modal_content");
// var modal_close_btn = document.querySelector(".close_modal_window");
// var d_point = document.querySelectorAll(".d_point");
// var map = document.querySelector("#map");
//
// var timerId = "";
//
// var img_result = "";
//
// var devices = {};
//
// /*Functions*/
// if (!Date.now) {
//   Date.now = function () {
//     return new Date().getTime();
//   }
// }
//
// function randomInteger(min, max) {
//   let rand = min - 0.5 + Math.random() * (max - min + 1);
//   return Math.round(rand);
// }
//
// /*Events*/
// settingsButton.addEventListener("click", function () {
//   var html = '<h3>Работа с конфигурацией</h3><ul class="nolist">' +
//     '<li><button id="saveToInet" class="btn btn-primary" disabled>Сохранить на сервер</button></li>' +
//     '<li><button id="loadFromInet" class="btn btn-primary" disabled>Загрузить с сервера</button></li>' +
//     '<li><button id="saveToFile" class="btn btn-primary" >Сохранить в файл</button></li>' +
//     '<li><button id="loadFromFile" class="btn btn-primary" >Загрузить из файла</button></li>' +
//     '<li><button id="saveToDevice" class="btn btn-primary" disabled>Сохранить на устройство NetPing</button></li>' +
//     '<li><button id="loadFromDevice" class="btn btn-primary" disabled>Загрузить с устройства NetPing</button></li>' +
//     '</ul>';
//   modal.style.display = "block";
//   modal_content.innerHTML = html;
//
//
// });
//
// uploadPanelButton.addEventListener("click", function () {
//   var html = '<h3>Варианты загрузки</h3><ul><li>С локального компьютера <input type="file" id="upload_local"></li><li>По ссылке <input type="text" id="upload_internet"></li></ul><div id="modal_preview_panel" class="preview_panel"></div><div class="btn_panel"><button id="uploadBackground" class="btn btn-primary">Загрузить</button></div>';
//   modal.style.display = "block";
//   modal_content.innerHTML = html;
//
//   var upload_local = document.getElementById("upload_local");
//   upload_local.addEventListener("change", function (event) {
//     var file = this.files ? this.files[0] : {
//         name: this.value
//       },
//       fileReader = window.FileReader ? new FileReader() : null;
//
//     if (file) {
//       if (fileReader) {
//         fileReader.addEventListener("loadend", function (e) {
//
//           var preview = document.querySelector("#modal_preview_panel");
//           preview.innerHTML = null;
//           tImg = document.createElement('img')
//           tImg.setAttribute('src', e.target.result);
//           preview.appendChild(tImg);
//         }, false);
//         fileReader.readAsDataURL(file);
//       }
//     }
//
//   }, false);
//
//   var upload_internet = document.getElementById("upload_internet");
//   upload_internet.addEventListener("change", function () {
//     var preview = document.querySelector("#modal_preview_panel");
//     preview.innerHTML = null;
//     tImg = document.createElement('img')
//     tImg.setAttribute('src', this.value);
//     console.log(tImg);
//     preview.appendChild(tImg);
//
//   }, false);
//
//
//   var uploadBackground = document.getElementById("uploadBackground");
//   uploadBackground.addEventListener("click", function () {
//     var preview = document.querySelector("#modal_preview_panel img");
//     mImg = document.createElement('img')
//     mImg.setAttribute('src', preview.getAttribute('src'));
//     map.appendChild(mImg);
//     localStorage.setItem('npdb_img', preview.getAttribute('src'));
//     modal.style.display = "none";
//   }, false);
//
//
//
// });
//
// addDeviceButton.addEventListener("click", function () {
//   var html = '<h3>Устройство</h3>' +
//     '<div class="btn_panel">' +
//     '<div class="form-group">' +
//     '<label for="dName">Имя устройства</label>' +
//     '<input type="text" class="form-control" id="dName" placeholder="Введите имя устройства">' +
//     '</div>' +
//     '<div>' +
//     '<div class="btn_panel"><button id="saveDevice" class="btn btn-primary">Сохранить</button></div>';
//   modal.style.display = "block";
//   modal_content.innerHTML = html;
//
//
//   var saveDeviceButton = document.getElementById("saveDevice");
//   saveDeviceButton.addEventListener("click", function () {
//
//     var device = {
//       id: 'd' + Date.now(),
//       name: document.querySelector("#dName").value,
//       x: 100,
//       y: 50,
//     };
//     addDeviceToLocal(device);
//     renderUnoDevice(device);
//     clearTimeout(timerId);
//     tickTack();
//     modal.style.display = "none";
//   }, false);
// });
//
// modal_close_btn.addEventListener("click", function () {
//   modal.style.display = "none";
// });
//
// window.addEventListener("click", function (event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// });
//
// if (localStorage.getItem('npdb_img')) {
//   mImg = document.createElement('img')
//   mImg.setAttribute('src', localStorage.getItem('npdb_img'));
//   map.appendChild(mImg);
// }
//
// function deviceMenu(dev) {
//
//   dev.addEventListener("contextmenu", function (e) {
//     e.preventDefault();
//     var title = dev.querySelector(".d_title").textContent;
//     var id = dev.getAttribute("id");
//     var html = '<h3>Устройство</h3>' +
//       '<div class="btn_panel">' +
//       '<div class="form-group">' +
//       '<label for="dName">Имя устройства</label>' +
//       '<input type="text" class="form-control" id="dName" placeholder="Введите имя устройства" value="' + title + '">' +
//       '</div>' +
//       '<div>' +
//       '<div class="btn_panel"><button id="saveDevice" class="btn btn-primary">Сохранить</button><button id="delDevice" class="btn btn-danger">Удалить</button></div>';
//     modal.style.display = "block";
//     modal_content.innerHTML = html;
//
//
//
//     document.getElementById("saveDevice").addEventListener("click", function () {
//
//       dev.querySelector(".d_title").textContent = document.querySelector("#dName").value;
//       saveDeviceDomToLocal(dev.getAttribute('id'));
//       modal.style.display = "none";
//     }, false);
//
//     document.getElementById("delDevice").addEventListener("click", function () {
//       dev.remove();
//       deleteDeviceDomFromLocal(id);
//       modal.style.display = "none";
//     }, false);
//
//
//     return false;
//   });
// }
//
// function moveDevice(dev) {
//   dev.onmousedown = function (e) {
//     if (e.which == 1) {
//       dev.style.position = 'absolute';
//       moveAt(e);
//       document.body.appendChild(dev);
//       dev.style.zIndex = 1000;
//
//       function moveAt(e) {
//         dev.style.left = (e.pageX - dev.offsetWidth / 2) + 'px';
//         dev.style.top = e.pageY - dev.offsetHeight / 2 + 'px';
//       }
//
//
//       document.onmousemove = function (e) {
//         moveAt(e);
//       }
//
//       dev.onmouseup = function (e) {
//
//         id = dev.getAttribute('id');
//         left = (dev.offsetLeft - map.offsetLeft);
//         top1 = dev.offsetTop - map.offsetTop;
//
//         document.onmousemove = null;
//         dev.onmouseup = null;
//         map.appendChild(dev);
//         dev.style.left = (left - map.offsetLeft) + 'px';
//
//         dev.style.left = left + 'px';
//         dev.style.top = top1 + 'px';
//
//         saveDeviceDomToLocal(dev.getAttribute('id'));
//       }
//     }
//   }
// }
//
// function getDevicesFromLocal() {
//   if (localStorage.getItem('npdb_devices')) {
//     return JSON.parse(localStorage.getItem('npdb_devices'));
//   }
//   return false;
// }
//
// function saveDevicesToLocal(obj) {
//   localStorage.setItem('npdb_devices', JSON.stringify(obj));
//   return true;
// }
//
// function saveDeviceDomToLocal(id) {
//   dev = document.getElementById(id);
//
//   var device = {
//     id: id,
//     name: dev.querySelector(".d_title").textContent,
//     x: dev.offsetLeft,
//     y: dev.offsetTop,
//   };
//   addDeviceToLocal(device);
//
//   return true;
// }
//
// function deleteDeviceDomFromLocal(id) {
//   var devs = getDevicesFromLocal();
//   if (devs != false) {
//     if (devs[id] != 'undefined') {
//       delete devs[id];
//     }
//   }
//   saveDevicesToLocal(devs);
//
//   return true;
// }
//
// function addDeviceToLocal(obj) {
//   var devs = getDevicesFromLocal();
//   if (devs != false) {
//     console.log(devs);
//     console.log(devs[obj.id]);
//     if (devs[obj.id] != 'undefined') {
//       devs[obj.id] = obj;
//     } else {
//       var devs = {};
//       devs[obj.id] = obj;
//     }
//   } else {
//     var devs = {};
//     devs[obj.id] = obj;
//   }
//   saveDevicesToLocal(devs);
// }
//
// function renderUnoDevice(obj) {
//   let device = obj;
//   dev = document.createElement('div');
//   dev.setAttribute('id', device.id);
//   dev.setAttribute('class', 'd_point');
//   dev.style.top = device.y + 'px';
//   dev.style.left = device.x + 'px';
//   dev_title = document.createElement('p');
//   dev_title.setAttribute('class', 'd_title');
//   dev_title.innerHTML = device.name;
//   dev.appendChild(dev_title);
//   dev_mon = document.createElement('p');
//   dev_mon.setAttribute('class', 'd_mon');
//   dev_mon.innerHTML = '.....';
//   dev.appendChild(dev_mon);
//   map.appendChild(dev);
//   moveDevice(dev);
//   deviceMenu(dev);
// }
//
// function renderDevices() {
//   var devices = getDevicesFromLocal();
//   if (devices !== false) {
//     for (i in devices) {
//       renderUnoDevice(devices[i]);
//     }
//   }
// }
//
// function tickTack() {
//
//   var devices = getDevicesFromLocal();
//   if (devices !== false) {
//     timerId = setTimeout(function tick() {
//
//       for (i in devices) {
//         let dev = document.getElementById(i);
//         let val = 'XX';
//
//         fetch('./getinfo?login=visor43&pass=ping43')
//           .then(function (response) {
//             if (response.status !== 200) {
//               console.log('Status Code: ' + response.status);
//               return;
//             }
//             response.json().then(function (data) {
//               // thermo_result('ok', 30, 2)
//               if (data.length) {
//                 let args = data.split('(')[1].split(')')[0].split(',');
//                 val = args[1];
//               } else {
//                 val = 'XXX';
//               }
//
//               let d_mon = dev.querySelector(".d_mon");
//               d_mon.innerHTML = val + ' C<sup>0</sup>';
//               if (val <= 30) {
//                 d_mon.style.color = 'blue';
//                 d_mon.style.borderColor = 'blue';
//               } else if (val >= 50) {
//                 d_mon.style.color = 'red';
//                 d_mon.style.borderColor = 'red';
//               } else {
//                 d_mon.style.color = 'gray';
//                 d_mon.style.borderColor = 'gray';
//               }
//             });
//           })
//           .catch(function (err) {
//             console.log('Fetch Error :-S', err);
//           });
//
//
//       }
//
//       timerId = setTimeout(tick, 2000);
//     }, 2000);
//
//   }
// }
//
// renderDevices();
// tickTack();
