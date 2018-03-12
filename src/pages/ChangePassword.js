import { Localization } from './../global.helpers.js';
import React, { Component } from 'react';

/** CHANGE PASSWORD SCREEN */
export class ChangePassword extends Component {

    constructor(props) {
      super(props);
    }

    render() {
        return (
            <div>
                <div className="container-fluid wrapper__content--login">
                    <h2 className="login__title">Update your credentials</h2>
                    <form>
                        <input name="username" className="login__input" type="text" placeholder="Username"/>
                        <input name="password" className="login__input" type="password" placeholder="Old Password"/>
                        <input name="newPassword" className="login__input" type="password" placeholder="New Password"/>
                        <input name="newPassword2" className="login__input" type="password" placeholder="Confirm New Password"/>
                        <input className="login__submit" type="submit" value="Submit"/>
                        <a className="login__pwChange login__pwChange--margin" href="/login">Go back</a>
                    </form>
                </div>
            </div>
        );
    }
}
