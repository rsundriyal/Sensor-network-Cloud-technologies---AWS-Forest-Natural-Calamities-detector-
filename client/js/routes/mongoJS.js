var mongoURL = "mongodb://username:password@ds059524.mongolab.com:59524/sensordata";

var MongoClient = require('mongodb').MongoClient;

var database = null;

//MongoClient.connect("mongodb://shalini:shalini@ds059694.mongolab.com:59694/project281", {

MongoClient.connect("mongodb://username:password@ds059524.mongolab.com:59524/sensordata?", {
	db : {},
	server : {
		poolSize : 100
	},
	replSet : {},
	mongos : {}
}, function(err, db)
{

	console.log('connection created');

	database = db;
	exports.sensorDataCollection = db.collection('sensordata');
});
