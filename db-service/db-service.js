/**
* @name Db
* @summary Db Hydra Express service entry point
* @description Working with DB
*/
'use strict';

const version = require('./package.json').version;
const hydraExpress = require('hydra-express');

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://mongo:27017';

const dbName = 'mgmt_users';

let app = hydraExpress.getExpressApp();
let client;

(async () => {
    try {
        client = await MongoClient.connect(url, {useNewUrlParser: true});
        app.set('db', client.db(dbName));
    } catch (e) {
        console.error(e)
    }
})();

let config = require('fwsp-config');

/**
* Load configuration file and initialize hydraExpress app
*/
config.init('./config/config.json')
  .then(() => {
    config.version = version;
    return hydraExpress.init(config.getObject(), version, () => {
      hydraExpress.registerRoutes({
        '/v1/users': require('./routes/db-v1-routes')
      });
    });
  })
  .then(serviceInfo => console.log('serviceInfo', serviceInfo))
  .catch(err => console.log('err', err));
