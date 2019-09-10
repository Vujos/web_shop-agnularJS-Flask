(function (angular) {
    var app = angular.module('Aplikacija');
    app.controller('ProizvodCtrl', ['$http', '$stateParams', 'loginService', function($http, $stateParams, loginService) {
        var that = this;
        
        that.logovan = false;
        that.poruka = "";
        that.proizvod = {};
        that.zaKorpu = {
            kolicina : 1,
        };

        that.ulogovan = function () {
            loginService.isLoggedIn(function () {
                that.logovan = true;
            },function() {});
        }

        that.obavestenje = function(){
            $timeout(function () {
                that.poruka = "";
            }, 1500);
        };
        
        that.dobaviProizvod = function() {
            $http.get('proizvod/'+$stateParams.id).then(function(response){
                that.proizvod = response.data;
            },
            function(reason){
                console.log(reason);
            })
        };

        that.dodajUKorpu = function(id){
            $http.post('/dodajUkorpu/'+id, that.zaKorpu).then(function(response){
                if(response.data["status"] == "done") {
                    that.poruka = "Uspesno ste dodali proizvod u korpu!";
                    that.obavestenje();
                }
            },
            function(reason){
                console.log(reason);
            })
        }

        that.dobaviProizvod();
        that.ulogovan();
}]);
})(angular);