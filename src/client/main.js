"use strict";

// Necessary modules
import React, { Component }     from 'react';
import { render }               from 'react-dom';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import Header                   from './components/header';
import Landing                  from './components/landing';
import Login                    from './components/login';
import Logout                   from './components/logout';
import Register                 from './components/register';
import Profile                  from './components/profile';
import Start                    from './components/start';
import Results                  from './components/results';
import ViewPictures             from './components/viewPictures';
import TakePicture              from './components/takePicture';
import RequestPayment           from './components/requestPayment';

// Bring app CSS into the picture
require('./app.css');

/*************************************************************************/

class MyApp extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <BrowserRouter>
            <div>
                <Route exact path="/" component={Landing}/>
                <Route path="/login" render={() => {
                    return this.props.user.loggedIn() ?
                        <Redirect to={`/profile/${this.props.user.username()}`}/> :
                        <div>
                          <Header user={this.props.user}/>
                          <Login user={this.props.user}/>
                        </div>

                }}/>
                <Route path="/register" render={() => {
                    return this.props.user.loggedIn() ?
                        <Redirect to={`/profile/${this.props.user.username()}`}/> :
                        <div>
                          <Register/>;
                        </div>
                }}/>
                <Route path="/logout" render={props => <Logout user={this.props.user}/>}/>
                <Route path="/profile/:username" render={props => <div>
                          <Header user={this.props.user}/>
                          <Profile user={this.props.user}/>
                      </div>}/>
                <Route path="/start" render={() => {
                    return this.props.user.loggedIn() ?
                        <Start/> :
                        <Redirect to={'/login'}/>;
                }}/>
              <Route path="/results/:id" render={props => <div>
                      <Header user={this.props.user}/>
                      <Results user={this.props.user}/>
                    </div>}/>
                <Route path="/viewPictures/:id" render={props => <div>
                      <Header user={this.props.user}/>
                      <ViewPictures user={this.props.user}/>
                  </div>}/>
                <Route path="/takePicture/:id" render={props => <div>
                    <Header user={this.props.user}/>
                    <TakePicture user={this.props.user}/>
                  </div>}/>
                <Route path="/requestPayment/:id" render={props => <div>
                    <Header user={this.props.user}/>
                    <requestPayment user={this.props.user}/>
                  </div>}/>
            </div>
        </BrowserRouter>;
    }
}


class User {
    constructor() {
        // See if user is in localStorage
        const data = sessionStorage.getItem('user');
        this.data = data ? JSON.parse(data) : {
            username: "",
            primary_email: ""
        };
    }

    loggedIn() {
        return this.data.username && this.data.primary_email;
    }

    username() {
        return this.data.username;
    }

    logIn(router, data) {
        // Store locally
        this.data = data;
        // Store into localStorage
        sessionStorage.setItem('user', JSON.stringify(data));
        // Go to user profile
        router.push(`/profile/${data.username}`);
    }

    logOut(router) {
        // Remove user info
        this.data = {
            username: "",
            primary_email: ""
        };
        // Wipe localStorage
        sessionStorage.removeItem('user');
        // Go to login page
        router.push('/login');
    }

    getUser() {
        return this.data;
    }
}
let user = new User();

render(
    <MyApp user={user}/>,
    document.getElementById('mainDiv')
);
