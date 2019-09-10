(function (angular) {
    var app = angular.module('Aplikacija');
    app.controller('NavbarCtrl', ['loginService', '$state', '$scope', function(loginService, $state, $scope) {
        var that = this;
        that.loggedIn = false;
        that.autorizovan = false;

        var onLogin = function() {
            that.loggedIn = true;
            loginService.getLoggedIn(function (korisnik) {
                that.korisnik = korisnik;
                korisnik.skracenica = "A";
                loginService.autorizovan(korisnik, function() {
                    that.autorizovan = true;
                },function (){}
            )
            },
            function (errorReason) {
            })
        }

        var onLogout = function() {
            that.loggedIn = false;
            that.autorizovan = false;
        }

        var autorizovan = function(){
            that.autorizovan = true;
        }

        loginService.addLoginListener($scope, onLogin);
        loginService.addLogoutListener($scope, onLogout);

        that.logout = function() {
            loginService.logout(function(){
                $state.go('login');
            }, function(){});
        }

        loginService.isLoggedIn(function() {
            that.loggedIn = true;
            loginService.getLoggedIn(function (korisnik) {
                that.korisnik = korisnik;
                korisnik.skracenica = "A";
                loginService.autorizovan(korisnik, function() {
                    that.autorizovan = true;
                },function () {}
            )
            },
            function (errorReason) {
            })
        },
        function() {
            that.loggedIn = false;
            that.autorizovan = false;
        });
    }]);
})(angular);