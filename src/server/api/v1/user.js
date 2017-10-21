"use strict";

let Joi             = require('joi'),
    User            = require('../../models/user'),
    AWS             = require('aws-sdk'),
    fs              = require('file-system');

let Kairos = require('kairos-api');
let client = new Kairos('54da78a1', '0b1f1e9737f5f34e0d6df1702ccd573c');
AWS.config.loadFromPath('/Users/bbroderick/Desktop/Web_Apps/facePay/src/server/api/v1/config.json');
let s3 = new AWS.S3();

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
          let demoImage = encodeURIComponent("/Users/bbroderick/Desktop/Web_Apps/facePay/src/server/api/v1/IMG_9062.JPG.jpeg");
          let imageData = fs.readFileSync('/Users/bbroderick/Desktop/Web_Apps/facePay/src/server/api/v1/IMG_9062.JPG.jpeg');
          let params3 = {
            Bucket: "facepaydemobucket1234567890",
            Key: demoImage,
            Body: imageData,
            ACL: "public-read"
          }
          s3.putObject(params3, (err, data) => {
            if(err){
              console.log(err);
            }else{
              console.log(data);
            }
          })


          //Kairos Trials
          let params = {
            image: 'https://s3.amazonaws.com/facepayvh4/BrendanComps/IMG_9062.JPG.jpeg',
            subject_id: req.body.username,
            gallery_name: 'gallerytest1',
            selector: 'SETPOSE'
          };

          let params1 = {
            image: 'http://media.kairos.com/kairos-elizabeth.jpg',
            gallery_name: 'gallerytest1',
          };

          client.enroll(params)   // return Promise
            //  result: {
            //    status: <http status code>,
            //    body: <data>
            //  }
            .then((result) => {
              console.log("result");
            })
            // err -> array: jsonschema validate errors
            //        or throw Error
            .catch(function(err) { console.log("enroll fail") });

            client.recognize(params1).then((result) => {
              console.log("Recognize:");
              console.log(result.body.images[0].transaction.subject_id);
            })

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
