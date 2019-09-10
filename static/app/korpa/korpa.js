(function (angular) {
    var app = angular.module('Aplikacija');
    app.controller('KorpaCtrl', ['$http', '$state', '$stateParams', 'loginService', '$timeout', function($http, $state, $stateParams, loginService, $timeout) {
        var that = this;
        that.novaKorpa = {
            kolicina: 1,
        };
        that.proizvodZaKupovinu = {};
        that.korpa = [];
        that.racun = [];
        that.korpa_id;
        that.ukupna;
        that.proizvod = {};
        that.kolicina = true;
        that.kupljeni = {};
        that.korisnik = {};
        that.spremno = false;
        that.poruka = "";

        that.dobaviPodatke = function () {
            loginService.isLoggedIn(function () {
                loginService.getLoggedIn(function (korisnik) {
                    that.korisnik = korisnik;
                    that.dobaviIzKorpe();
                    that.dobaviSaRacuna();
                },
                function (errorReason) {
                })
            },
            function () {
                $state.go('login');
            });
        }

        that.dobaviProizvod = function(id) {
            $http.get('/proizvod/'+id).then(function(response){
                that.proizvod = response.data;
            },
            function(reason){
                console.log(reason);
            })
        };

        that.umanjiKupljeni = function(id, kolicina) {
            that.kupljeni.kolicina = kolicina;
            that.kupljeni.id = id;
            $http.put('/kupljeniProizvod', that.kupljeni).then(function(response){
                if(response.data["status"] == "done") {
                    that.izmena = true;
                }
            },
            function(reason){
                console.log(reason);
            })
        };

        that.napraviRacun = function(id, kolicina, sviProivodi){
            $http.post('/napraviRacun/'+that.korisnik.id).then(function(response){
                if(response.data["status"] == "done") {
                    if(sviProivodi){
                        that.kupiProizvode();
                    }else{
                        that.kupiProizvod(id, kolicina); 
                    }
                }
            },
            function(reason){
                console.log(reason);
            })
        }

        that.kupiProizvod = function(id, kolicina) {
            that.proizvodZaKupovinu.id = id;
            that.proizvodZaKupovinu.kolicina = kolicina;
            $http.post('/kupiProizvod', that.proizvodZaKupovinu).then(function(response){
                if(response.data["status"] == "done") {
                    that.umanjiKupljeni(id, kolicina);
                    that.ukloniIzKorpe(id);
                    that.poruka = "Uspesno ste kupili proizvod!"
                    that.obavestenje();
                    that.dobaviSaRacuna();
                }
            },
            function(reason){
                console.log(reason);
            })
        };

        that.umanjiKupljene = function() {
            $http.put('/kupljeniProizvodi', that.korpa).then(function(response){
                if(response.data["status"] == "done") {
                    that.izmena = true;
                }
            },
            function(reason){
                console.log(reason);
            })
        };

        that.kupiProizvode = function() {
            $http.post('/kupiProizvode', that.korpa).then(function(response){
                if(response.data["status"] == "done") {
                    that.umanjiKupljene();
                    that.ukloniSveIzKorpe();
                    that.dobaviSaRacuna();
                    that.poruka = "Uspesno ste kupili proizvode!"
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

        that.ukloniSveIzKorpe = function(id) {
            $http.delete("/ukloniSveIzKorpe/"+that.korisnik.korpa_id).then(function(response){
                that.dobaviIzKorpe();
            },
            function(reason){
                console.log(reason)
            });
        };

        that.ukloniIzKorpe = function(id) {
            $http.delete("/ukloniIzKorpe/"+that.korisnik.korpa_id+"/"+id).then(function(response){
                that.dobaviIzKorpe();
            },
            function(reason){
                console.log(reason)
            });
        };

        that.dobaviIzKorpe = function(){
            $http.get('/dobaviIzKorpe/'+that.korisnik.korpa_id).then(function(response){
                that.korpa = response.data;
                that.ukupnaCena();
            },
            function(reason){
                console.log(reason);
            })
        }

        that.dobaviSaRacuna = function(){
            $http.get('/dobaviSaRacuna/'+that.korisnik.id).then(function(response){
                that.racun = response.data;
                that.ukupnaCena();
            },
            function(reason){
                console.log(reason);
            })
        }

        that.ukupnaCena = function(){
            that.ukupna = 0;
            for(i = 0; i < that.korpa.length; i++){
                that.ukupna += that.korpa[i].cena * that.korpa[i].kolicina
            }
        }

        that.dobaviPodatke();
}]);
})(angular);