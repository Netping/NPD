function initSettings() {
  var settingsObj = JSON.parse(localStorage.getItem('settings'));
  if (!settingsObj) settingsObj = {
    locked: false,
    theme: 'theme1',
    minWidth: '0',
  };

  // lock switcher
  if (settingsObj.locked === true) {
    $('.controls .switcher.locker input').prop('checked', true);
    $('#screen').addClass('locked');
  }

  // theme
  if (settingsObj.theme == 'theme1') {
    $('#themer1').prop('checked', false);
    $('#screen-wrapper').removeClass().addClass('theme1');
  }
  if (settingsObj.theme == 'theme2') {
    $('#themer1').prop('checked', true);
    $('#screen-wrapper').removeClass().addClass('theme2');
  }

  // minWidth
  if (settingsObj.minWidth !== undefined) {
    // console.log(settingsObj.minWidth);
    $('body').css('min-width', settingsObj.minWidth + 'px');
    $('#minwidth1').val(settingsObj.minWidth);
  }

  // minWidth
  if (settingsObj.bg !== undefined && settingsObj.bg.length) {
    $('#bg').append('<img src="' + settingsObj.bg + '" />');
  }

  localStorage.setItem('settings', JSON.stringify(settingsObj));
}

function lockSwitcherToggle() {
  var settingsObj = JSON.parse(localStorage.getItem('settings'));
  if ($(this).siblings('input').prop('checked')) {
    settingsObj['locked'] = false;
    $('#screen').removeClass('locked');
  } else {
    settingsObj['locked'] = true;
    $('#screen').addClass('locked');
  }
  localStorage.setItem('settings', JSON.stringify(settingsObj));
}

function themeCheckToggle() {
  var settingsObj = JSON.parse(localStorage.getItem('settings'));
  // click + set
  if ($('#themer1').prop('checked')) {
    $('#screen-wrapper').removeClass().addClass('theme2');
    settingsObj['theme'] = 'theme2';
  } else {
    $('#screen-wrapper').removeClass().addClass('theme1');
    settingsObj['theme'] = 'theme1';
  }
  localStorage.setItem('settings', JSON.stringify(settingsObj));
}

function configImportMode() {
  if ($(this).attr('id') == 'config-import-file') {
    var files = $(this)[0].files;
    if (files.length) {
      $('button[name="config-import-apply"]')
        .data('mode', 'file')
        .prop('disabled', false)
        .text('Применить (' + files[0].name + ')');
      $(this).addClass('checked');
    } else {
      $('button[name="config-import-apply"]')
        .data('mode', 'none')
        .prop('disabled', true)
        .text('Применить');
      $(this).removeClass('checked');
    }
  }
  if ($(this).prop('for') == 'config-import-file') {
    console.log(':()');
  }
}

function configImport() {
  var name = $(this).prop('name');
  if (name == 'config-import-server') {
    // TODO: 
    var profileName = 'default';
    $(this).text('Импорт профиля [' + profileName + ']').addClass('checked');
    $('label[for="config-import-file"]').removeClass('checked');
    $('button[name="config-import-apply"]')
      .data('mode', 'server')
      .data('profile', profileName)
      .prop('disabled', false)
      .text('Применить [' + profileName + ']');
  }
  if (name == 'config-import-apply') {
    var mode = $(this).data('mode');
    if (mode == 'file') {
      var files = $('input[name="config-import-file"]')[0].files;
      if (files.length) {
        var reader = new FileReader();
        reader.readAsText(files[0], 'UTF-8');
        reader.onload = readerEvent => {
          var configObject = JSON.parse(readerEvent.target.result);
          for (var confCat in configObject) {
            if (configObject.hasOwnProperty(confCat)) {
              localStorage.setItem(confCat, configObject[confCat]);
            }
          }
          // document.location.reload();
        }
      }
    }
    if (mode == 'server') {
      let profileName = $(this).prop('profile');
      if (!profileName) profileName = 'default';
      console.log(profileName);
      $.ajax({
        url: '/config/get?profile=' + profileName,
      }).done(function (data) {
        for (var confCat in data) {
          if (data.hasOwnProperty(confCat)) {
            localStorage.setItem(confCat, data[confCat]);
          }
        }
        // document.location.reload();
      });
    }
  }
}

function configExport() {
  var name = $(this).prop('name');
  var configObject = {
    widgets: localStorage.getItem('widgets'),
    settings: localStorage.getItem('settings'),
    log: localStorage.getItem('log'),
  };
  if (name == 'config-export-file') {
    $.ajax({
      url: '/config/make',
      method: 'POST',
      data: {
        content: JSON.stringify(configObject),
        mode: 'temp'
      },
      success: function (data) {
        console.log('data: ' + data);
        var win = window.open('/config/download', '_blank');
        if (win) {
          win.focus();
        } else {
          alert('Please allow popups for this website');
        }
      },
      error: function (err) {
        console.log('/config/make temp ajax error');
      }
    })
  }
  if (name == 'config-export-server') {
    $.ajax({
      url: '/config/make',
      method: 'POST',
      data: {
        content: JSON.stringify(configObject),
        mode: 'server'
      },
      success: function (data) {
        console.log('data: ' + data);
      },
      error: function (err) {
        console.log('/config/make server ajax error');
      }
    })
  }
}

function configClear() {
  localStorage.clear();
}

function bgChange() {
  var files = $('input[name="bg-change"]')[0].files;
  if (files.length) {
    var file = files[0];
    var name = file.name;
    $('label[for="bg1"]').text(name)
    var imageType = /image.*/;
    console.log(file.type);
    if (file.type.match(imageType)) {
      var reader = new FileReader();
      reader.onload = readerEvent => {
        var img = new Image();
        img.src = reader.result;
        $('#bg').append(img);
        var settingsObj = JSON.parse(localStorage.getItem('settings'));
        settingsObj['bg'] = reader.result;
        localStorage.setItem('settings', JSON.stringify(settingsObj));
      }
      reader.readAsDataURL(file);
    } else {
      $('#bg').html('файл не поддерживается');
    }
  }
}

function bgRemove() {
  var settingsObj = JSON.parse(localStorage.getItem('settings'));
  settingsObj['bg'] = '';
  $('#bg img').remove();
  localStorage.setItem('settings', JSON.stringify(settingsObj));
}
