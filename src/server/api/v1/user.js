"use strict";

let Joi             = require('joi'),
    User            = require('../../models/user');


module.exports = (app) => {

    /*
     * Create a new user
     *
     * @param {req.body.username} Display name of the new user
     * @param {req.body.first_name} First name of the user - optional
     * @param {req.body.last_name} Last name of the user - optional
     * @param {req.body.city} City user lives in - optional
     * @param {req.body.primary_email} Email address of the user
     * @param {req.body.password} Password for the user
     * @return {201, {username,primary_email}} Return username and others
     */
    app.post('/v1/user', function(req, res) {
      let data = req.body;
      if (!data ||
            !data.username ||
            !data.password ||
            !data.first_name ||
            !data.last_name ||
            !data.city ||
            !data.primary_email) {
            res.status(400).send({ error: 'username, password, first_name, last_name, city and primary_email required' });
        } else {
          User.create({
            'username':       data.username,
            'password':       data.password,      //password will trigger the virtual password function
            'primary_email':  data.primary_email,
            'first_name':     data.first_name,
            'last_name':      data.last_name,
            'city':           data.city,
            'games':          []
          }).then((newUser) => {
            res.status(201).send({
                username:       newUser.username,
                primary_email:  newUser.primary_email
            });
          }).catch((err) => {
            console.log(JSON.stringify(err));
            res.status(400).send({ error: err._message });
          })
        }
    });

    /*
     * See if user exists
     *
     * @param {req.params.username} Username of the user to query for
     * @return {200 || 404}
     */
    app.head('/v1/user/:username', (req, res) => {
    });

    /*
     * Fetch user information
     *
     * @param {req.params.username} Username of the user to query for
     * @return {200, {username, primary_email, first_name, last_name, city, games[...]}}
     */
    app.get('/v1/user/:username', (req, res) => {
      User.findOne({username: req.params.username}).then((foundUser) => {
        if(foundUser){
          console.log(foundUser);
            res.status(200).send({
              username:       foundUser.username,
              primary_email:  foundUser.primary_email,
              first_name:     foundUser.first_name,
              last_name:      foundUser.last_name,
              city:           foundUser.city,
              games:          foundUser.games
            })
        }else{
          res.status(400).send({ error: "Could not find user" });
        }
      });
    });

    /*
     * Update a user's profile information
     *
     * @param {req.body.first_name} First name of the user - optional
     * @param {req.body.last_name} Last name of the user - optional
     * @param {req.body.city} City user lives in - optional
     * @return {204, no body content} Return status only
     */
    app.put('/v1/user', (req, res) => {

    });

};
