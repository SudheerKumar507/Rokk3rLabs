angular.module("rockk3rLabs")
    .controller("ListController", function (tasks, $scope, $location, DTOptionsBuilder, DTColumnBuilder, taskService) {
        $scope.tasks = tasks.data;
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('order', [0, 'asc']);
        $scope.removeTask = function (task) {
            var id = task._id;
            taskService.removeTask(task).then(function (response) {
                $scope.tasks.splice(id, 1)
            })
        }

        $scope.saveTask = function (task) {
            angular.element('#addTask').modal('hide');
            taskService.createTask(task).then(function (response) {
                if (response.data.msg) {
                    alert(response.data.msg)
                } else {
                    taskService.getTasks().then(function (response) {
                        $scope.tasks = response.data;
                        $location.path("/");
                    })
                }
            }, function (error) {
                console.log(error);
            });
        }

        $scope.getTaskId = function (task) {
            $scope.editData = task
        }

        $scope.updateTask = function (editTask) {
            angular.element('#editTask').modal('hide');
            taskService.editTask(editTask._id, editTask).then(function (response) {
                taskService.getTasks().then(function (response) {
                    $scope.tasks = response.data;
                    $location.path("/");
                })
            })
        }

    })
