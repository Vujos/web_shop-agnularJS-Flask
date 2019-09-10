(function (angular) {
    var app = angular.module('Aplikacija');
    app.controller('KatCtrl', ['$http', function($http) {
        var that = this;
        
        that.kategorije = [];

        that.dobaviKategorije = function() {
            $http.get('kategorije').then(function(response){
                that.kategorije = response.data;
            },
            function(reason){
                console.log(reason);
            })
        };
        
        that.dobaviKategorije();

}]);
})(angular);