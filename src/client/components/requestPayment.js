'use strict';


import React, { Component }     from 'react';
import { Link, withRouter }     from 'react-router-dom';

import md5                      from 'md5';
import { WebCamComp }           from './webCamComp';

class RequestPayment extends Component {
  constructor(props){
    super(props);
    this.user = '';
  }

  componentDidMount(){
    this.user = this.props.user
  }


  render(){
    console.log(this.props.user)
    return(
      <div>
        <div className="col-xs-4">
          <div className="form-group">
              <label className="col-sm-2 control-label" htmlFor="amount">Payment Amount:</label>
              <div className="col-sm-12">
                <input className="form-control" id="amount" type="text" placeholder="Payment Amount"/>
              </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="username">Billing Username:</label>
            <div className="col-sm-12">
                <input className="form-control" id="billing_username" type="text" placeholder="Billing Username"/>
              </div>
          </div>
        </div>
        <WebCamComp/>
      </div>
    )
  }
}




export default RequestPayment;
