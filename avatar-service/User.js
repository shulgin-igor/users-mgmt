const validate = require('validate.js');
const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();
const Message = require('./Message');

const BASE_URL = '/v1/users';

module.exports = class User {
    constructor(data) {
        this.load(data);
    }

    /**
     * Getter for list of validation rules
     * @returns Object
     */
    get rules() {
        return {
            first_name: {
                presence: true
            },
            last_name: {
                presence: true
            },
            email: {
                presence: true,
                email: true
            }
        };
    }

    /**
     * Getter for list of DB properties of User class
     * @returns Object
     */
    get fields() {
        return {
            first_name: this.first_name || null,
            last_name: this.last_name || null,
            email: this.email || null,
            cover_image: this.cover_image || null,
            avatar: this.avatar || null,
        };
    }

    /**
     * Finds user in DB by id and returns User object with loaded fields
     * @param id
     * @returns Promise
     */
    static findOne(id) {
        if (!id) return Promise.reject("ID is required");
        return hydra.makeAPIRequest(new Message(`db-service:[get]${BASE_URL}/${id}`, {})).then(response => {
            if (response.statusCode == 200) {
                return new User(response.result);
            } else {
                return Promise.reject(response.result);
            }
        });
    }

    /**
     * Assigns new user data
     * @param data
     * @returns {module.User}
     */
    load(data) {
        Object.assign(this, data || {});
        return this;
    }

    validate() {
        return validate(this, this.rules);
    }

    create() {
        return hydra.makeAPIRequest(new Message(`db-service:[post]${BASE_URL}`, this.fields));
    }

    update() {
        if (!this._id) return Promise.reject('User has not been initialized');
        return hydra.makeAPIRequest(new Message(`db-service:[put]${BASE_URL}/${this._id}`, this.fields)).then(() => {
            return this;
        });
    }

    delete() {
        if (!this._id) return Promise.reject('User has not been initialized');
        return hydra.makeAPIRequest(new Message(`db-service:[delete]${BASE_URL}/${this._id}`, {}));
    }
};