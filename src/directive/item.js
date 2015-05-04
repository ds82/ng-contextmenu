'use strict';

angular.module('io.dennis.contextmenu')
    .directive('contextmenuItem', Item);

Item.$inject = [];

function Item() {

  /*global DocumentTouch:false */
  var isTouch = !!(('ontouchstart' in window) ||
      window.DocumentTouch && document instanceof DocumentTouch);

  return {
    scope: {
      item: '=contextmenuItem'
    },
    require: '^contextmenuContainer',
    restrict: 'A',
    link: link
  };

  function link(scope, element, attrs, ctrl) {
    var iam = mk(scope.item, element);

    return (isTouch) ?
      registerTouch(iam, scope, ctrl) :
      registerMouse(iam, scope, ctrl);
  }

  function registerTouch(iam, scope, ctrl) {
    iam.element.on('click', function(ev) {

      ev.preventDefault();
      scope.$apply(function() {
        ctrl.contextmenu.open(iam, ev.clientX, ev.clientY);
      });
      return false;
    });
  }

  function registerMouse(iam, scope, ctrl) {
    iam.element.on('click', function(ev) {

      var multi = ev.ctrlKey || ev.metaKey;
      ev.preventDefault();

      scope.$apply(function() {
        ctrl.contextmenu.toggle(iam, multi);
      });
    });

    iam.element.on('contextmenu', function(ev) {

      // don't show context menu if user holds down ctrl || cmd key
      if (ev.ctrlKey || ev.metaKey) { return; }

      ev.preventDefault();
      scope.$apply(function() {
        ctrl.contextmenu.open(iam, ev.clientX, ev.clientY);
      });

      return false;
    });
  }

  function mk(item, element) {
    return {item: item, element: element};
  }

}
