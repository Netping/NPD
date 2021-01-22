(function ($) {
  $(document).ready(function () {
      console.log('script.js');
      // var widgetsObj = JSON.parse();
      // var settingsObj = JSON.parse(localStorage.getItem('log'));
      // localStorage.removeItem('log');
      // console.log(settingsObj);
      initSettings();
      renderAllWidgets();
      refreshAllWidgets();
      // clearStorage();
    })
    .on('click', '.modal-overlay, .form-actions button[name="cancel"]', closeModals)
    .on('click', '[data-target*="modal"], [href*="modal"]', openModal)
    .on('click', '.form-actions button[name="save"]', saveButton)
    .on('click', '[data-action="clear-storage"]', clearStorage)
    .on('click', '[data-target="#modal-device-edit"]', setEditTarget)
    .on('click', '.controls .switcher.locker label', lockSwitcherToggle)
    .on('click', '.form-item.themes label, .form-item.themes input', themeCheckToggle)
    .on('click', 'button[name*="config-import"]', configImport)
    .on('click', 'button[name*="config-export"]', configExport)
    .on('click', 'button[name="config-clear"]', configClear)
    .on('change', 'input[name="config-import-file"], label[for="config-import-file"]', configImportMode)
    .on('change', 'input[name="bg-change"]', bgChange)
    .on('click', 'button[name="bg-remove"]', bgRemove)

  function setEditTarget() {
    var devID = $(this).closest('.device').attr('id');
    localStorage.setItem('actionID', devID);
    var opts = getWidgetOptions(devID);
    var form = $('#modal-device-edit form');
    form[0].reset();
    for (var key in opts) {
      form.find('[name="' + key + '"]').val(opts[key]);
    }
  }

  function renderAllWidgets() {
    var widgetsObj = JSON.parse(localStorage.getItem('widgets'));
    for (var devID in widgetsObj) {
      renderWidget(widgetsObj[devID]);
    }
  }

  function refreshAllWidgets() {
    var refreshInterval = setInterval(function () {
      var widgetsObj = JSON.parse(localStorage.getItem('widgets'));
      for (var devID in widgetsObj) {
        refreshWidget(widgetsObj[devID], true);
      }
    }, 30000);
    // clearInterval(refreshInterval);
  }

  function openModal() {
    closeModals();
    var target = $(this).data('target') ?
      $(this).data('target') :
      $(this).attr('href');
    $('.modal-overlay').addClass('show');
    $(target).addClass('show');
  }

  function clickDropdown() {
    if (!$(this).closest('div').hasClass('opened')) $('.device').removeClass('opened');
    $(this).closest('div').toggleClass('opened');
  }

  function closeModals() {
    $('[class*="modal-"]').removeClass('show');
  }

  function saveButton() {
    var modalID = $(this).closest('.modal-wrapper').attr('id');
    var form = $(this).closest('form');
    switch (modalID) {
    case 'modal-device-add':
      var formData = new FormData(form[0]);
      // reqs check
      form.data('reqs', 0);
      for (var [key, value] of formData.entries()) {
        var thisField = form.find('[name="' + key + '"]');
        if (thisField.prop('required')) {
          form.data('reqs', form.data('reqs') + 1);
          // console.log(form.data('reqs'));
          if (value.length) {
            form.data('reqs', form.data('reqs') - 1);
            thisField.removeClass('error');
          } else {
            thisField.addClass('error');
          }
        }
      }
      if (form.data('reqs') == 0) {
        formObj = {};
        formData.forEach((value, key) => {
          formObj[key] = value;
        });
        addWidget(formObj);
        form[0].reset();
        closeModals();
      }
      break;

    case 'modal-device-remove':
      var id = localStorage.getItem('actionID');
      removeWidget(id);
      closeModals();
      break;

    case 'modal-device-edit':
      var devID = localStorage.getItem('actionID');
      var formData = new FormData(form[0]);
      // reqs check
      form.data('reqs', 0);
      for (var [key, value] of formData.entries()) {
        var thisField = form.find('[name="' + key + '"]');
        if (thisField.prop('required')) {
          form.data('reqs', form.data('reqs') + 1);
          // console.log(form.data('reqs'));
          if (value.length) {
            form.data('reqs', form.data('reqs') - 1);
            thisField.removeClass('error');
          } else {
            thisField.addClass('error');
          }
        }
      }
      if (form.data('reqs') == 0) {
        formObj = {};
        formData.forEach((value, key) => {
          formObj[key] = value;
        });
        editWidget(devID, formObj, true);
        closeModals();
      }
      break;

    case 'modal-settings':
      var formData = new FormData(form[0]);
      var settingsObj = JSON.parse(localStorage.getItem('settings'));
      formObj = {};
      formData.forEach((value, key) => {
        if (key == 'minWidth') {
          settingsObj['minWidth'] = value;
          $('body').css('min-width', value + 'px');
        }
      });
      localStorage.setItem('settings', JSON.stringify(settingsObj));
      closeModals();
      break;

    default:
    }
  }

})(this.jQuery);
