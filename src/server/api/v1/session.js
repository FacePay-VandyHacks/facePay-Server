/* Copyright G. Hemingway @2017 - All rights reserved */
"use strict";

let Joi             = require('joi');


module.exports = app => {

    /*
     * Log a user in
     *
     * @param {req.body.username} Username of user trying to log in
     * @param {req.body.password} Password of user trying to log in
     * @return { 200, {username, primary_email} }
     */
    app.post('/v1/session', (req, res) => {
    });

    /*
     * Log a user out
     *
     * @return { 204 if was logged in, 200 if no user in session }
     */
    app.delete('/v1/session', (req, res) => {
    });

};
