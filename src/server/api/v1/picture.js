"use strict";

let Joi             = require('joi'),
    User            = require('../../models/user'),
    base64Img       = require('base64-img'),
    request         = require('request');


module.exports = app => {

    app.post('/v1/picture', (req, res) => {
      if(req.body){
        if(req.body.payment_amount){
          console.log(req.body.payment_amount);
        }else{

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
