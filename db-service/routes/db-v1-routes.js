/**
 * @name db-v1-api
 * @description This module packages the Db API.
 */
'use strict';

const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();
const express = hydraExpress.getExpress();
const ServerResponse = require('fwsp-server-response');

const db = hydraExpress.getExpressApp().get('db');
const ObjectID = require('mongodb').ObjectID;

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
        db.collection('users').find().toArray().then(users => res.sendOk(users)).catch(e => res.sendError(e));
    });
api.get('/:id',
    (req, res) => {
        if (!ObjectID.isValid(req.params.id)) return res.sendError("Invalid ID");
        db.collection('users').findOne({_id: ObjectID(req.params.id)}).then(user => {
            if (!user) {
                res.sendError("User not found");
            } else {
                res.sendOk(user);
            }
        }).catch(e => res.sendError(e));
    });
api.post('/',
    (req, res) => {
        db.collection('users').insertOne(req.body).then(data => res.sendOk({_id: data.insertedId}))
            .catch(e => res.sendError(e));
    });
api.put('/:id',
    (req, res) => {
        if (!ObjectID.isValid(req.params.id)) return res.sendError("Invalid ID");
        db.collection('users').findOneAndUpdate({
            _id: ObjectID(req.params.id)
        }, {
            $set: req.body
        }).then(r => res.sendOk(r.value)).catch(e => res.sendError(e));
    });
api.delete('/:id',
    (req, res) => {
        if (!ObjectID.isValid(req.params.id)) return res.sendError("Invalid ID");
        db.collection('users').findOneAndDelete({
            _id: ObjectID(req.params.id)
        }).then(() => res.sendOk({})).catch(e => res.sendError(e));
    });

module.exports = api;
