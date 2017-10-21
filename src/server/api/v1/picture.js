"use strict";

let Joi             = require('joi'),
    User            = require('../../models/user');


module.exports = app => {

    app.post('/v1/picture', (req, res) => {
      if(req.body){
        let haha= JSON.stringify(req.body);
        //haha = haha.substring(0, 1000);
        console.log(haha);

        console.log("We Hit Picture Post");
        let base64Data = haha.replace(/^data:image\/png;base64,/, "");
        require("fs").writeFile("out.txt", haha, function(err) {
          console.log(err);
        });
        res.status(200).send({body: req.body})
      }else{
        res.status(400).send({ error: "Could not recognize password" });
      }
    });
};
