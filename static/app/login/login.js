(function (angular) {
    var app = angular.module('Aplikacija');
    app.controller('LoginCtrl', ['$http','loginService', '$state', function($http, loginService, $state) {
        var that = this;
        that.showLogin = false;
        that.failed = false;

        that.ulogovan = false;
        that.admin = false;
        that.korisnik = {};

        that.registracija = function() {
            $http.post('/registracija', that.korisnik).then(function(response){
                    that.korisnik.username = that.korisnik.korisnicko
                    that.korisnik.password = that.korisnik.lozinka
                    that.login();
            },
            function(reason){
                console.log(reason);
            })
        };

        that.login = function() {
            loginService.login(that.korisnik, function() {
                $state.go('proizvodi');
            },
            function() {
                that.failed = true;
            })
        }

        loginService.isLoggedIn(function() {
            $state.go('proizvodi');
        },
        function() {
            that.showLogin = true;
        });

    }]);
})(angular);