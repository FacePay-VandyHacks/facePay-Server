"use strict";

let Joi             = require('joi'),
    User            = require('../../models/user');


module.exports = app => {

    /*
     * Log a user in
     *
     * @param {req.body.username} Username of user trying to log in
     * @param {req.body.password} Password of user trying to log in
     * @return { 200, {username, primary_email} }
     */
    app.post('/v1/session', (req, res) => {
      console.log(req.body.username);
      User.findOne({username: req.body.username}).then((foundUser) => {
        if(foundUser){
          console.log(foundUser);
          let passwordTest = foundUser.authenticate(req.body.password);
          console.log(passwordTest);
          if(foundUser.authenticate(req.body.password)){
            res.status(200).send({
              username:       foundUser.username,
              primary_email:  foundUser.primary_email
            })
          }else{
            res.status(400).send({ error: "Could not recognize password" });
          }
        }else{
          res.status(400).send({ error: "Could not recognize username" });
        }

      });
    });

    /*
     * Log a user out
     *
     * @return { 204 if was logged in, 200 if no user in session }
     */
    app.delete('/v1/session', (req, res) => {

    });

};
