const mysql = require('mysql');

// var db = mysql.createConnection({
//     host     : process.env.DB_HOST,
//     port     : process.env.DB_PORT,
//     user     : process.env.DB_USER,
//     password : process.env.DB_PASS,
//     database : process.env.DB_NAME,
// });
// db.connect();

var db;

function connectDatabase() {
	db = mysql.createConnection({
		host     : process.env.DB_HOST,
		port     : process.env.DB_PORT,
		user     : process.env.DB_USER,
		password : process.env.DB_PASS,
		database : process.env.DB_NAME,
	});
  
	db.connect(function(err) {
	  	if(err) {
			console.error('Error establishing connection... retrying', err);
			setTimeout(connectDatabase, 2000);
		}     
		else connectionResets = 0;
	});                            

	db.on('error', function(err) {
	  	connectionResets++;
		if (connectionResets < 5) connectDatabase();	                      
		else {
			console.error("Could not establish database connection");
			throw err;     
		}
	});
}

connectDatabase();

exports.getTeams = async () => {
    return new Promise((res, err) => {
		db.query(`SELECT * FROM teams`, (error, results, fields) => {
            if (error) return err(error);
			return res(results);
		});
	});
};

exports.getSchools = async () => {
    return new Promise((res, err) => {
		db.query(`SELECT * FROM schools`, (error, results, fields) => {
            if (error) return err(error);
			return res(results);
		});
	});
};

exports.getLeagues = async () => {
    return new Promise((res, err) => {
		db.query(`SELECT * FROM leagues`, (error, results, fields) => {
            if (error) return err(error);
			return res(results);
		});
	});
};