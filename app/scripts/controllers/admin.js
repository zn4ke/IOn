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
            { title:"Users", sref:"admin.users" }
        ];
        $scope.select = function(scope, type){
            var obj;
            if (type === 'user'){
                obj = User.get({ id: scope.user._id }, function(item){
                    $scope.data.selected.user = item;
                })
            }
            else {
                var obj = Db[type].get({ id: scope[type]._id }, function(item){
                    $scope.data.selected[type] = item;
                })
            }
            $scope.data.selected[type] = scope[type]
        };

        function updateAllData(){
            $scope.data.users = User.list();
            $scope.data.decks = Db.deck.list();
            $scope.data.groups = Db.group.list();
            $scope.data.events = Db.event.list();
        };
    })





    .controller('AdminContentCtrl', function ($scope, $location, User, Db) {
        $scope.info = 'Admin Content controller';
        $scope.submitForm = function(type){
            Db[type].save($scope.formData)
            
        };
        $scope.addSlide = function(type){
            //Db['slide'].save($scope.formData)
            $scope.data.selected.deck.slides.push($scope.formData)
            $scope.data.selected.deck.$update(function(arg){
                $scope.data.decks = Db.deck.list();
                $scope.data.selected.deck = Db.deck.get({ id: $scope.data.selected.deck._id })
            });
            $location.path('/admin/decks')
        };

        $scope.addToArray = function(array){
            console.log('add array');
            console.log(array);
            array.push({text:'new answer'});
        }
        $scope.removeFromArray = function(array){
            console.log('remove array');
            array.splice(this.$index, 1);
            console.log(array);
            $scope.$apply();
        }



    });
