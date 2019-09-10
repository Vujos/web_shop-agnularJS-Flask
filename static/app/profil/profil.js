(function (angular) {
    var app = angular.module('Aplikacija');
    app.controller('ProfilCtrl', ['$http', '$state', '$stateParams', 'loginService', '$timeout', function($http, $state, $stateParams, loginService, $timeout) {
        var that = this;

        that.korisnik = {};
        that.korisnikZaIzmenu = {};
        that.adresa = {};
        that.poruka = "";
        that.adresaZaIzmenu = {
            postanski_broj : "",
            ulica : "",
            broj : "",
            grad_id : "",
        };
        that.drzave = [];
        that.gradovi = [];

        that.dobaviPodatke = function () {
            loginService.isLoggedIn(function () {
                loginService.getLoggedIn(function (korisnik) {
                    that.korisnik = korisnik;
                    that.korisnikZaIzmenu = angular.copy(that.korisnik);
                    that.dobaviAdresu();
                },
                function (errorReason) {
                })
            },
            function () {
                $state.go('login');
            });
        }

        that.dobaviAdresu = function(){
            $http.get('/dobaviAdresu/'+that.korisnik.adresa_id).then(function(response){
                that.adresa = response.data;
                that.adresaZaIzmenu = angular.copy(that.adresa);
                that.dobaviDrzave();
            },
            function(reason){
                console.log(reason);
            })
        };

        that.obavestenje = function(){
            $timeout(function () {
                that.poruka = "";
            }, 1500);
        };

        that.dobaviDrzave = function(){
            $http.get('/dobaviDrzave').then(function(response){
                that.drzave = response.data;
            },
            function(reason){
                console.log(reason);
            })
        };

        that.dobaviGrad = function(){
            $http.get('/dobaviGradove/'+that.adresaZaIzmenu.drzava.id).then(function(response){
                that.gradovi = response.data;
            },
            function(reason){
                console.log(reason);
            })
        };

        that.izmeniAdresu = function() {
            that.adresaZaIzmenu.grad_id = that.adresaZaIzmenu.grad["id"]
            $http.put('/izmeniAdresu', that.adresaZaIzmenu).then(function(response){
                if(response.data["status"] == "done") {
                    that.poruka = "Uspesno ste izmenili adresu!"
                    that.obavestenje();
                }
            },
            function(reason){
                console.log(reason);
            })
        };

        that.izmeniProfil = function() {
            $http.put('/izmeniProfil', that.korisnikZaIzmenu).then(function(response){
                if(response.data["status"] == "done") {
                    that.poruka = "Uspesno ste izmenili profil!"
                    that.obavestenje();
                }
            },
            function(reason){
                console.log(reason);
            })
        };

        loginService.isLoggedIn(function() {
        },function(){
            $state.go('login');
        });

        that.dobaviDrzave();
        that.dobaviPodatke();
    }]);
})(angular);