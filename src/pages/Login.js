import { Localization } from './../global.helpers.js';
import React, { Component } from 'react';

/** LOGIN SCREEN */

export class Login extends Component {

    constructor(props) {
      super(props);
    }

    render() {
        return (
            <div>
                <div className="container-fluid wrapper__content--login">
                    <h2 className="login__title">Login to continue</h2>
                    <form>
                        <input name="username" className="login__input" type="text" placeholder="Username"/>
                        <input name="password" className="login__input" type="password" placeholder="Password"/>
                        <input name="submit" className="login__submit" type="submit" value="Log in"/>
                        <span className="login__rememberMe">
                            <input className="login__remember--checkbox" type="checkbox" checked data-toggle="toggle"/>
                            <span className="login__remember--text">Remember me</span>
                        </span>
                        <a className="login__pwChange" href="/change-password">Change password</a>
                    </form>
                </div>
            </div>
        );
    }
}
