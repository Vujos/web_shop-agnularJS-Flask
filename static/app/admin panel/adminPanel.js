(function (angular) {
    var app = angular.module('Aplikacija');
    app.controller('AdminCtrl', ['$http', '$state', 'loginService', 'Upload', '$stateParams', '$timeout', function($http, $state, loginService, Upload, $stateParams, $timeout) {
        var that = this;

        that.uspesno = false;
        that.izmeni = false;
        that.kategorija = {};
        that.proizvod = {};
        that.proizvodZaIzmenu = {
            opis : '',
        };
        that.kategorije = [];
        that.proizvodjaci = [];
        that.merne = [];
        that.pretragaProizvodjaca = "";
        that.pretragaKategorija = "";
        that.novaKategorija = "";
        that.pretragaMerne = {
            naziv : "",
            skracenica : "",
        };
        that.poruka = "";

        that.ulogovan = function () {
            loginService.isLoggedIn(function () {
                loginService.getLoggedIn(function (korisnik) {
                    korisnik.skracenica = "A";
                    loginService.autorizovan(korisnik, function() {
                        that.dobaviKategorije();
                        that.dobaviProizvodjace();
                        that.dobaviMerneJedinice();
                        if($stateParams.id != null){
                            that.dobaviProizvod($stateParams.id);
                        }
                    },
                    function() {
                        $state.go('login');
                    })
                },
                function (errorReason) {
                })
            }, function () {
                $state.go('proizvodi');
            });
        }

        that.dodajProizvod = function () {
            that.proizvodZaIzmenu.kategorija_id = that.proizvodZaIzmenu['kategorija']['id'];
            that.proizvodZaIzmenu.proizvodjac_id = that.proizvodZaIzmenu['proizvodjac']['id'];
            that.proizvodZaIzmenu.merna_jedinica_id = that.proizvodZaIzmenu['merna']['id'];
            Upload.upload({
                url: '/dodajProizvod',
                method: 'POST',
                data: {slika:that.proizvodZaIzmenu.novaSlika,
                       podaciOProizvodu: Upload.json(that.proizvodZaIzmenu)}}).then(function () {
                that.poruka = "Uspesno ste dodali proizvod!"
                that.obavestenje();
            },
            function (reason) {
                console.log(reason);
            });
        }

        that.izmeniProizvod = function () {
            that.proizvodZaIzmenu.kategorija_id = that.proizvodZaIzmenu['kategorija']['id'];
            that.proizvodZaIzmenu.proizvodjac_id = that.proizvodZaIzmenu['proizvodjac']['id'];
            that.proizvodZaIzmenu.merna_jedinica_id = that.proizvodZaIzmenu['merna']['id'];
            Upload.upload({
                url: '/izmeniProizvod/' + that.proizvodZaIzmenu.id,
                method: 'PUT',
                data: {slika:that.proizvodZaIzmenu.novaSlika,
                       podaciOProizvodu: Upload.json(that.proizvodZaIzmenu)}}).then(function () {
                that.poruka = "Uspesno ste izmenili proizvod!"
                that.obavestenje();
            },
            function (reason) {
                console.log(reason);
            });
        }

        that.dodajKategoriju = function() {
            $http.post("/dodajKategoriju/"+that.pretragaKategorija).then(function(response){
                if(response.data["status"] == "done") {
                    that.dobaviKategorije();
                }
            },
            function(reason){
                console.log(reason);
            })
        };

        that.dobaviMerneJedinice = function(){
            $http.get('merneJedinice').then(function(response){
                that.merne = response.data;
            },
            function(reason){
                console.log(reason);
            })
        }

        that.dodajProizvodjaca = function() {
            $http.post("/dodajProizvodjaca/"+that.pretragaProizvodjaca).then(function(response){
                if(response.data["status"] == "done") {
                    that.dobaviProizvodjace();
                }
            },
            function(reason){
                console.log(reason);
            })
        };

        that.dobaviProizvodjace = function(){
            $http.get('proizvodjaci').then(function(response){
                that.proizvodjaci = response.data;
            },
            function(reason){
                console.log(reason);
            })
        }

        that.dobaviKategorije = function() {
            $http.get('kategorije').then(function(response){
                that.kategorije = response.data;
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

        that.odustaniOdIzmene = function() {
            that.izmeni = false;
            that.proizvodZaIzmenu = {};
            $state.go('proizvodi');
        }

        that.dobaviProizvod = function(id) {
            that.izmeni = true;
            $http.get('proizvod/'+id).then(function(response){
                that.proizvod = response.data;
                that.proizvodZaIzmenu = angular.copy(that.proizvod);
            },
            function(reason){
                console.log(reason);
            })
        };

        that.ulogovan();
    }]);
})(angular);