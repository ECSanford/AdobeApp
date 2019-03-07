app.controller("CsvCtrl", ["$scope", "$q", function($scope,$q) {
     
    // ...  the rest of the code
     
    // Upload and read CSV function
    $scope.submitForm = function(form) {
        clearAlerts();
        var filename = document.getElementById("bulkDirectFile");
        if (filename.value.length < 1 ){
            ($scope.warning = "Please upload a file");
        } else {
            $scope.title = "Confirm file";
            var file = filename.files[0];
            console.log(file)
            var fileSize = 0;
            if (filename.files[0]) {
                  
                var reader = new FileReader();
                reader.onload = function (e) {
                    var table = $("<table />").css('width','100%');
                     
                    var rows = e.target.result.split("\n");
                    for (var i = 0; i < rows.length; i++) {
                        var row = $("<tr  />");
                        var cells = rows[i].split(",");
                        for (var j = 0; j < cells.length; j++) {
                            var cell = $("<td />").css('border','1px solid black');
                            cell.html(cells[j]);
                            row.append(cell);
                        }
                        table.append(row);
                    }
                    $("#dvCSV").html('');
                    $("#dvCSV").append(table);
                }
                 
                reader.readAsText(filename.files[0]);
             
            }
            return false;
        }
    }
          
}]);