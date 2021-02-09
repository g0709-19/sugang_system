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

module.exports = api;