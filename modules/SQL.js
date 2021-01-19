const config = require('../config');
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

exports.getSchedule = async () => {
    return new Promise((res, err) => {
		db.query(`SELECT * FROM schedule`, (error, results, fields) => {
            if (error) return err(error);
			return res(results);
		});
	});
};

exports.getGames = async () => {
    return new Promise((res, err) => {
		db.query(`SELECT * FROM lol_games`, (error, results, fields) => {
            if (error) return err(error);
			return res(results);
		});
	});
};

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