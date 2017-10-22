"use strict";

let Joi             = require('joi'),
    User            = require('../../models/user'),
    base64Img       = require('base64-img');


module.exports = app => {

    app.post('/v1/picture', (req, res) => {
      if(req.body){

        //console.log(req.body);
        //console.log(Object.keys(req.body)[0]);

        let imageData= Object.keys(req.body)[0];
        imageData=imageData.substring(1,imageData.length-1);



        /**
        imageData.replace(" ","+");
        imageData.replace("{","");
        imageData.replace("}","");
        imageData.replace(`\"`,``);
        imageData.replace(`\t`,``);
        */

        let base64Data = imageData;
        require("fs").writeFile("out3.txt", imageData, function(err) {
          //console.log(err);
        });
        console.log("We Hit Picture Post");
        base64Img.img(imageData, '/Users/alexjreed7/Desktop', 'out3', (err, filepath) => {
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
