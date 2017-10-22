'use strict';


import React, { Component }     from 'react';
import { Link, withRouter }  from 'react-router-dom';

import md5                      from 'md5';


export class WebCamComp extends Component {
  constructor(props){
    super(props);
    this.currentUser = this.props.currentUser;
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
    //dataUrl= encodeURIComponent(JSON.stringify(dataUrl));
    console.log(dataUrl);
    //dataUrl.replace("+","%2B");


    let uploadData = "";
    if(document.getElementById("amount")){
      let amount = document.getElementById("amount").value
      let bill_username = document.getElementById("billing_username").value
      uploadData = {
        imageUrl:         dataUrl,
        payment_amount:   amount,
        billing_username: bill_username
      }
    }else{
      uploadData = {
        imageUrl:   dataUrl,
        currentUser: this.currentUser
      }
    }
    setTimeout(() => {
      $.ajax({
          url: "/v1/picture",
          method: "post",
          data: uploadData
      }).then(data => {
          console.log(Object.keys(data)[0]);
          console.log("hello world");
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
      <div id="container" className="col-xs-4 col-xs-offset-1">
        <button onClick={this.clickMe} id="webcam-button" className="btn btn-primary fill-width-container">Take snapshot</button>
        <video className="fill-width-container" autoPlay></video>
        <canvas className="fill-width-container"></canvas>
      </div>
    )
  }
}
