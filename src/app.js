var elementData = [
  {id: 1, value: 'Drag 1', class: 'className', x: 0, y: 0, color: '#dddddd'},
  {id: 2, value: '2 Drag', class: 'className', x: 50, y: 50, color: '#222222'},
  {id: 3, value: 'Drag 3', class: 'className', x: 120, y: 120, color: '#29e'},
];
var storageKey = 'moboard.drag';

window.elementData = elementData;

function dragMoveListener(event) {
  var target = event.target;
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

window.dragMoveListener = dragMoveListener;

interact('.draggable')
  .draggable({
    inertia: true,
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: {top: 0, left: 0, bottom: 1, right: 1}
    },
    autoScroll: true,
    onmove: dragMoveListener,
    onend: function (event) {
      window.elementData.filter(item => {
        if (event.target.id === generateId(item.id)) {
          item.x = event.target.dataset.x;
          item.y = event.target.dataset.y;
        }
        return item;
      });

      updateElementData();
    }
  });

function updateElementData() {
  localStorage.setItem(storageKey, JSON.stringify(window.elementData));
}

interact('.pipe').dropzone({
  accept: '.yes-drop',
  overlap: 0.75,

  ondropactivate: function (event) {
    event.target.classList.add('drop-active');
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget,
      dropzoneElement = event.target;

    dropzoneElement.classList.add('drop-target');
    draggableElement.classList.add('can-drop');
    draggableElement.textContent = 'Dragged in';
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');
    event.relatedTarget.textContent = 'Dragged out';
  },
  ondrop: function (event) {
    event.relatedTarget.textContent = 'Dropped';
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
  }
});

function initEditor(target) {
  var editor = new MediumEditor(target, {
    placeholder: false
  });
  editor.subscribe('editableInput', function (event, editable) {
    window.elementData.filter(item => {
      if (event.target.id === generateId(item.id)) {
        item.value = event.target.textContent;
      }
      return item;
    });

    updateElementData();
  });
}

function initEditors() {
  var moboardElements = document.getElementsByClassName('moboard-element');
  for (var i = 0; i < moboardElements.length; i++) {
    var element = moboardElements[i];
    element.addEventListener('click', function (event) {
      initEditor(event.target);
    });
  }
}

function generateId(pipeData) {
  return 'sticker_' + pipeData;
}

function initElements(items) {
  var elements = '';
  for (var i = 0; i < items.length; i++) {
    var element = items[i];
    var id = generateId(element.id);
    var x = element.x;
    var y = element.y;
    var currentHtml = `<div id='${id}' data-x='${x}' data-y='${y}' 
  style='transform: translate(${x}px, ${y}px);background-color:${element.color}'
 class='draggable moboard-element ${element.class}'>${element.value}</div>`;

    elements = elements + currentHtml;
  }

  document.getElementById('stickers').innerHTML = elements;
}

function init() {
  var items = localStorage.getItem(storageKey);
  if (items) {
    window.elementData = JSON.parse(items);
  }
  initElements(window.elementData);
  initEditors();
}

init();
