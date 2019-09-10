(function (angular) {
    var app = angular.module('Aplikacija');
    app.controller('ProizvodiCtrl', ['$http', '$scope', '$timeout', 'loginService', '$stateParams', function($http, $scope, $timeout, loginService, $stateParams) {
        var that = this;
        that.admin = false;
        that.logovan = false;
        that.proizvodi = [];
        that.poruka = "";
        that.korisnik = {};
        that.zaKorpu = {
            kolicina : 1,
        };
        that.obrnuto = "ne";
        that.zadnje = "";

        that.ulogovan = function () {
            loginService.isLoggedIn(function () {
                loginService.getLoggedIn(function (korisnik) {
                    that.korisnik = korisnik;
                    that.zaKorpu.korpa_id = korisnik.korpa_id;
                    korisnik.skracenica = "A";
                    loginService.autorizovan(korisnik, function() {
                        that.admin = true;
                    },function(){}
                )
                },
                function (errorReason) {
                })
            that.logovan = true;
            },function() {});
        }

        that.sortiraj = function(tip) {
            if(that.obrnuto != "da" && that.zadnje == tip){
                that.obrnuto = "da";
            }else{
                that.obrnuto = "ne";
            }
            that.zadnje = tip;
            if($stateParams.id == null){
                that.sortiranjeBezKategorija(tip);
            }else{
                that.sortiranjeSaKategorijom($stateParams.id, tip);
            }
        }

        that.sortiranjeSaKategorijom = function(id, tip){
            $http.get("/sortiranje/"+that.obrnuto+"/"+tip+"/"+id).then(function(response) {
                that.proizvodi = response.data;
            }), function(reason) {
                console.log(reason);
            };
        }

        that.sortiranjeBezKategorija = function(tip){
            $http.get("/sortiranje/"+that.obrnuto+"/"+tip).then(function(response) {
                that.proizvodi = response.data;
            }), function(reason) {
                console.log(reason);
            };
        }

        that.ukloniProizvod = function(id) {
            $http.put('/ukloniProizvod/' + id).then(function(response){
                if(response.data["status"] == "done") {
                    that.poruka = "Uspesno ste uklonili proizvod!";
                    that.obavestenje();
                }
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

        that.dobaviProizvode = function() {
            $http.get('proizvodi').then(function(response){
                that.proizvodi = response.data;
            },
            function(reason){
                console.log(reason);
            })
        };

        that.dobaviProizvodePoKategoriji = function(id){
            $http.get('proizvodi/'+id).then(function(response){
                that.proizvodi = response.data;
            },
            function(reason){
                console.log(reason);
            })
        };

        that.ulogovan();
        if($stateParams.id == null){
            that.dobaviProizvode();
        }else{
            that.dobaviProizvodePoKategoriji($stateParams.id);
        }
    }]);
})(angular);