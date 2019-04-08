/**
 * @name users-v1-api
 * @description This module packages the Users API.
 */
'use strict';

const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();
const express = hydraExpress.getExpress();
const ServerResponse = require('fwsp-server-response');
const User = require('../User');

let serverResponse = new ServerResponse();
express.response.sendError = function (err) {
    serverResponse.sendServerError(this, {result: {error: err}});
};
express.response.sendOk = function (result) {
    serverResponse.sendOk(this, {result});
};

let api = express.Router();

api.get('/',
    (req, res) => {
        User.findAll().then(users => res.sendOk(users)).catch(e => res.sendError(e));
    });
api.get('/:id',
    (req, res) => {
        User.findOne(req.params.id).then(user => {
            res.sendOk(user);
        }).catch(e => {
            res.sendError(e);
        });
    });
api.post('/',
    (req, res) => {

        let u = new User(req.body);
        let errors = u.validate();

        if (!errors) {
            u.create().then((user) => {
                res.sendOk(user);
            }).catch(e => {
                res.sendError(e);
            })
        } else {
            res.sendError(errors);
        }

    });
api.put('/:id',
    (req, res) => {
        User.findOne(req.params.id).then(user => {
            user.load(req.body);
            let errors = user.validate();
            if (!errors) {
                return user.update();
            } else {
                return Promise.reject(errors);
            }
        }).then(user => {
            res.sendOk(user);
        }).catch(e => {
            res.sendError(e);
        });
    });
api.delete('/:id',
    (req, res) => {

        User.findOne(req.params.id).then(user => {
            return user.delete();
        }).then(() => {
            res.sendOk({});
        }).catch(e => {
            res.sendError(e);
        });

    });

module.exports = api;
