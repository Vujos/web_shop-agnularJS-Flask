(function(angular) {
    var app = angular.module('Aplikacija', ['ui.router', 'ngFileUpload', 'loginService']);

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('app', {
            abstract: true,
            views: {
                navbar: {
                    templateUrl: 'app/navbar/navbar.tpl.html',
                    controller: 'NavbarCtrl',
                    controllerAs: 'nb'
                },
                '': {
                    template: '<ui-view name=""></ui-view>'
                }
            }
        })
        $stateProvider.state('proizvodi',{
            url: '/',
            parent: 'app',
            views:{
                '': { templateUrl: 'app/proizvodi/proizvodi.tpl.html',
                      controller: 'ProizvodiCtrl',
                      controllerAs: 'pr',
                },
                'kategorije@proizvodi': { 
                    templateUrl: 'app/kategorije/kategorije.tpl.html',
                    controller: 'KatCtrl',
                    controllerAs: 'kat'
                }
            }
        }).state('proizvodiKategorije',{
            url: '/{id:int}',
            parent: 'app',
            views:{
                '': { templateUrl: 'app/proizvodi/proizvodi.tpl.html',
                      controller: 'ProizvodiCtrl',
                      controllerAs: 'pr',
                },
                'kategorije@proizvodiKategorije': { 
                    templateUrl: 'app/kategorije/kategorije.tpl.html',
                    controller: 'KatCtrl',
                    controllerAs: 'kat'
                }
            }
        })
        .state('login',{
            url: '/login',
            parent: 'app',
            views:{
                '': { templateUrl: 'app/login/login.tpl.html',
                controller: 'LoginCtrl',
                controllerAs: 'lc'
                }
            }
        }).state('profil',{
            url: '/profil',
            parent: 'app',
            views:{
                '': { templateUrl: 'app/profil/profil.tpl.html',
                controller: 'ProfilCtrl',
                controllerAs: 'prof'
                }
            }
        }).state('proizvod',{
            url: '/proizvod/{id:int}',  
            parent: 'app',
            views:{
                '': { templateUrl: 'app/proizvod/proizvod.tpl.html',
                controller: 'ProizvodCtrl',
                controllerAs: 'pr'
                }
            }
        }).state('korpa',{
            url: '/korpa',
            parent: 'app',
            views:{
                '': { templateUrl: 'app/korpa/korpa.tpl.html',
                controller: 'KorpaCtrl',
                controllerAs: 'kp'
                }
            }
        }).state('izmeniProizvod',{
            url: '/proizvod/{id:int}',
            parent: 'app',
            views:{
                '': { templateUrl: 'app/admin panel/adminPanel.tpl.html',
                    controller: 'AdminCtrl',
                    controllerAs: 'ap'
                }
            }
        }).state('dodajProizvod',{
            url: '/dodajProizvod',
            parent: 'app',
            views:{
                '': { templateUrl: 'app/admin panel/adminPanel.tpl.html',
                    controller: 'AdminCtrl',
                    controllerAs: 'ap'
                }
            }
        })
    }])
})(angular);