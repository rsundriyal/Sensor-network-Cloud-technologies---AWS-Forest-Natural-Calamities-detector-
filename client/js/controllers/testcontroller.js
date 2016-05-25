/**
 * Created by tugceakin on 11/24/15.
 */

var cloud_project = angular.module('cloud_project', ['ngCookies', 'ngRoute']);


cloud_project.controller('signinFunction', function($scope, $http, $cookies) {
    console.log($cookies.get('user'));

console.log('in signin');
    $scope.invalid_login = true;
    $scope.unexpected_error = true;
    $scope.signin = function() {
        $scope.user_email = $scope.email;
        $scope.user_type = $cookies.get("user_type");

        $http({
            method : "POST",
            url : '/signin',
            data : {
                email : $scope.email,
                password : $scope.password
            }
        }).success(function(data) {
            if(data.success == 1)
            {
                console.log(data.users[0].email);
                $scope.user_type = "admin";

                if(data.rowcount == 1)
                {
                   $cookies.put('user', data.users[0].email);
                   $cookies.put('user_id', data.users[0].id);
                   $cookies.put('user_type', data.users[0].type);

                   window.location.assign("/index.html");
                   console.log($cookies.get('user_id'));
                }
            }
            else if(data.success == 0)
            {
                alert("Please enter the correct password.");
            }
            else if(data.success == -1)
            {
                alert("Please enter valid username and password.");
            }
        }).error(function(error) {
//			$scope.unexpected_error = false;
//			$scope.invalid_login = true;
        }).then(function(data) {
            $scope.user_type = "admin";

        });
    };
});

cloud_project.controller('userTypeControl', function($scope, $http, $cookies) {
    $scope.user_type = $cookies.get("user_type");
    if($cookies.get("user_type") == "admin")
        $scope.isAdmin = true;
    else
        $scope.isAdmin = false;



});

cloud_project.controller('addControllerFunction', function($scope, $http) {
    console.log("add controller function");

    $scope.addcontroller = function() {

        $http({
            method : "POST",
            url : '/addcontroller',
            data : {
                name : $scope.controller_name,
                location : $scope.controller_location,
                passphrase: $scope.controller_passphrase
            }
        }).success(function(data) {
            console.log(data);
            if(data.success == 1)
            {
                alert("Success!");
            }
            else if(data.success == 0)
            {
                alert("Error! This controller already exists.");
            }
//            else if(data.success == -1)
//            {
//                alert("Please enter valid username and password.");
//            }
        }).error(function(error) {
            alert("Error! This controller already exists.");
        })
    };
});


cloud_project.controller('registerFunction', function($scope, $http) {

    $scope.register = function() {
        console.log("register function");
        console.log($scope.reg_email);
        console.log($scope.reg_password);

        $http({
            method : "POST",
            url : '/register',
            data : {
                firstname : $scope.first_name,
                lastname : $scope.last_name,
                password: $scope.reg_password,
                email: $scope.reg_email
            }
        }).success(function(data) {
            console.log(data);
            if(data.success == 1)
            {
                console.log("Success!");
                window.location.assign("/login.html");

            }
            else if(data.success == 0)
            {
                alert("Error! This email already exists.");
            }
//            else if(data.success == -1)
//            {
//                alert("Please enter valid username and password.");
//            }
        }).error(function(error) {
            console.log(error);
        })
    };
});

cloud_project.controller('getSensorsFunction', function($scope, $http, $cookies, $route) {
    console.log("get sensors function");

    $scope.refreshMonitorTables = function(s){
        console.log(s.allocation_id);
        myTemperatureChart.destroy();
        myHumidityChart.destroy();
        myCOChart.destroy();
        myCO2Chart.destroy();

        myTemperatureChart = new Chart(ctx_temp).Line(startingData, {animationSteps: 15});
        myHumidityChart = new Chart(ctx_humidity).Line(startingHumidityData, {animationSteps: 15});
        myCOChart = new Chart(ctx_co).Line(startingCOData, {animationSteps: 15});
        myCO2Chart = new Chart(ctx_co2).Line(startingCO2Data, {animationSteps: 15});
    };

    $scope.isSensorOn = function(s) {
        return s.status == "on"
    };

    $scope.isSensorOff = function(s) {
        return s.status != "on"
    };

    $scope.isSubscribed = function(s) {

        for(var i=0; i<$scope.subscriptions.length; i++){
            if($scope.subscriptions[i].allocation_id == s.allocation_id && s.status == "on"){
                return true;
            }
        }
        return false;
    };


        $http({
            method : "POST",
            url : '/getsensors',
            data : {
                "user_type":$cookies.get("user_type"),
                "user_id":$cookies.get("user_id")
            }
        }).success(function(data) {
            console.log(data);
            if(data.success == 1)
            {
                console.log("Success! Sensors found");
                $scope.sensors = data.sensors;

            }
            else if(data.success == 0)
            {
                console.log("Error! Sensors not found");
            }
//            else if(data.success == -1)
//            {
//                alert("Please enter valid username and password.");
//            }
        }).error(function(error) {
            console.log(error);
        });

    $http({
        method : "POST",
        url : '/getcontrollers',
        data : {
        }
    }).success(function(data) {
        console.log(data.rowlist);
        console.log(data.rowlist[0].name);
        $scope.test = data.rowlist[0].name;
        $scope.controllers = data.rowlist;
        if(data.success == 1)
        {
            console.log("Success!");
        }
    }).error(function(error) {
        console.log(error);
    });


    $scope.getSensors = function() {

        $http({
            method : "POST",
            url : '/getsensors',
            data : {
            }
        }).success(function(data) {
            console.log(data);
            if(data.success == 1)
            {
                console.log("Success! Sensors found");
                $scope.sensors = data.sensors;
            }
            else if(data.success == 0)
            {
                console.log("Error! Sensors not found");
            }

        }).error(function(error) {
            alert("Error! This controller already exists.");
        });


    };

    $scope.requestSensors = function() {

        $http({
            method : "POST",
            url : '/requestsensors',
            data : {
                controller_id: $scope.controller_id,
//                sensor_count: $scope.sensor_count,
                user_id:$cookies.get("user_id")
            }
        }).success(function(data) {
            console.log(data);
            if(data.success == 1)
            {
                console.log("Success! Request is successful");
                console.log(data);
                $scope.sensors = data.sensors;
                $( "#requestSensorTable" ).show();
            }
            else if(data.success == 0)
            {
                console.log("Error! Sensors not found");
            }
//            else if(data.success == -1)
//            {
//                alert("Please enter valid username and password.");
//            }
        }).error(function(error) {
            alert("Error! This controller already exists.");
        });

    };

    $http({
        method: "POST",
        url: '/getSubscriptions',
        data: {
            user_id: $cookies.get('user_id')
        }
    }).success(function (data) {
        $scope.subscriptions = data.data;
        if (data.success == 1) {
            console.log("Success! Subscriptions are fetched");
        }
    }).error(function (error) {
        console.log(error);
    });

    $scope.subscribeSensor = function(id, allocation_id) {
        console.log(id);
        $http({
            method : "POST",
            url : '/subscribeToSensor',
            data : {
                user_id: $cookies.get("user_id"),
                sensor_id: id,
                allocation_id: allocation_id

            }
        }).success(function(data) {
            console.log("data sent from subs sensor")
            console.log(data);

            $scope.subscriptions.push({sensor_id: id, allocation_id: allocation_id, user_id: $cookies.get("user_id")});
            if(data.success == 1)
            {
                console.log(data);
            }
            else if(data.success == 0)
            {
                console.log("Error!");
            }
        }).error(function(error) {
            console.log(error);
        })
    };


    $scope.unsubscribeSensor = function(id, allocation_id) {
        console.log(id);
        $http({
            method : "POST",
            url : '/unsubscribe',
            data : {
                user_id: $cookies.get("user_id"),
                sensor_id: id,
                allocation_id: allocation_id

            }
        }).success(function(data) {
            console.log("data sent from subs sensor");
            console.log(data);
            for(var i=0; i<$scope.subscriptions.length; i++){
                if($scope.subscriptions[i].allocation_id == allocation_id){
                    $scope.subscriptions.splice(i, 1);
                    break;
                }
            }
            if(data.success == 1)
            {
                console.log(data);
            }
            else if(data.success == 0)
            {
                console.log("Error!");
            }
        }).error(function(error) {
            console.log(error);
        })
    };

    $scope.changeStatus = function(id, allocation_id, sensor_status) {
        console.log(id);
        $http({
            method : "POST",
            url : '/changeStatus',
            data : {
                sensor_id: id,
                allocation_id: allocation_id,
                s_status: sensor_status
            }
        }).success(function(data) {
            console.log("data sent from change status");
            console.log(data);
            if(data.success == 1)
            {
                window.location.reload();
                console.log(data);
            }
            else if(data.success == 0)
            {
                console.log("Error!");
            }
        }).error(function(error) {
            console.log(error);
        })
    };


});

cloud_project.controller('addSensorFunction', function($scope, $http) {

    console.log("add sensor function");
    $http({
        method : "POST",
        url : '/getcontrollers',
        data : {
        }
    }).success(function(data) {
        console.log(data.rowlist);
        console.log(data.rowlist[0].name);
        $scope.test = data.rowlist[0].name;
        $scope.controllers = data.rowlist;
        if(data.success == 1)
        {
            console.log("Success!");
        }
//            else if(data.success == 0)
//            {
//                alert("Error! This controller already exists.");
//            }
//            else if(data.success == -1)
//            {
//                alert("Please enter valid username and password.");
//            }
    }).error(function(error) {
        console.log(error);
    });



    $scope.addsensor = function() {

        for(var i=0; i<$scope.controllers.length; i++){
            if($scope.controllers[i].id == $scope.controller_id){
                $scope.sensorlocation = $scope.controllers[i].location;
                break;
            }

        }
        $http({
            method : "POST",
            url : '/addsensor',
            data : {
                name : $scope.sensor_name,
                location : $scope.sensorlocation,
                allocation_id: $scope.sensor_allocation_id,
                controller_id: $scope.controller_id,
                lat: $scope.sensor_latitude,
                long: $scope.sensor_longitude
            }
        }).success(function(data) {
            console.log(data);
            if(data.success == 1)
            {
                alert("Success!");
            }
            else
            {
                alert("Error!");
            }
//            else if(data.success == -1)
//            {
//                alert("Please enter valid username and password.");
//            }
        }).error(function(error) {
            alert("Error! This controller already exists.");
        })
    };
});


cloud_project.controller('getSubscriptionsFunction', function($scope, $http, $cookies) {


    $http({
        method: "POST",
        url: '/getSubscriptions',
        data: {
            user_id: $cookies.get('user_id')
        }
    }).success(function (data) {
        $scope.subscriptions = data.data;
        if (data.success == 1) {
            console.log("Success! Subscriptions are fetched");
        }
    }).error(function (error) {
        console.log(error);
    });

});


cloud_project.controller('usageController', function($scope, $http, $cookies) {


    $http({
        method: "POST",
        url: '/getUsage',
        data: {
        }
    }).success(function (data) {
        $scope.usage = data.usageData;
        console.log(data.usageData);
        if (data.success == 1) {
            console.log("Success! getUsage controller");

        }

        var sensorCount = [];
        var days = [];

        var dummyArray = []
        for(var i=0; i<$scope.usage.length; i++){
            days.push($scope.usage[i].date);
            sensorCount.push($scope.usage[i].count);

//            activeSensorsArray.push($scope.c_stats[i].activeSensors);
//
//                controllerNames.push($scope.c_stats[i].location);
//
//            controllerIDs.push($scope.c_stats[i].controller_id);


        }

        var barData = {
            labels: days,
            datasets: [
                {
                    label: "All Sensors",
                    fillColor: "rgba(26,179,148,0.5)",
                    strokeColor: "rgba(26,179,148,0.8)",
                    highlightFill: "rgba(26,179,148,0.75)",
                    highlightStroke: "rgba(26,179,148,1)",
                    data: sensorCount
                }

            ]
        };

        var barOptions = {
            scaleBeginAtZero: true,
            scaleShowGridLines: true,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            barShowStroke: true,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            responsive: true,
            pointLabelSeperator: "\n"

        };


        var ctx = document.getElementById("barChart").getContext("2d");
        var myNewChart = new Chart(ctx).Bar(barData, barOptions);

    }).error(function (error) {
        console.log(error);
    });

});

cloud_project.controller('dashboardController', function($scope, $http, $cookies) {


    $http({
        method: "POST",
        url: '/getDashboardStats',
        data: {
            "user_type":$cookies.get("user_type"),
            "user_id":$cookies.get("user_id")
        }
    }).success(function (data) {
        $scope.stats = data.stats[0];
        console.log(data);
        console.log("Success! Subscriptions are fetched");
    }).error(function (error) {
        console.log(error);
    });

    $http({
        method: "POST",
        url: '/getControllerStats',
        data: {
            "user_type":$cookies.get("user_type"),
            "user_id":$cookies.get("user_id")
        }
    }).success(function (data) {
        $scope.c_stats = data.stats;
        console.log(data.stats[0].allSensors);
        var allSensorsArray = [];
        var activeSensorsArray = [];
        var controllerNames = [];
        var controllerIDs = [];

        var dummyArray = []
        for(var i=0; i<$scope.c_stats.length; i++){
            allSensorsArray.push($scope.c_stats[i].allSensors);
            activeSensorsArray.push($scope.c_stats[i].activeSensors);
            if($scope.c_stats[i].location.length > 25) {
                controllerNames.push($scope.c_stats[i].location.substring(0,20)+"...");
            }else{
                controllerNames.push($scope.c_stats[i].location);

            }
            controllerIDs.push($scope.c_stats[i].controller_id);

            dummyArray.push("");
        }
        console.log(allSensorsArray);
        console.log("Success! Subscriptions are fetched");
        var barData = {
            labels: controllerNames,
            datasets: [
                {
                    label: "All Sensors",
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: allSensorsArray
                },
                {
                    label: "Active Sensors",
                    fillColor: "rgba(26,179,148,0.5)",
                    strokeColor: "rgba(26,179,148,0.8)",
                    highlightFill: "rgba(26,179,148,0.75)",
                    highlightStroke: "rgba(26,179,148,1)",
                    data: activeSensorsArray
                }

            ]
        };

        var barOptions = {
            scaleBeginAtZero: true,
            scaleShowGridLines: true,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            barShowStroke: true,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            responsive: true,
            pointLabelSeperator: "\n"

        }


        var ctx = document.getElementById("barChart").getContext("2d");
        var myNewChart = new Chart(ctx).Bar(barData, barOptions);



    }).error(function (error) {
        console.log(error);
    });

    $http({
        method : "POST",
        url : '/getsensors',
        data : {
            "user_type":$cookies.get("user_type"),
            "user_id":$cookies.get("user_id")
        }
    }).success(function(data) {
        console.log(data);
        if(data.success == 1)
        {
            console.log("Success! Sensors found");
            $scope.sensors = data.sensors;

            for (i = 0; i < $scope.sensors.length; i++){
                createMarker($scope.sensors[i]);
            }
        }
        else if(data.success == 0)
        {
            console.log("Error! Sensors not found");
        }
    }).error(function(error) {
        console.log(error);
    });


    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(37.599816, -121.113037),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function (info){

        var image;

        if(info.status == 'on')
        {

            image = '/img/green_marker.png';
        }
        else
        {
            image = '/img/red_marker.png';
        }

        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.lng),
            title: "Id: " + info.allocation_id + " - " + info.location,
            icon: image
        });
        marker.content = '<div class="infoWindowContent"><label>Sensor Name: </label>'+ info.name + '&nbsp;&nbsp;&nbsp;<label>Sensor ID: </label>' + info.allocation_id + '</div>';

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);

    };



    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };

});

function testcontroller($scope){

    $scope.meetups = [{name: 'aa'}, {name: 'bb'}];

    $scope.createMeetup = function(){
        $scope.meetups.push({name: $scope.meetupName});
    }
}