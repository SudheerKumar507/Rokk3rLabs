angular.module("rockk3rLabs")
    .service("taskService", function ($http) {

        var url = 'http://13.126.48.3:3000';

        this.getTasks = function () {
            return $http.get(url + '/task').
                then(function (response) {
                    return response;
                }, function (error) {
                    alert("Error finding Tasks.");
                });
        }
        this.createTask = function (taskData) {
            return $http.post(url + '/task/create', taskData).
                then(function (response) {
                    return response;
                }, function (error) {
                    alert("Error to creating Task.");
                });
        }

        this.editTask = function (id, editTask) {
            return $http.post(url + '/task/destroy/:id', editTask).
                then(function (response) {
                    return response;
                }, function (error) {
                    console.log(error);
                });
        }
        this.removeTask = function (removeTask) {
            return $http.post(url + '/task/destroy', removeTask).
                then(function (response) {
                    return response;
                }, function (error) {
                    console.log(error);
                });
        }
    });