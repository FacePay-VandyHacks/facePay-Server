"use strict";

let Joi             = require('joi'),
    User            = require('../../models/user'),
    base64Img       = require('base64-img'),
    request         = require('request');


module.exports = app => {
  app.post('/v1/paymentHandle', (req, res) => {
    let username = req.body.username;
    User.findOne({username: username}).then((foundUser) => {
      let customerID = foundUser.account_id;
      request(`http://api.reimaginebanking.com/customers/${customerID}/accounts?key=3dc98b7092849aee4831c2d8a79b4b89`, (err, httpResponse, body) => {
        if(err){
          console.log(err);
        }else{
          console.log(body);
          let payeeAC1 = JSON.parse(body)[0]._id;
          let customerID2 = req.body.acctId;
          let transferRequestData = {
            url: `http://api.reimaginebanking.com/accounts/${customerID2}/transfers?key=3dc98b7092849aee4831c2d8a79b4b89`,
            method: "POST",
            json: true,
            body: {
              "medium": "balance",
              "payee_id": payeeAC1, //payeeAC1,
              "amount": 100.01,
              "transaction_date": "2017-10-22",
              "description": "string"
            }
          }

          request(transferRequestData, (err, httpResponse, finalBody) => {
            if(err){
              console.log(err);
            }else{
              console.log(httpResponse);
              console.log("DONE");
            }
          })
        }
      })
    })
  })
}
