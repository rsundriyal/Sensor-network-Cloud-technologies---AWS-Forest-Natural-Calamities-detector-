 var mysql = require('mysql');

 var pool = mysql.createPool({
     connectionLimit : 100, //important
     host     : 'localhost',
     user     : 'root',
     password : '',
     database : '281project',
     debug    :  false,
//	 port	  : 3308
//     connectionLimit : 100, //important
//     host     : 'cloudrdbs.cvnryywgh9j4.us-west-2.rds.amazonaws.com',
//     user     : 'tugceakin',
//     password : '23456789',
//     database : 'cloudrdbs',
//     debug    :  false,
     port	  : 3306
 });
 
exports.getConnection = function(callback) {
	    pool.getConnection(function(err, connection) {
	        callback(err, connection);
	});
};