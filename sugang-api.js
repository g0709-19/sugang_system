const db = require('./mysql-db');
let api = {};

api.getClassFromMajor = function(res, major) {
    const sql = `select * from class where id in (
	select class from class_relation where major=${major});`;
    db.query(sql, (err, rows) => {
        if (err) {
            return undefined;
        }
        else {
            if (rows)
                res.json(rows);
            else
                res.status(500).send('Internal server error!');
        }
    });
}

api.getClassFromUniv = function(res, univ) {
    const sql = `select * from class where id in (
	select class from class_relation where major in (
		select major from major_relation where univ=${univ}
    ));`;
    db.query(sql, (err, rows) => {
        if (err) {
            return undefined;
        }
        else {
            if (rows)
                res.json(rows);
            else
                res.status(500).send('Internal server error!');
        }
    });
}

module.exports = api;