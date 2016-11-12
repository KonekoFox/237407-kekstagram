/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

var upload = (function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  var cleanupResizer = function() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  };

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  var updateBackground = function() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  };
  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */

  /*var resizeFormIsValid = function() {
    return true;
  };*/

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  var showMessage = function(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  };

  var hideMessage = function() {
    uploadMessage.classList.add('invisible');
  };

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.addEventListener('load', function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
          resizeFwd.disabled = !resizeFormIsValid();
        }, false);

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
        showMessage(Action.ERROR);
      }
    }
  }, false);

  var event = new CustomEvent('resizerchange');

  window.addEventListener('resizerchange', function() {
    if (document.querySelector('canvas')) {
      resizeX.value = Math.round(currentResizer.getConstraint().x);
      resizeY.value = Math.round(currentResizer.getConstraint().y);
      resizeSize.value = Math.round(currentResizer.getConstraint().side);
    }
  });

  window.dispatchEvent(event);

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  }, false);

  var resizeX = document.querySelector('#resize-x');
  var resizeY = document.querySelector('#resize-y');
  var resizeSize = document.querySelector('#resize-size');
  var resizeFwd = document.querySelector('#resize-fwd');

  var resizeFormIsValid = function() {
    var isValid = false;

    if ((parseInt(resizeX.value, 10) + parseInt(resizeSize.value, 10)) <= currentResizer._image.naturalWidth &&
        (parseInt(resizeY.value, 10) + parseInt(resizeSize.value, 10)) <= currentResizer._image.naturalHeight) {
      isValid = true;
    }
    return isValid;
  };

  var deltaX;
  var deltaY;
  var deltaSide;

  resizeX.addEventListener('input', function() {
    deltaX = resizeX.value - currentResizer.getConstraint().x;
    currentResizer.moveConstraint(deltaX, 0, 0);
    resizeFwd.disabled = !resizeFormIsValid();
  }, false);

  resizeY.addEventListener('input', function() {
    deltaY = resizeY.value - currentResizer.getConstraint().y;
    currentResizer.moveConstraint(0, deltaY, 0);
    resizeFwd.disabled = !resizeFormIsValid();
  }, false);

  resizeSize.addEventListener('input', function() {
    deltaSide = resizeSize.value - currentResizer.getConstraint().side;
    currentResizer.moveConstraint(0, 0, deltaSide);
    resizeFwd.disabled = !resizeFormIsValid();
  }, false);

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      var image = currentResizer.exportImage().src;

      var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
      for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].style.backgroundImage = 'url(' + image + ')';
      }

      filterImage.src = image;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');

      for (var index = 0; index < filterForm.length; index++) {
        if (filterForm.elements[index].value === window.Cookies.get('upload-filter')) {
          filterForm.elements[index].checked = true;
        }
      }

    }
  }, false);

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  }, false);

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    var cookieValue = document.querySelector('#upload-filter input[type="radio"]:checked').value;

    var getExpireDate = function() {
      var creationDate = new Date();
      creationDate.setHours(0, 0, 0, 0);
      var thisYear = creationDate.getFullYear();
      var thisMonth = creationDate.getMonth();
      var thisDate = creationDate.getDate();
      var birthYear;

      if (thisMonth === 11 && thisDate > 9) {
        birthYear = thisYear;
      } else {
        birthYear = thisYear - 1;
      }

      var GraceBirthday = new Date();
      GraceBirthday.setFullYear(birthYear);
      GraceBirthday.setMonth(11, 9);
      GraceBirthday.setHours(0, 0, 0, 0);

      var expireDate = new Date(+creationDate + (creationDate - GraceBirthday));
      return expireDate;
    };

    window.Cookies.set('upload-filter', cookieValue, { expires: getExpireDate() });

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  }, false);

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia',
        'marvin': 'filter-marvin'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  }, false);

  cleanupResizer();
  updateBackground();
})();

module.exports = upload;
