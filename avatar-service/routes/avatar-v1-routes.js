/**
 * @name avatar-v1-api
 * @description This module packages the Avatar API.
 */
'use strict';

const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();
const express = hydraExpress.getExpress();
const ServerResponse = require('fwsp-server-response');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const User = require('../User');
const {UserImage, TYPE_AVATAR, TYPE_COVER, UPLOAD_PATH} = require('../UserImage');

const {createCanvas, loadImage} = require('canvas');

hydraExpress.getExpressApp().use(fileUpload());

let serverResponse = new ServerResponse();
express.response.sendError = function (err) {
    serverResponse.sendServerError(this, {result: {error: err}});
};
express.response.sendOk = function (result) {
    serverResponse.sendOk(this, {result});
};

let api = express.Router();

api.get('/:user_id',
    (req, res) => {

        User.findOne(req.params.user_id).then(user => {

            let cover = `${UPLOAD_PATH}/${user.cover_image}`;
            let avatar = `${UPLOAD_PATH}/${user.avatar}`;

            if (!fs.existsSync(cover)) return Promise.reject("Cover image has't been set yet");
            if (!fs.existsSync(avatar)) return Promise.reject("Avatar image has't been set yet");

            return Promise.all([loadImage(cover), loadImage(avatar)]);
        }).then(([cover, avatar]) => {

            let canvas = createCanvas(cover.width, cover.height);
            let ctx = canvas.getContext('2d');

            ctx.drawImage(cover, 0, 0, cover.width, cover.height);
            ctx.drawImage(avatar, 50, 50, avatar.width, avatar.height);

            res.setHeader("Content-Type", 'image/jpeg');
            canvas.jpegStream().pipe(res);

        }).catch(e => {
            res.sendError(e);
        });
    });

api.post('/cover/:user_id',
    (req, res) => {

        let file = req.files ? req.files.cover_image : null;
        if (file) {

            let Image = new UserImage(file, TYPE_COVER, req.params.user_id);

            Image.validate().then(() => {
                return User.findOne(req.params.user_id);
            }).then((user) => {
                return Image.upload().then((imageName) => {
                    return user.load({cover_image: imageName}).update();
                });
            }).then(() => {
                res.sendOk({});
            }).catch(e => {
                res.sendError(e);
            });

        } else {
            res.sendError("Cover Image is required");
        }
    });

api.post('/avatar/:user_id',
    (req, res) => {
        let file = req.files ? req.files.avatar : null;
        if (file) {

            let Image = new UserImage(file, TYPE_AVATAR, req.params.user_id);

            Image.validate().then(() => {
                return User.findOne(req.params.user_id);
            }).then(user => {
                return Image.upload().then((imageName) => {
                    return user.load({avatar: imageName}).update();
                });
            }).then(() => {
                res.sendOk({});
            }).catch(e => {
                res.sendError(e);
            });

        } else {
            res.sendError("Avatar is required");
        }
    });

module.exports = api;
