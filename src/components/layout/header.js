import React, { Component } from 'react';

export class Header extends Component {

    constructor(props) {
      super(props);
      this.toolBox = [];
      this.widgets = [];
      this.data = [];
      this.state = {
          widgets: [],
          loaded: false
      };
    }

    render() {
        var defaultCompanyName = (this.props.defaultCompanyName ? this.props.defaultCompanyName : '');
        var commonSense = (this.props.defaultCompanyName ? 'CommonSense 2.0' : '');

        return (
            <header id="header" className="wrapper header">
                <div className="grid__item grid__item--header header__logo">
                    <img className="header__logo--img"
                        style={this.state.loaded ? {} : {display: 'none'}}
                        onLoad={() => this.setState({loaded: true})}
                        onError={() => this.setState({loaded: false})}
                        src={this.props.defaultCompanyIcon} />
                </div>
                <div className="grid__item grid__item--header header__companyName">
                    <h1 className="header__mainTitle">{defaultCompanyName}</h1>
                    <h2 className="header__subTitle">{commonSense}</h2>
                </div>
            </header>
        );
    }
}
