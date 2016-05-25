
var express           = require('express'),
    http              = require("http"),
    app               = express(),

    mysql =     require('./client/js/routes/mysql.js'),

    mongoJS =     require('./client/js/routes/mongoJS.js'),

    bodyParser        = require('body-parser');
//    mongoose          = require('mongoose'),
//    meetupsController = require('./server/controllers/meetups-controller');
var path = require('path');

//app.listen(3003);
var mongo = require('mongodb');
var Server = mongo.Server;
var db = mongo.Db;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

app.use('/client', express.static(__dirname + '/client'));

app.use('/js', express.static(__dirname + '/lib/assets/js'));
app.use('/css', express.static(__dirname + '/lib/assets/css'));
app.use('/img', express.static(__dirname + '/lib/assets/img'));
app.use('/font-awesome', express.static(__dirname + '/lib/assets/font-awesome'));

app.use('/views', express.static(__dirname + '/client/views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('request-param')());

app.use(express.static(path.join(__dirname, 'lib')));


exports.getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/lib/assets/login.html');
});
app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + '/lib/assets/index.html');
});
app.get('/register.html', function (req, res) {
    res.sendFile(__dirname + '/lib/assets/register.html');
});

app.get('/login.html', function (req, res) {
    res.sendFile(__dirname + '/lib/assets/login.html');
});
app.get('/navigation.html', function (req, res) {
    res.sendFile(__dirname + '/lib/assets/navigation.html');
});

app.get('/add_sensor.html', function (req, res) {
    res.sendFile(__dirname + '/lib/assets/add_sensor.html');
});

app.get('/add_controller.html', function (req, res) {
    res.sendFile(__dirname + '/lib/assets/add_controller.html');
});

app.get('/monitor.html', function (req, res) {
    res.sendFile(__dirname + '/lib/assets/monitor.html');
});

app.get('/get_sensor_data.html', function (req, res) {
    res.sendFile(__dirname + '/lib/assets/get_sensor_data.html');
});

app.get('/change_sensor_status.html', function (req, res) {
    res.sendFile(__dirname + '/lib/assets/change_sensor_status.html');
});

app.get('/usage.html', function (req, res) {
    res.sendFile(__dirname + '/lib/assets/usage.html');
});
//app.get('/http://52.26.5.2/status.html.', function (req, res) {
//    res.sendFile(__dirname + '/status.html');
//});
app.get('/*.html', function (req, res) {
    res.sendFile(__dirname + '/lib/assets/');
});
//app.get('/login.html', function (req, res) {
//    res.sendFile(__dirname + '/client/views/login.html');
//});

var url = "mongodb://shalini:shalini@ds059694.mongolab.com:59694/project281";

//MongoClient.connect(url, function (err, db) {
//    if (err) {
//        console.log('Unable to connect to the mongoDB server. Error:', err);
//    } else {
//        //HURRAY!! We are connected. :)
//        console.log('Connection established to', url);
//        var collection = db.collection('sensor_data');
//
//        // do some work here with the database.
//        var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
//
//
//        // Insert some users
//        collection.insert([user1], function (err, result) {
//            if (err) {
//                console.log(err);
//            } else {
//                console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
//            }
//            //Close connection
//            db.close();
//        });
//    }
//});

app.post('/signin', function (req, res) {
    mysql.getConnection(function(err, conn){

        var sqlQuery = "SELECT * FROM Users WHERE email = '"+req.body.email+"' and password = '"+req.body.password+"'";

        console.log(req.param("password"));
        console.log(req.param('email'));

        conn.query(sqlQuery, function(err, rows)
        {
            if(err)
            {
                console.log(err);
                console.log(err.code);

                res.code = "401";

                if(err.code == "ER_DUP_ENTRY")
                {
                    res.errorMessage = "This email has already been used";
                }
                else
                {
                    res.errorMessage = "Oops! There was some problem. Please try again.";
                }

                conn.release();
            }
            else
            {
                console.log("Succesful insert");
                res.code = "200";
                res.value = "Succes Registration";
                //res.redirect('/index.html');
                console.log(rows.length);

                res.send({success:1, rowcount: rows.length, users: rows});
                conn.release();
            }

            //callback(null, res);
        });
    });
});

app.post('/register', function (req, res) {
    mysql.getConnection(function(err, conn){
        console.log('in register server');
        var sqlQuery = "SELECT * FROM Users WHERE email = '"+req.body.email+"'";
        var insertQuery = "INSERT INTO Users (first_name, last_name, email, password) values ('"+req.body.firstname
            +"','"+req.body.lastname+"','"+req.body.email+"', '"+req.body.password+"');";

//        conn.query(sqlQuery, function(err, rows)
//        {
//            if(err)
//            {
//                console.log(err);
//                conn.release();
//            }
//            else
//            {
//                console.log(rows.length);
//                if(rows.length<1){
                    conn.query(insertQuery, function(err, rows)
                    {
//                        if(err)
//                        {
//                            console.log(err);
//                            conn.release();
//                        }
//                        else
//                        {
//                           res.send({success:1});
//                           conn.release();
//                        }

                        if(err)
                        {
                            console.log(err);
                            console.log(err.code);

                            res.code = "401";

                            if(err.code == "ER_DUP_ENTRY")
                            {
                                res.errorMessage = "This email has already been used";
                            }
                            else
                            {
                                res.errorMessage = "Oops! There was some problem. Please try again.";
                            }

                            conn.release();
                        }
                        else
                        {
                            console.log("Succesful insert");
                            res.code = "200";
                            res.value = "Succes Registration";
                            //res.redirect('/index.html');
                            console.log(rows.length);

                            res.send({success:1, rowcount: rows.length, users: rows});
                            conn.release();
                        }

                    });
//                }else{
//                    res.send({success:0});
//                    conn.release();
//                }
//            }
//        });


  });
});

app.post('/addcontroller', function (req, res) {
    mysql.getConnection(function(err, conn){

        var sqlQuery = "INSERT INTO Controllers (name, passphrase, location) values ('"+req.body.name+"','"+req.body.passphrase+"','"+req.body.location+"');";
        //console.log(req.param("name"));


        conn.query(sqlQuery, function(err, rows)
        {
            if(err)
            {
                console.log(err);
                console.log(err.code);

                res.code = "401";

                if(err.code == "ER_DUP_ENTRY")
                {
                    res.errorMessage = "This controller already exists";
                    res.send({success:0});

                }
                else
                {
                    res.errorMessage = "Oops! There was some problem. Please try again.";
                }

                conn.release();
            }
            else
            {
                console.log("Succesful insert");
                res.code = "200";
                res.value = "Succes Registration";
                //res.redirect('/index.html');
                console.log(rows.length);

                res.send({success:1, rowcount: rows.length});
                conn.release();
            }

            //callback(null, res);
        });
    });
});

app.post('/addsensor', function (req, res) {
    mysql.getConnection(function(err, conn){

        var sqlQuery = "INSERT INTO Sensors (name, allocation_id, location, controller_id, lat, lng) values ('"+req.param("name")+
            "','"+req.param("allocation_id")+"','"+req.param("location")+"','"+req.param("controller_id")+"',"+req.param("lat")+","+req.param("long")+")";

//        var sqlQuery = "INSERT INTO Sensors (name, allocation_id, location, controller_id, lat, long) values ('"+req.param("name")+
//            "','"+req.param("allocation_id")+"','"+req.param("location")+"','"+req.param("controller_id")+"',"+parseFloat(req.param("lat"))+","+parseFloat(req.param("long"))+")";

        console.log(sqlQuery);
        console.log("add sensor server");

        conn.query(sqlQuery, function(err, rows)
        {
            if(err)
            {
                console.log("add sensor error");
                console.log(err);

                conn.release();
            }
            else
            {
                console.log("Succesful sensor insert");
                res.send({success:1, rowcount: rows.length});
                conn.release();
            }
        });
    });
});


app.post('/subscribeToSensor', function (req, res) {
    mysql.getConnection(function(err, conn){
        console.log("subscribe to sensors");
        var sqlQuery = "INSERT INTO Subscriptions (sensor_id, user_id, allocation_id) values ('"+req.body.sensor_id+"','"+req.body.user_id+"','"+req.body.allocation_id+"');";
        console.log(req.body.sensor_id);
        console.log(req.body.user_id);

        conn.query(sqlQuery, function(err, rows)
        {
            console.log("in subsc query");

            if(err)
            {
                res.errorMessage = "Oops! There was some problem. Please try again.";
                conn.release();
            }
            else
            {
                console.log("Succesful subsc");
                res.send({success:1, rowcount: rows.length});
                conn.release();
            }
        });
    });
});

app.post('/unsubscribe', function (req, res) {
    mysql.getConnection(function(err, conn){
        console.log("unsubscribe to sensors");
        var sqlQuery = "DELETE FROM Subscriptions WHERE allocation_id='"+req.body.allocation_id+"' and user_id='"+req.body.user_id+"'";
        console.log(req.body.sensor_id);
        console.log(req.body.user_id);

        conn.query(sqlQuery, function(err, rows)
        {
            console.log("in unsub query");

            if(err)
            {
                res.errorMessage = "Oops! There was some problem. Please try again.";
                conn.release();
            }
            else
            {
                console.log("Succesful unsub");
                res.send({success:1, rowcount: rows.length});
                conn.release();
            }
        });
    });
});

app.post('/getSubscriptions', function (req, res) {
    mysql.getConnection(function(err, conn){
        console.log("get subs server");
        console.log(req.body.user_id);

        var sqlQuery = "SELECT * FROM Subscriptions WHERE user_id = '"+req.body.user_id+"'";
        conn.query(sqlQuery, function(err, rows)
        {
            if(err)
            {
                res.errorMessage = "Oops! There was some problem. Please try again.";
                conn.release();
            }
            else
            {
                console.log("Succesful check subs");
                res.send({success:1, data: rows});
                conn.release();
            }
        });
    });
});

app.post('/getUserSubscriptions', function (req, res) {
    mysql.getConnection(function(err, conn){
        console.log("get subs server");
        console.log(req.body.user_id);

        var sqlQuery = "SELECT FROM Subscriptions WHERE user_id = '"+req.body.user_id+"' and allocation_id='"+req.body.allocation_id+"'";
        conn.query(sqlQuery, function(err, rows)
        {
            if(err)
            {
                res.errorMessage = "Oops! There was some problem. Please try again.";
                conn.release();
            }
            else
            {
                console.log("Succesful check subs");
                res.send({success:1, data: rows});
                conn.release();
            }
        });
    });
});

app.post('/getcontrollers', function (req, res) {



    mysql.getConnection(function(err, conn){
        //console.log(req.param("name"));
        var sqlQuery = "SELECT * FROM Controllers";


        conn.query(sqlQuery, function(err, rows)
        {
            if(err)
            {
                console.log(err);
                res.code = "401";

                if(err.code == "ER_DUP_ENTRY")
                {
                    res.errorMessage = "This email has already been used";
                    res.send({success:0});

                }
                else
                {
                    res.errorMessage = "Oops! There was some problem. Please try again.";
                }

                conn.release();
            }
            else
            {
                console.log("Succesful select");
                //res.redirect('/index.html');
                console.log(rows.length);

                res.send({success:1, rowlist: rows});
                conn.release();
            }
        });
    });
});

app.post('/getsensors', function (req, res) {
    if (req.param("user_type") == "admin")
    {
        mysql.getConnection(function (err, conn) {
            //console.log(req.param("name"));
            var sqlQuery = "SELECT * FROM Sensors";

            conn.query(sqlQuery, function (err, rows) {
                if (err) {
                    console.log(err);
                    conn.release();
                }
                else {
                    console.log("Succesful sensor select");
                    console.log(rows.length);

                    res.send({success: 1, sensors: rows});
                    conn.release();
                }
            });
        });
    }
    else
    {
        mysql.getConnection(function (err, conn) {
            //console.log(req.param("name"));

            var sqlQuery = "Select * from Sensors where id in (select sensor_id from Subscriptions where user_id = "+req.param("user_id")+")";
            console.log(sqlQuery);

            conn.query(sqlQuery, function (err, rows) {
                if (err) {
                    console.log(err);
                    conn.release();
                }
                else {
                    console.log("Succesful sensor select");
                    console.log(rows.length);

                    res.send({success: 1, sensors: rows});
                    conn.release();
                }
            });
        });
    }
});

app.post('/requestsensors', function (req, res) {
    mysql.getConnection(function(err, conn){
        //console.log(req.param("name"));
        var sqlQuery = "SELECT * FROM Sensors WHERE controller_id = '"+req.body.controller_id+"'";

        conn.query(sqlQuery, function(err, rows)
        {
            if(err)
            {
                console.log(err);
                conn.release();
            }
            else
            {
                console.log("Success(requestsensors)");
                console.log(rows.length);
                res.send({success:1, sensors: rows});
                conn.release();
            }
        });
    });
});

app.post('/sensorData', function(req, res){

    var sensorId = req.param("id");
    console.log(sensorId);
    console.log(req.param("co2"));


    mysql.getConnection(function(err, conn) {

        var sqlQuery = "SELECT status FROM Sensors WHERE id = '" + sensorId + "' and status = 'on'";

        conn.query(sqlQuery, function (err, rows) {
            if (err) {
                console.log(err);
                conn.release();
            }
            else {
                if (rows.length == 0) {
                    console.log("server off");
                }
                else {
                    console.log("server on");

                    mongoJS.sensorDataCollection.insertOne( {
                        "sensorId": sensorId,
                        "postDate" : new Date(),
                        "temperature" : req.param("temperature"),
                        "co2" : req.param("co2"),
                        "co" : req.param("co"),
                        "humidity" : req.param("humidity")

                    }, function(err, result){
                        if(result){
                            console.log("value inserted "+req.param("temperature")+"co: "+req.param("co2")+"co: "
                                +req.param("co")+ "humidity: " + req.param("humidity"));
                        }
                        else{
                            console.log(err);
                        }

                        res.send({"success" : 1});
                    });
                }

                //res.send({success: 1});
                conn.release();
            }
        });
    });
});
app.post('/updateData', function (req, res) {
    console.log(req.body.temperature);
});

app.get("/getSensorData", function(req,res){
    console.log(req.param("id"));
    mongoJS.sensorDataCollection.find({ $query: {"sensorId": "5"}, $orderby: { postDate : -1 } }).limit(5).toArray(function(err,user){
        if(user)
        {
            res.send({"data" : user});
        }
        else
        {
            res.send({"error" : err});
        }
    });
});

app.get("/getLastSensorData", function(req,res){

    console.log(req.param("id"));

    mongoJS.sensorDataCollection.find({ $query: {"sensorId": "5"}, $orderby: { postDate : -1 } }).limit(1).toArray(function(err,user){
        if(user)
        {
            res.send({"data" : user});
        }
        else
        {
            res.send({"error" : err});
        }
    });
});

app.post('/signup', function (req, res) {
    mysql.getConnection(function(err, conn){

        var sqlQuery = "insert into User(name,email,password) values ('"+req.param("name")+"','"+req.param("email")+"','"+req.param("password")+"');";

        console.log(sqlQuery);

        conn.query(sqlQuery, function(err, rows)
        {
            if(err)
            {
                console.log(err);
                console.log(err.code);

                res.code = "401";

                if(err.code == "ER_DUP_ENTRY")
                {
                    res.errorMessage = "This email has already been used";
                }
                else
                {
                    res.errorMessage = "Oops! There was some problem. Please try again.";
                }

                conn.release();
            }
            else
            {
                console.log("Succesful insert");
                res.code = "200";
                res.value = "Succes Registration";

                conn.release();
            }

            callback(null, res);
        });
    });
});

app.post('/getDashboardStats', function (req, res) {
    mysql.getConnection(function(err, conn){

        if(req.param("user_type") == "admin") {
            var sqlQuery = "SELECT (SELECT COUNT(*) FROM Controllers) as controllerCount, (SELECT COUNT(*) FROM Sensors) as sensorCount," +
                "(SELECT COUNT(*) FROM Sensors WHERE status = 'on') as activeSensorCount, (SELECT COUNT(*) FROM Users) as userCount";
        }
        else {
            var sqlQuery = "SELECT (SELECT COUNT(*) FROM    Subscriptions  subs, Sensors s WHERE subs.user_id = "+req.param("user_id")+" and subs.sensor_id = s.id) as sensorCount," +
                "(SELECT COUNT(*) FROM Subscriptions subs, Sensors s WHERE   subs.user_id = "+req.param("user_id")+" and subs.sensor_id = s.id and s.status='on') as activeSensorCount," +
                "(SELECT COUNT(*) FROM Subscriptions subs, Sensors s, Controllers c WHERE subs.user_id = "+req.param("user_id")+" and subs.sensor_id = s.id and s.controller_id = c.id ) as controllerCount";
        }
        conn.query(sqlQuery, function(err, rows)
        {
            if(err)
            {
                console.log(err);
                conn.release();
            }
            else
            {
                console.log("Stats are fetched");
                console.log(rows.length);

                res.send({success:1, stats: rows});
                conn.release();
            }
        });
    });
});

app.post('/getControllerStats', function (req, res) {
    mysql.getConnection(function(err, conn){
        //console.log(req.param("name"));
        console.log(req.param("user_id"));

        if(req.param("user_type") == "admin") {
            var sqlQuery = "SELECT location, controller_id, count(*) as num_rows, sum(status = 'on')  as activeSensors, sum(status ='on' or status='off') as allSensors FROM Sensors GROUP BY location;";
        }
        else
          { //            var sqlQuery = "SELECT location, controller_id, count(*) as num_rows, sum(status = 'on')  as activeSensors, sum(status ='on' or status='off') as allSensors FROM Sensors s WHERE id in (SELECT sensor_id from Subscriptions WHERE user_id = "+req.param("user_id")+") GROUP BY location;";

              var sqlQuery = "SELECT location, controller_id, count(*) as num_rows, sum(status = 'on')  as activeSensors, sum(status ='on' or status='off') as allSensors FROM Sensors s WHERE id in (SELECT sensor_id from Subscriptions WHERE user_id = '"+req.param("user_id")+"') GROUP BY location;";
          }
        conn.query(sqlQuery, function(err, rows)
        {
            if(err)
            {
                console.log(err);
                conn.release();
            }
            else
            {
                console.log("Controller stats are fetched");
                console.log(rows.length);

                res.send({success:1, stats: rows});
                conn.release();
            }
        });
    });
});


app.post('/changeStatus', function (req, res) {
    mysql.getConnection(function(err, conn){
        if((req.body.s_status == "off"))
            var sqlQuery = "UPDATE Sensors SET status='on' WHERE allocation_id='"+req.body.allocation_id+"'";
        else
            var sqlQuery = "UPDATE Sensors SET status='off' WHERE allocation_id='"+req.body.allocation_id+"'";

        conn.query(sqlQuery, function(err, rows)
        {
            if(err)
            {
                console.log(err);
                conn.release();
            }
            else
            {
                console.log("Controller stats are fetched");
                console.log(rows.length);

                res.send({success:1, stats: rows});
                conn.release();
            }
        });
    });
});

app.post("/getUsage", function (req, res) {

    mysql.getConnection(function(err, conn){
        //console.log(req.param("name"));
        var sqlQuery = "SELECT weekday(`subscription_date`) AS period, count(*) as count, date(subscription_date) as subdate FROM `Subscriptions` WHERE `subscription_date` >= CURDATE() - INTERVAL 1 WEEK GROUP BY period order by subdate";

        conn.query(sqlQuery, function(err, rows)
        {
            if(err)
            {
                console.log(err);
                conn.release();
            }
            else
            {
                var usageData = [];

                for(row in rows)
                {
                    var subDate = new Date(rows[row].subdate);

                    usageData.push({"count" : rows[row].count, "date" : (subDate.getMonth()+1)+"/"+subDate.getDate()});
                }

                console.log(usageData);

                res.send({success:1, usageData: usageData});
                conn.release();
            }
        });
    });

});

app.listen(3000, function() {
    console.log('I\'m Listening...');
});