'use strict';


import React, { Component }     from 'react';
import { Link, withRouter }  from 'react-router-dom';

import md5                      from 'md5';

/*************************************************************************/
class WebCamComp extends Component {
  constructor(props){
    super(props);
    this.video = '';
    this.canvas = '';
    this.button = '';
    this.clickMe = this.clickMe.bind(this);
  }

  clickMe() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    let dataUrl = canvas.toDataURL("img/png");
    console.log(dataUrl);
    //console.log("Here");
    //dataUrl = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
    setTimeout(() => {
      $.ajax({
          url: "/v1/picture",
          method: "post",
          data: dataUrl
      }).then(data => {
          console.log(data);
      })
      .fail(err => {
          let errorEl = document.getElementById('errorMsg');
          errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
      });
    }, 2000);


  };


  componentDidMount() {
      this.video = document.querySelector('video');
      this.canvas = window.canvas = document.getElementsByTagName('canvas')[0];
        this.canvas.width = '100%';
        this.canvas.height = 180;
      this.button = document.getElementById('webcam-button');
      let constraints = {
        audio: false,
        video: true
      };
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
          window.stream = stream; // make stream available to browser console
          this.video.srcObject = stream;
        }).catch((err) => {
          console.log('navigator.getUserMedia error: ', err);
        });
  }


  render(){
    return(
      <div id="container" className="col-xs-4 col-xs-offset-3">
        <video autoPlay></video>
        <button onClick={this.clickMe} id="webcam-button" className="btn btn-primary">Take snapshot</button>
        <canvas></canvas>
      </div>
    )
  }
}


class TakePicture extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>
        <div className="row">
            <h1 className="col-xs-offset-2 col-xs-8">{this.props.user.username} TakePicture Here</h1>
        </div>
        <div className="row">
            <div className="col-xs-offset-1 col-xs-8">
              <WebCamComp/>
            </div>
        </div>
      </div>
    )
  }
}

export default TakePicture;
