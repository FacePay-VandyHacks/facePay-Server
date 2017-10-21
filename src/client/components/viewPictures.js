'use strict';


import React, { Component }     from 'react';
import { Link, withRouter }  from 'react-router-dom';

import md5                      from 'md5';

/*************************************************************************/

class ViewPictures extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>
        <div className="row">
            <h1>{this.props.user.username} Photos</h1>
        </div>
      </div>
    )
  }
}

export default ViewPictures;
