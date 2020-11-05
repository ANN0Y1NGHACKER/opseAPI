const mysql = require('mysql');

var db = mysql.createConnection({
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
});
db.connect();

db.on("error", () => {
	// db.connect();
	console.log("SQL DISCONNECTED")
});

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