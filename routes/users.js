const express = require('express');
const Bcrypt = require('bcryptjs');
const User = require('../models/user');
const usersResponse = require('../responses/users');
const router = express.Router();

router.get('/', (req, res) => {
    User.find()
        .then(data => {
            usersResponse({
                status: true,
                db: data
            }, res);
        })
        .catch(err => {
            usersResponse({
                errors: err,
            }, res);
        });
});

router.get('/:userId', (req, res) => {
    User.findById(req.params.userId)
        .then(data => {
            usersResponse({
                status: true,
                db: data
            }, res);
        })
        .catch(err => {
            usersResponse({
                errors: err
            }, res);
        });
});

router.post('/register', (req, res) => {
    new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    })
        .save()
        .then(data => {
            usersResponse({
                status: true,
                db: data
            }, res);
        })
        .catch(err => {
            usersResponse({
                errors: ('errors' in err) ? err['errors'] : err
            }, res);
        });
});

router.post("/login", async (req, res) => {
    User.findOne({
        username: req.body.username
    })
        .then(data => {
            if (!data) {
                usersResponse({
                    errors: {
                        username: {
                            message: 'The username does not exist'
                        }
                    }
                }, res);
            } else {
                if (!Bcrypt.compareSync(req.body.password, data.password)) {
                    usersResponse({
                        errors: {
                            password: {
                                message: 'The password is invalid'
                            }
                        }
                    }, res);
                } else {
                    usersResponse({
                        status: true,
                        db: data
                    }, res);
                }
            }
        })
        .catch(err => {
            usersResponse({
                errors: ('errors' in err) ? err['errors'] : err
            }, res);
        });
});

router.patch('/:userId', (req, res) => {
    User.updateOne(
        { _id: req.params.userId },
        {
            $set: {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                modified: Date.now()
            }
        },
        { runValidators: true }
    )
        .then(data => {
            usersResponse({
                status: true,
                db: data
            }, res);
        })
        .catch(err => {
            usersResponse({
                errors: ('errors' in err) ? err['errors'] : err
            }, res);
        });
});

router.delete('/:userId', (req, res) => {
    User.remove({ _id: req.params.userId })
        .then(data => {
            usersResponse({
                status: true,
                db: data
            }, res);
        })
        .catch(err => {
            usersResponse({
                errors: ('errors' in err) ? err['errors'] : err
            }, res);
        });
});

module.exports = router;