const db = require('./mysql-db');
let api = {};

// 모든 과목 조회
api.getAllClass = function(res) {
    const sql = `select * from class`;
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

// 전공 번호로 과목 조회
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

// 대학 번호로 과목 조회
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
                res.status(500).send('<h1>Internal server error!</h1>');
        }
    });
}
// 대학 번호로 학과 조회
api.getMajorFromUniv = function(res, univ) {
    const sql = `select * from major where id in (
        select major from major_relation where univ=${univ}
    );`;
    db.query(sql, (err, rows) => {
        if (err) {
            return undefined;
        }
        else {
            if (rows)
                res.json(rows);
            else
                res.status(500).send('<h1>Internal server error!</h1>');
        }
    });
}

// 학생이 신청한 과목들 조회
api.lookup = function(res, user_id) {
    const sql = `select * from user_applylist where user_id=${user_id};`;
    db.query(sql, (err, rows) => {
        if (err) {
            return undefined;
        }
        else {
            if (rows) {
                // 신청한 과목이 없다면 빈 리스트 그대로 출력
                if (rows.length <= 0) res.json(rows);
                this.getClassFromIds(res, rows, result => res.json(result));
            }
            else
                res.status(500).send('<h1>Internal server error!</h1>');
        }
    });
}

// 수강번호로 과목 정보 조회
api.getClassFromIds = function(res, rows, callback) {
    let result = [];
    const length = rows.length;
    rows.forEach(row => {
        const id = row['class_id'];
        this.getClassFromId(id, (err, rows) => {
            if (err) {
                res.status(500).send('<h1>Internal server error!</h1>');
            } else {
                if (rows) {
                    result.push(rows[0]);
                    if (length == result.length)
                        callback(result);
                } else {
                    res.status(500).send('<h1>Internal server error!</h1>');
                }
            }
        });
    });
}

// 수강번호로부터 과목 불러오기
api.getClassFromId = function(id, callback) {
    const sql = `select * from class where id=${id};`;
    db.query(sql, (err, rows) => callback(err, rows));
}

// 수강 신청
api.enroll = function(user_id, class_id, callback) {
    // 중복체크
    this.already(user_id, class_id, (err, rows) => {
        if (err) {
            console.log(err);
            callback(false);
        }
        else {
            // 이미 신청한 과목이면 false
            if (rows && rows.length > 0) callback(false);
            else {
                //있는 과목인지 체크
                this.exist(class_id, (err, rows) => {
                    if (err || (rows === undefined || rows.length <= 0)) {
                        console.log('없는 과목');
                        callback(false);
                    } else {
                        const sql = `insert into user_applylist (user_id, class_id) values(
                        ${user_id}, ${class_id});`;
                        db.query(sql, (err, rows) => {
                            if (err) {
                                console.log(err);
                                callback(false);
                            } else {
                                callback(true);
                            }
                        });
                    }
                });
            }
        }
    })
}

// 있는 과목인지 체크
api.exist = function(class_id, callback) {
    const sql = `select * from class where id=${class_id}`;
    db.query(sql, (err, rows) => callback(err, rows));
}

// 중복 체크
api.already = function(user_id, class_id, callback) {
    const sql = `select * from user_applylist where user_id=${user_id} and class_id=${class_id}`;
    db.query(sql, (err, rows) => callback(err, rows));
}

// 수강 신청 해제
api.delist = function(user_id, class_id, callback) {
    const sql = `delete from user_applylist where user_id=${user_id} and class_id=${class_id}`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            callback(false);
        } else {
            callback(true);
        }
    })
}

// 모듈 내보내기
module.exports = api;