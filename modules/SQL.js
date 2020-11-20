const config = global.CONFIG;
const mysql = require('mysql');

var db;

let connectDatabase = () => {
	db = mysql.createConnection({
		host     : config.DB_HOST,
		port     : config.DB_PORT,
		user     : config.DB_USER,
		password : config.DB_PASS,
		database : config.DB_NAME,
	});
  
	db.connect(err => {
	  	if (err) {
			console.error('Error establishing connection... retrying', err);
			setTimeout(connectDatabase, 2000);
		}
		else connectionResets = 0;
	});                            

	db.on('error', err => {
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

exports.getPlayers = async () => {
    return new Promise((res, err) => {
		db.query(`SELECT * FROM players`, (error, results, fields) => {
            if (error) return err(error);
			return res(results);
		});
	});
};