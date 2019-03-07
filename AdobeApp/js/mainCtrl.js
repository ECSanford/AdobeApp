app.controller('mainCtrl', function($scope) {
                $scope.items = [];
                $scope.values = [];
                $scope.addItem = function () {
                    $scope.errortext = "";
                    if(!$scope.addDesc) {return;}
                    if($scope.items.indexOf($scope.addDesc) == -1) {
                        $scope.items.push($scope.addDesc);
                        $scope.values.push($scope.addValue);
                    } else {
                        $scope.errortext = "You already have a value for that!";
                    }
                  } 
                $scope.removeItem = function(item) {
                  $scope.errortext = "";
                  $scope.items.splice(item, 1);
                }
            });

