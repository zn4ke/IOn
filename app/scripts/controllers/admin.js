'use strict';

angular.module('studiApp')
    .controller('AdminCtrl', function ($scope, User, Db) {
        $scope.data = { selected:{}};
        $scope.info = 'Admin controller';
        updateAllData();
        $scope.tabs = [
            { title:"Decks", sref:"admin.decks" },
            { title:"Gruppen", sref:"admin.groups" },
            { title:"Kurse", sref:"admin.lectures" },
            { title:"Users", sref:"admin.users" },
            { title:"New", sref:"admin.new" }
        ];
        $scope.select = function(scope, type){
            $scope.data.selected[type] = scope[type]
            console.log('this clicked', scope[type] )
        };

        function updateAllData(){
            $scope.data.users = User.list();
            $scope.data.decks = Db.deck.list();
            $scope.data.groups = Db.group.list();
        };
    })

    .controller('AdminContentCtrl', function ($scope, User, Db) {
        $scope.info = 'Admin Content controller';
        $scope.submitForm = function(type, form){
            console.log('submitting form', form)
            Db[type].save($scope.formData)
            
        };

    });
