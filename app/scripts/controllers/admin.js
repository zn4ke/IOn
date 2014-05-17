'use strict';

angular.module('ionApp')
    .controller('AdminCtrl', function ($scope, $location, $modal, $cookieStore, $state, User, Db, socket) {
        $scope.data.selected = {};
        $scope.info = 'Admin controller';
        updateAllData();
        $scope.links = [
            { title:"Decks", sref:"admin.admin.decks" },
            { title:"Gruppen", sref:"admin.admin.groups" },
            { title:"Veranstaltungen", sref:"admin.admin.events" },
            { title:"Users", sref:"admin.admin.users" },
            { title:"Dateien", sref:"admin.admin.files" }
        ];

        $scope.sortableOptions = {
          update: function(e, ui) {
            $scope.updated = false;
            // if (ui.item.scope().item == "can't be moved") {
            //   ui.item.sortable.cancel();
            // }
          }
        };


        $scope.$on('$stateChangeSuccess', function( changeEvent, toState, toParams, fromState, fromParams){
            $scope.app.styles.sidebarWidth = ( toState.name === 'admin.admin') ? 0 : 3;
        });
        $scope.select = function(scope, type){
            var obj;
            if (type === 'user'){
                obj = User.get({ id: scope.user._id }, function(user){
                    $scope.data.selected.user = user;
                })
            }
            else {
                var obj = Db[type].get({ id: scope[type]._id }, function(item){
                    $scope.data.selected[type] = item;
                    $location.path( '/admin/' + type + '/' + scope[type]._id )
                })
            }
            $scope.data.selected[type] = scope[type]
        };
        $scope.addSlide = function(scope){
            $scope.app.newSlide = true;
            $scope.data.selected.slide = {};
            $location.path('/admin/new/slide-simple');
        };
        $scope.editDetails = function(scope){
            var type = $location.path().split('/')[2]
            var editUrl = '/admin/edit/' + type + "/" + $state.params.id
            $location.path(editUrl);
        };


        $scope.startEvent = function(){
            $cookieStore.put('event', $scope.data.selected.event._id);
            $location.path('player');
            socket.emit('event:open', { id: $scope.data.selected.event._id})
        };



        function updateAllData(){
            $scope.data.users = User.list();
            $scope.data.decks = Db.deck.list();
            $scope.data.groups = Db.group.list();
            $scope.data.events = Db.event.list();
            $scope.updated = true;
        };


        $scope.saveOrder = function(){
            angular.forEach($scope.data.selected.deck.slides, function(item){
                
            })
            $scope.updated = true;
            $scope.data.selected.deck.$update();
        };



    })

    .controller('AdminContentCtrl', function ($rootScope, $scope, $location, $modal, $state, User, Db) {
        //$scope.data.expression = "\\frac{5}{4} \\div \\frac{1}{6}";

        $scope.info = 'Admin Content controller';
        $scope.editorOptions = {
            language: 'de',
            toolbar: 'Full',
            extraPlugins: 'ngMath,sourcedialog,simplebox,save,filebrowser,imagebrowser',
            imageBrowser_listUrl : "/ckeditor-imagebrowser/demo/images/images_list.json",
            stylesSet: 'default',
            allowedContent: true,
            forcePasteAsPlainText: true,
            forceSimpleAmpersand: true,

            //toolbarStartupExpanded: false,

            entities: true,
            basicEntities: false,
            entities_greek: true,
            entities_latin: true,
            toolbarCanCollapse: true,
            format_tags: 'p;h1;h2;h3;h4;pre;address;div',
            toolbar_Full: 
                [
                    { name: 'document', items : [ 'Preview','Sourcedialog','-','Save','NewPage','DocProps','Preview','Print','-','Templates' ] },
                    { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
                    { name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
                    //{ name: 'forms', items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 
                    //    'HiddenField' ] },
                    '/',
                    { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
                    { name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv',
                    '-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock' ] },
                    { name: 'links', items : [ 'Link','Unlink' ] },
                    { name: 'insert', items : [ 'Simplebox','NgMath', 'Image','Flash','Table','HorizontalRule','SpecialChar','PageBreak','Iframe' ] },
                    '/',
                    { name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
                    { name: 'colors', items : [ 'TextColor','BGColor' ] },
                    { name: 'tools', items : [ 'Maximize', 'ShowBlocks'] }
                ]
        };



        $scope.$watch('formData', function(){
            //MathJax.Hub.Update($('body').html());
        });
        $scope.$watch('data.editPres', function(){
            $('.cke_wysiwyg_div').removeAttr('title');
        });
        $scope.$watch('data.editMobile', function(){
            $('.cke_wysiwyg_div').removeAttr('title');
        });




        // if we are editing a slide load formdata
        if ($state.params.type.indexOf('slide') >= 0) {
            $scope.formData = $scope.data.selected.slide;
        }
        
        // if we are editing any other type than slide get ressource and load formdata
        if ( $state.params.id ){
            $scope.formData = Db[ $state.params.type ].get( { id:$state.params.id });
        }
        else { $scope.editing = false; }



        $scope.submitForm = function(type){
            if ($scope.formData._id){
                console.log('updating')
                $scope.formData.$update()
            }
            else {
                console.log('saving')
                Db[type].save($scope.formData);
            }
            //Db[type].save($scope.formData)
            $scope.data[type + 's'] = Db[type].list();
            $location.path('/admin/' + type + 's')
            
        };

        $scope.saveSlide = function(type){
            if ( $scope.app.newSlide ){
                $scope.data.selected.deck.slides.push($scope.formData);
                $scope.app.newSlide = false;
            }
            $scope.data.selected.deck.$update(function(savedDeck){
                $scope.data.decks = Db.deck.list();
                $scope.data.selected.deck = savedDeck;
                $location.path('/admin/deck/' + $scope.data.selected.deck._id)
            });

        };


        $scope.addToArray = function(array){
            array.push({text:'new answer'});
        }
        $scope.removeFromArray = function(array){
            array.splice(this.$index, 1);
        }

        $scope.choose = function (type, targetBinding) {

            var modalInstance = $modal.open({
              templateUrl: 'partials/admin/chooser.html',
              controller: ModalInstanceCtrl,
              resolve: {
                type: function(){
                    return type
                },
                items: function () {
                  return $scope.data[type];
                }
              }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.formData[targetBinding] = selectedItem._id;
                $scope.meta = $scope.meta || {};
                $scope.meta[targetBinding] = selectedItem.name;
            }, function () {
                // failed???
            });
        };



    })

    .controller('AdminDeckCtrl', function ($scope, $state, $modal, Db) {
        $scope.data.selected.deck = Db.deck.get( { id: $state.params.id }, function(deck){
            $scope.data.selected.deck = deck;
            $scope.data.selected.slide = deck.slides[ $scope.data.selected.slideNr ]
        });
        $scope.data.selected.slideNr = -1;
        $scope.info = 'AdminDeckCtrl';
    })

    .controller('AdminUserCtrl', function ($scope, $location, User, Db) {


    })

    .controller('AdminEventCtrl', function ($scope, $location, $modal, Db) {


    })

    .controller('AdminGroupCtrl', function ($scope, $location, Db) {


    })

    .controller('AdminUploadCtrl', function ($scope, $fileUploader, File) {
        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: 'upload.php',
            formData: [
                { key: 'value' }
            ],
            filters: [
                function (item) {                    // first user filter
                    console.info('filter1');
                    return true;
                }
            ]
        });


        uploader.progress = 0;
        $scope.deleteFile = function(scope){
            console.log('deleting', scope.uploadedFile)
            scope.uploadedFile.$remove({ id: scope.uploadedFile._id })
            $scope.uploadedFiles.splice(scope.$index, 1)
        };
        $scope.copyToClipboard = function(){

        };

        $scope.uploadedFiles = File.list();

                // REGISTER HANDLERS

        uploader.bind('afteraddingfile', function (event, item) {
            console.info('After adding a file', item);
        });

        uploader.bind('whenaddingfilefailed', function (event, item) {
            console.info('When adding a file failed', item);
        });

        uploader.bind('afteraddingall', function (event, items) {
            console.info('After adding all files', items);
        });

        uploader.bind('beforeupload', function (event, item) {
            console.info('Before upload', item);
        });

        uploader.bind('progress', function (event, item, progress) {
            console.info('Progress: ' + progress, item);
        });

        uploader.bind('success', function (event, xhr, item, response) {
            console.info('Success', xhr, item, response);
            
        });

        uploader.bind('cancel', function (event, xhr, item) {
            console.info('Cancel', xhr, item);
        });

        uploader.bind('error', function (event, xhr, item, response) {
            console.info('Error', xhr, item, response);
        });

        uploader.bind('complete', function (event, xhr, item, response) {
            $scope.uploadedFiles = File.list()
            console.info('Complete', xhr, item, response);
        });

        uploader.bind('progressall', function (event, progress) {
            console.info('Total progress: ' + progress);
        });

        uploader.bind('completeall', function (event, items) {
            $scope.uploadedFiles = File.list()
            console.info('Complete all', items);
        });

        $scope.submitFile = function(){
            console.log('submitting file', $scope.formData)
        };


    });



var ModalInstanceCtrl = function ($scope, $modalInstance, items, type) {
    $scope.type = type
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.select = function(scope){
        $scope.selected.item = scope.item
    };
    $scope.ok = function () {
        $modalInstance.close( $scope.selected.item );
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};