/* Copyright G. Hemingway @2017 - All rights reserved */
"use strict";

let Joi             = require('joi'),
    _               = require('underscore'),
    Solitare        = require('../../solitare');


module.exports = app => {

    /* Create a new game
     *  Supports the start page
     */
    app.post('/v1/game', (req, res) => {
    });

    /* Fetch game information
     *  User must be logged in
     *  Supports both the game and results pages
     */
    app.get('/v1/game/:id', (req, res) => {
    });


    // Provide end-point to request shuffled deck of cards and initial state - for testing
    app.get('/v1/cards/shuffle', (req, res) => {
        res.send(Solitare.shuffleCards(false));
    });
    app.get('/v1/cards/initial', (req, res) => {
        res.send(Solitare.initialState());
    });

};
