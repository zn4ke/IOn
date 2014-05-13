'use strict';

angular.module('studiApp')
    .controller('AdminCtrl', function ($scope, $location, $modal, $cookieStore, User, Db, socket) {
        $scope.data.selected = {};
        $scope.info = 'Admin controller';
        updateAllData();
        $scope.links = [
            { title:"Decks", sref:"admin.admin.decks" },
            { title:"Gruppen", sref:"admin.admin.groups" },
            { title:"Kurse", sref:"admin.admin.events" },
            { title:"Users", sref:"admin.admin.users" },
            { title:"Files", sref:"admin.admin.files" }
        ];
        $scope.$on('$stateChangeSuccess', function( changeEvent, toState, toParams, fromState, fromParams){
            console.log('toState',toState)
            $scope.app.styles.sidebarWidth = ( toState.name === 'admin') ? 0 : 3;
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
        $scope.editSlide = function(scope){
            $scope.data.selected.slide = scope.$index;
            $location.path('admin/edit/' + scope.slide.type);
        };
        $scope.addSlide = function(scope){
            $scope.data.selected.slide = 'new';
            $location.path('admin/edit/slide-simple');
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
        };
    })

    .controller('AdminContentCtrl', function ($scope, $location, $modal, User, Db) {
        //$scope.data.expression = "\\frac{5}{4} \\div \\frac{1}{6}";

        $scope.info = 'Admin Content controller';
        $scope.editorOptions = {
            language: 'de',
            toolbar: 'Full',
            extraPlugins: 'ngMath,sourcedialog,simplebox,save',
            allowedContent: true,
            forcePasteAsPlainText: true,
            forceSimpleAmpersand: true,
            entities: true,
            basicEntities: false,
            entities_greek: true,
            entities_latin: true,
            toolbarCanCollapse: true,
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
        
        $scope.formData = $scope.data.selected.deck && ( $scope.data.selected.deck.slides[ $scope.data.selected.slide ] || {} )

        $scope.$watch('formData', function(){
            //MathJax.Hub.Queue(["Typeset",MathJax.Hub])
            MathJax.Hub.Update($('body').html());
        })
        $scope.toggleEdit = function(target){
            $('.cke_wysiwyg_div').removeAttr('title')
            if (target==='pres')
                $scope.data.editPres = !($scope.data.editPres);
        };

        $scope.submitForm = function(type){
            Db[type].save($scope.formData)
            $scope.data[type + 's'] = Db[type].list();
            $location.path('/admin/' + type + 's')
            
        };

        $scope.saveSlide = function(type){
            if ($scope.data.selected.slide === 'new')
                $scope.data.selected.deck.slides.push($scope.formData);

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
            $scope.data.activeSlide = deck.slides[ $scope.data.activeSlideNr ]
        });
        $scope.data.activeSlideNr = -1;
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