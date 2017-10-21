'use strict';

let kairosTrialFunction = () => {

}

var Kairos = require('kairos-api');
var client = new Kairos('0576e4d2', '7a6536f9999c8571429e4819dd7b7732');

var params = {
  image: 'http://media.kairos.com/kairos-elizabeth.jpg',
  subject_id: 'subtest1',
  gallery_name: 'gallerytest1',
  selector: 'SETPOSE'
};

client.enroll(params)   // return Promise
  //  result: {
  //    status: <http status code>,
  //    body: <data>
  //  }
  .then(function(result) { ... })
  // err -> array: jsonschema validate errors
  //        or throw Error
  .catch(function(err) { ... });
