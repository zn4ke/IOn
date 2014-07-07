'use strict';

angular.module('ionApp')
.directive('ckEditor', function () {
    return {
        require: '?ngModel',
        link: function ($scope, elm, attr, ngModel) {

            var ck = CKEDITOR.replace(elm[0]);

            ck.on('pasteState', function () {
                $scope.$apply(function () {
                    ngModel.$setViewValue(ck.getData());
                });
            });

            ngModel.$render = function (value) {
                ck.setData(ngModel.$modelValue);
            };
        }
    };
});




// function myCtrl($scope){
//     $scope.ckEditors = [];
//     $scope.addEditor = function(){
//         var rand = ""+(Math.random() * 10000);
//         $scope.ckEditors.push({value:rand});
//     }
// }

// https://github.com/ericpanorel/AngularCkEdDirective

angular.module('ionApp')
.directive('ckedit', function ($parse) {
    CKEDITOR.disableAutoInline = true;
    var counter = 0,
    prefix = '__ckd_';

    return {
        restrict: 'A',
        link: function (scope, element, attrs, controller) {
            var getter = $parse(attrs.ckedit),
                setter = getter.assign;
      
            attrs.$set('contenteditable', true); // inline ckeditor needs this
            if (!attrs.id) {
                attrs.$set('id', prefix + (++counter));
            }
            console.log('linking ckedit')
            // CKEditor stuff
            // Override the normal CKEditor save plugin

            CKEDITOR.plugins.registered['save'] =
            {
                init: function (editor) {
                    editor.addCommand('save',
                        {
                            modes: { wysiwyg: 1, source: 1 },
                            exec: function (editor) {
                                if (editor.checkDirty()) {
                                    var ckValue = editor.getData();
                                    scope.$apply(function () {
                                        setter(scope, ckValue);
                                    });
                                    ckValue = null;
                                    editor.resetDirty();
                                }
                            }
                        }
                    );
                    editor.ui.addButton('Save', { label: 'Save', command: 'save', toolbar: 'document' });
                }
            };
            var options = {};
            options.on = {
                blur: function (e) {
                    if (e.editor.checkDirty()) {
                        var ckValue = e.editor.getData();
                        scope.$apply(function () {
                            setter(scope, ckValue);
                        });
                        ckValue = null;
                        e.editor.resetDirty();
                    }
                }
            };
            options.extraPlugins = 'sourcedialog';
            options.removePlugins = 'sourcearea';
            var editorangular = CKEDITOR.inline(element[0], options); //invoke

            scope.$watch(attrs.ckedit, function (value) {
                editorangular.setData(value);
            });
        }
    }
    
});

angular.module('ionApp')
.directive('contenteditable', function() {
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function(scope, element, attrs, ngModel) {
        if(!ngModel) return; // do nothing if no ng-model

        // Specify how UI should be updated
        ngModel.$render = function() {
          element.html(ngModel.$viewValue || '');
        };

        // Listen for change events to enable binding
        element.on('blur keyup change', function() {
          scope.$apply(read);
        });
        read(); // initialize

        // Write data to the model
        function read() {
          var html = element.html();
          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if( attrs.stripBr && html == '<br>' ) {
            html = '';
          }
          ngModel.$setViewValue(html);
        }
      }
    };
});