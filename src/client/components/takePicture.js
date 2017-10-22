'use strict';


import React, { Component }     from 'react';
import { Link, withRouter }     from 'react-router-dom';

import md5                      from 'md5';

import { WebCamComp }           from './webCamComp';

/*************************************************************************/

class TakePicture extends Component {
  constructor(props){
    super(props);
    this.currentUser = this.props.user.getUser();
  }

  render(){
    return(
      <div>
        <div className="row">
            <h1 className="col-xs-offset-2 col-xs-8">{this.props.user.username} TakePicture Here</h1>
        </div>
        <div className="row">
            <div className="col-xs-offset-1 col-xs-8">
              <WebCamComp currentUser={this.currentUser.username}/>
            </div>
        </div>
      </div>
    )
  }
}

export default TakePicture;
