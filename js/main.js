var app = angular.module("myTest",[]);
app.controller("myCtr",function ($scope) {
	$scope.friends=[{"name":'ahmed',"job":"driver"},
					{"name":'mhmed',"job":"actor"},
					{"name":'mhmoud',"job":"actor"}];

	$scope.clickme=function(name, job){
		$scope.updateName=name;
		$scope.updateJob=job;
	}					
});	