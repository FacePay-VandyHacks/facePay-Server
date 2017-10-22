"use strict";

let Joi             = require('joi'),
    User            = require('../../models/user'),
    AWS             = require('aws-sdk'),
    fs              = require('file-system'),
    request         = require('request');

let Kairos = require('kairos-api');
let client = new Kairos('54da78a1', '0b1f1e9737f5f34e0d6df1702ccd573c');
AWS.config.loadFromPath('/Users/bbroderick/Desktop/Web_Apps/facePay/src/server/api/v1/config.json');
let s3 = new AWS.S3();//

//let s3 = new AWS.S3();



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
          let options={
              url: `http://api.reimaginebanking.com/customers?key=3dc98b7092849aee4831c2d8a79b4b89`,
              method: 'POST',
              json: true,
              body: {
                "first_name": data.first_name,
                "last_name": data.last_name,
                "address": {
                  "street_number": "string",
                  "street_name": "string",
                  "city": data.city,
                  "state": "tn",
                  "zip": "80401"
                }
              }
            }

          let newCustomerID = '';
          request(options, (err, httpResponse, body) => {
            if(err){
              console.log(err);
            }else{
              newCustomerID = body.objectCreated._id;
              console.log("My new Customer ID:");
              console.log(newCustomerID);
              let newAccountParams = {
                url: `http://api.reimaginebanking.com/customers/${body.objectCreated._id}/accounts?key=3dc98b7092849aee4831c2d8a79b4b89`,
                method: 'POST',
                json: true,
                body: {
                  "type": "Credit Card",
                  "nickname": "string",
                  "rewards": 1000,
                  "balance": 1000,
                  "account_number": "2343556789123455"
                }
              }
              request(newAccountParams, (err, httpResponse, body) => {
                if(err){
                  console.log(err)
                }else{
                  console.log("MY NEW ACCOUNT:");
                  console.log(body);
                  console.log("MY BALANCE:");
                  console.log(body.objectCreated.balance);
                  let personalBalance = body.objectCreated.balance;
                  User.create({
                    'username':       data.username,
                    'password':       data.password,      //password will trigger the virtual password function
                    'primary_email':  data.primary_email,
                    'account_id':     newCustomerID,
                    'first_name':     data.first_name,
                    'last_name':      data.last_name,
                    'city':           data.city,
                    'games':          []
                  }).then((newUser) => {
                    console.log("MY NEW INFO");
                    console.log(newUser.username);
                    console.log(newUser.account_id);
                    res.status(201).send({
                        username:       newUser.username,
                        primary_email:  newUser.primary_email,
                        account_id:     newUser.account_id,
                        balance:        personalBalance
                    });
                  }).catch((err) => {
                    console.log(JSON.stringify(err));
                    res.status(400).send({ error: err._message });
                  })
                }
              })
            }
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

          let accountIDRequest = {
            url: `http://api.reimaginebanking.com/customers/${foundUser.account_id}/accounts?key=3dc98b7092849aee4831c2d8a79b4b89`,
            method: 'GET',
            json: true
          }
          request(accountIDRequest, (err, httpResponse, body) => {
            if(err){
              console.log(err);
            }else{
              console.log("MY BALANCE");
              console.log(body[0].balance);
              res.status(200).send({
                username:       foundUser.username,
                primary_email:  foundUser.primary_email,
                account_id:     foundUser.account_id,
                first_name:     foundUser.first_name,
                last_name:      foundUser.last_name,
                city:           foundUser.city,
                balance:        body[0].balance
              })
            }
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
