var app = angular.module("rockk3rLabs", ['ngRoute', 'datatables']);


    app.config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "tasksList.html",
                controller: "ListController",
                resolve: {
                    tasks: function (taskService) {
                        return taskService.getTasks();
                    }
                }
            })
            .otherwise({
                redirectTo: "/"
            })
    });

