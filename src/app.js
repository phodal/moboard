function dragMoveListener(event) {
  var target = event.target,
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

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
      console.log(event, event.pageX, event.pageY);

      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
        Math.pow(event.pageY - event.y0, 2) | 0))
          .toFixed(2) + 'px');
    }
  });

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
    console.log(event);
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

function init() {
  var elementData = [
    {id: 1, title: 'Drag 1', class: 'className', x: 0, y: 0},
    {id: 2, title: '2 Drag', class: 'className', x: 50, y: 50},
    {id: 3, title: 'Drag 3', class: 'className', x: 120, y: 120},
  ];

  var elements = '';
  for (var i = 0; i < elementData.length; i++) {
    var element = elementData[i];
    var id = generateId(element.id);
    var x = element.x;
    var y = element.y;
    var currentHtml = `<div id='${id}' data-x='${x}' data-y='${y}' style='transform: translate(${x}px, ${y}px)' class='draggable moboard-element ${element.class}'>${element.title}</div>`;

    elements = elements + currentHtml;
  }

  document.getElementById('stickers').innerHTML = elements;
}

init();
