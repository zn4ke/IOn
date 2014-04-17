'use strict';

angular.module('studiApp')
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

// "use strict";
// angular.module('studiApp')
// .directive('ckedit', function ($parse) {
//     CKEDITOR.disableAutoInline = true;
//     var counter = 0,
//     prefix = '__ckd_';

//     return {
//         restrict: 'A',
//         link: function (scope, element, attrs, controller) {
//             var getter = $parse(attrs.ckedit),
//                 setter = getter.assign;
      
//             attrs.$set('contenteditable', true); // inline ckeditor needs this
//             if (!attrs.id) {
//                 attrs.$set('id', prefix + (++counter));
//             }

//             // CKEditor stuff
//             // Override the normal CKEditor save plugin

//             CKEDITOR.plugins.registered['save'] =
//             {
//                 init: function (editor) {
//                     editor.addCommand('save',
//                         {
//                             modes: { wysiwyg: 1, source: 1 },
//                             exec: function (editor) {
//                                 if (editor.checkDirty()) {
//                                     var ckValue = editor.getData();
//                                     scope.$apply(function () {
//                                         setter(scope, ckValue);
//                                     });
//                                     ckValue = null;
//                                     editor.resetDirty();
//                                 }
//                             }
//                         }
//                     );
//                     editor.ui.addButton('Save', { label: 'Save', command: 'save', toolbar: 'document' });
//                 }
//             };
//             var options = {};
//             options.on = {
//                 blur: function (e) {
//                     if (e.editor.checkDirty()) {
//                         var ckValue = e.editor.getData();
//                         scope.$apply(function () {
//                             setter(scope, ckValue);
//                         });
//                         ckValue = null;
//                         e.editor.resetDirty();
//                     }
//                 }
//             };
//             options.extraPlugins = 'sourcedialog';
//             options.removePlugins = 'sourcearea';
//             var editorangular = CKEDITOR.inline(element[0], options); //invoke

//             scope.$watch(attrs.ckedit, function (value) {
//                 editorangular.setData(value);
//             });
//         }
//     }
    
// });