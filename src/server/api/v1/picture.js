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
               url: "https://api.kairos.com/enroll",
               method: 'POST',
               headers: headers,
               form: JSON.stringify({
                   "image":req.body.imageUrl,
                   "gallery_name":"gallery1",
                   "subject_id": req.body.currentUser
               })
           };


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
