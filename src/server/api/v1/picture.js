"use strict";

let Joi             = require('joi'),
    User            = require('../../models/user'),
    base64Img       = require('base64-img'),
    request         = require('request');


module.exports = app => {

    app.post('/v1/picture', (req, res) => {
      if(req.body){
        if(req.body.payment_amount){
          console.log("NEW INFO");
          console.log(req.body.payment_amount);
          console.log(req.body.billing_username);
          console.log(req.body.currentUser);

          var headers = {
               'Content-Type': 'application/json',
               'app_id': '0576e4d2',
               'app_key': '7a6536f9999c8571429e4819dd7b7732'
           };

           var options = {
               url: "https://api.kairos.com/verify",
               method: 'POST',
               headers: headers,
               form: JSON.stringify({
                   "image":req.body.imageUrl,
                   "gallery_name":"gallery1",
                   "subject_id": req.body.billing_username
               })
           };

           request(options, (err, httpResponse, body) => {
             if(err){
               console.log(err);
             }else{
               console.log(JSON.parse(body));
               let returnData = JSON.parse(body).images[0].transaction;
               let confidenceScore = returnData.confidence * 100;
               console.log("Confidence Score");
               console.log(confidenceScore);
               if(confidenceScore > 60){
                 console.log("Payment Amount (line 46)");
                 console.log(req.body.payment_amount);
                 let payer = req.body.billing_username;
                 let payee = req.body.currentUser;
                 let payerAccountID = "";
                 let payeeAccountID = "";
                 let payeeAC1 = '';
                 let payerAC2 = '';
                 console.log("Usernames");
                 console.log(payer);
                 console.log(payee);
                 User.findOne({username: payer}).then((foundPayer) => {
                   payerAccountID= foundPayer.account_id;
                   console.log("payer Account ID");
                   console.log(payerAccountID);
                   User.findOne({username: payee}).then((foundPayee) => {
                     payeeAccountID = foundPayee.account_id;
                     console.log("payee Account ID");
                     console.log(payeeAccountID);
                     request(`http://api.reimaginebanking.com/customers/${payeeAccountID}/accounts?key=3dc98b7092849aee4831c2d8a79b4b89`, (err, httpResponse, body) => {
                       if(err){
                         console.log(err);
                       }
                       payeeAC1 = JSON.parse(body)[0]._id;
                       console.log(body);
                       console.log("PayeeAC1 (account number)");
                       console.log(payeeAC1);
                       request(`http://api.reimaginebanking.com/customers/${payerAccountID}/accounts?key=3dc98b7092849aee4831c2d8a79b4b89`, (err, httpResponse, body2) => {
                         if(err){
                           console.log(err);
                         }
                         console.log("PayerAC2 (account number)");
                         payerAC2 = JSON.parse(body2)[0]._id;
                         console.log(body2);
                         console.log(payerAC2);
                         let transferRequestData = {
                           url: `http://api.reimaginebanking.com/accounts/${payerAC2}/transfers?key=3dc98b7092849aee4831c2d8a79b4b89`,
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


                       })
                     })


                   })
                 })
               }else{
                 console.log("AAAAA");
               }
               //var confidence_score = body.images.transaction.confidence;
               //console.log(confidence_score);
             }
           })
        }else{
          console.log(req.body.currentUser);
          var headers = {
               'Content-Type': 'application/json',
               'app_id': '0576e4d2',
               'app_key': '7a6536f9999c8571429e4819dd7b7732'
           };

           var options = {
               url: "https://api.kairos.com/enroll",
               method: 'POST',
               headers: headers,
               form: JSON.stringify({
                   "image":req.body.imageUrl,
                   "gallery_name":"gallery1",
                   "subject_id": req.body.currentUser
               })
           };
          request(options, (err, httpResponse, body) => {
              if(err){
                console.log(err);
              }else{
                console.log(body);
              }
          })
        }


        let base64Data = req.body.imageUrl;
        require("fs").writeFile("out3.txt", base64Data, function(err) {
          //console.log(err);
        });
        console.log("We Hit Picture Post");
        base64Img.img(base64Data, '/Users/bbroderick/Desktop', 'out4', (err, filepath) => {
          if(err){
            console.log(err);
          }else{
            console.log(filepath);
          }
        });
        res.status(200).send({body: req.body})
      }else{
        res.status(400).send({ error: "Could not recognize password" });
      }
    });
};
