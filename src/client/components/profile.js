'use strict';


import React, { Component }             from 'react';
import { Link, withRouter }             from 'react-router-dom';
import { GravHash }                     from './header';

/*************************************************************************/


const Game = ({ game, index }) => {
    let date = new Date(game.start);
    const url = game.active ? `/game/${game.id}` : `/results/${game.id}`;
    return <tr key={index}>
        <th><Link to={url}>{game.active ? "Active" : "Complete"}</Link></th>
        <th>{date.toLocaleString()}</th>
        <th>{game.moves}</th>
        <th>{game.score}</th>
        <th>{game.game}</th>
    </tr>;
};

class Profile extends Component {
    constructor(props) {
        super(props);
        this.onClickViewPictures = this.onClickViewPictures.bind(this);
        this.onClickTakePicture = this.onClickTakePicture.bind(this);
        this.state = {
            user: {
                primary_email: "",
                games: []
            }
        }
    }

    fetchUser(username) {
        $.ajax({
            url: `/v1/user/${username}`,
            method: "get"
        })
            .then(data => {
                this.setState({ user: data });
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
    }

    componentDidMount() {
        this.fetchUser(this.props.match.params.username);
    }

    componentWillReceiveProps(nextProps) {
        this.fetchUser(nextProps.match.params.username);
    }

    onClickViewPictures() {
        const { username } = this.props.user.getUser();
        this.props.history.push(`/viewPictures/${this.state.user.username}`);
    }

    onClickTakePicture() {
        const { username } = this.props.user.getUser();
        this.props.history.push(`/takePicture/${this.state.user.username}`);
    }

    render() {
        // Is the logged in user viewing their own profile
        const isUser = this.props.match.params.username === this.props.user.getUser().username;
        // Build array of games
        let games = this.state.user.games.map((game, index) => (
            <Game key={index} game={game} index={index}/>
        ));
        return <div className="row">
            <div className="center-block">
                <p id="errorMsg" className="bg-danger"/>
            </div>
            <div className="col-xs-offset-4 col-xs-4 profileButtons">
              <h1>Hello {this.state.user.first_name}</h1>
            </div>
            <div className="col-xs-offset-4 col-xs-4 profileButtons">
              <button type="button" className="btn btn-primary" onClick={this.onClickViewPictures}>View Pictures</button>
            </div>
            <div className="col-xs-offset-4 col-xs-4 profileButtons">
              <button type="button" className="btn btn-primary">View Accounts</button>
            </div>
            <div className="col-xs-offset-4 col-xs-4 profileButtons">
              <button type="button" className="btn btn-primary" onClick={this.onClickTakePicture}>Add Pictures</button>
            </div>
            <div className="col-xs-offset-4 col-xs-4 profileButtons">
              <button type="button" className="btn btn-primary">Add Accounts</button>
            </div>
            <div className="col-xs-offset-4 col-xs-4 profileButtons">
              <button type="button" className="btn btn-primary">Request Payment</button>
            </div>
            <div className="col-xs-offset-4 col-xs-4 profileButtons">
              <button type="button" className="btn btn-primary">Confirm Payment</button>
            </div>
        </div>;
    }
}

export default withRouter(Profile);
