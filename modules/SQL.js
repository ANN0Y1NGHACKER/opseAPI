const mysql = require('mysql');

var db;
let connectDatabase = () => {
	db = mysql.createConnection({
		host     : process.env.DB_HOST,
		port     : process.env.DB_PORT,
		user     : process.env.DB_USER,
		password : process.env.DB_PASS,
		database : process.env.DB_NAME,
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

exports.recordGame = async (id, score1, score2) => {
	return new Promise((res, err) => {
		db.query(`UPDATE schedule SET Team1_score = '${score1}', Team2_score = '${score2}' WHERE (ID = '${id}')`, (error, results, fields) => {
            if (error) return err(error);
			return res(results);
		});
	});
}

exports.recordLoLGame = async (GameID, MatchID, StartTime, Team1_ID, Team2_ID, WinningTeam_ID, Description, Tournament_Code) => {
	return new Promise((res, err) => {
		db.query(`INSERT into lol_games (GameID, MatchID, StartTime, Team1_ID, Team2_ID, WinningTeam_ID, Description, Tournament_Code) VALUES ('${GameID}', '${MatchID}', '${StartTime}', '${Team1_ID}', '${Team2_ID}', '${WinningTeam_ID}', '${Description}', '${Tournament_Code}')`, (error, results, fields) => {
            if (error) return err(error);
			return res(results);
		});
	});
}