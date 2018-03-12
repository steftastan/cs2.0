import './../global.config.env.js';
import $ from 'jquery';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { BreadCrumbs } from './../components/layout/breadcrumbs.js';
import { Localization, HandleWebFacingLink, HandlePopupLink, HandleRegularLink} from './../global.helpers.js';


/** DASHBOARD
 * This is is the generic dashboard used for all the category pages in Common Sense.
 */

export class Dashboard extends Component {

    constructor(props) {
      super(props);
      this.Localization = Localization;
      this.HandleWebFacingLink = HandleWebFacingLink;
      this.HandlePopupLink = HandlePopupLink;
      this.HandleRegularLink = HandleRegularLink;
      this.state = {
          data: [],
          categoryName: '',
          dashboardSubLinks: [],
          breadcrumbs: []
      }
    }

    componentDidMount() {
        $.ajax({
            url: global.endpoints[global.env].ACCORDION,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data.results});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    };

    componentDidUpdate(prevProps, prevState) {

        const {match} = this.props;
        const id = match.params.code || this.props.code;
        var crumbs = {};

        if (prevState.data !== this.state.data) {
            for (var i = 0; i < this.state.data.length; i++) {
                if (id == this.state.data[i].code) {

                    /**
                     * Build breadcrumb object
                     * Don't build a breadcrumb for the Personal Preference Dashboard
                     */
                    crumbs = {name: this.state.data[i].name, code: this.state.data[i].code, isPage: false};

                    this.setState({
                        dashboardLinks : this.state.data[i].sublinks,
                        categoryName : this.state.data[i].name,
                        breadcrumbs : crumbs
                    });
                }
            }
        }
    }

    render() {
        var categoryName__text = (this.state.categoryName ? this.Localization(this.state.categoryName, this.props.language) : '');
        var breadcrumbs = (this.state.breadcrumbs ? this.state.breadcrumbs : '');
        var linkOnClick = {};

        if (this.state.dashboardLinks && this.state.dashboardLinks.length) {
            var dashboardLinks = this.state.dashboardLinks.map(function(item, key) {

                if (item.url.indexOf("GatewayServlet") !== -1) {
                    linkOnClick = this.HandleWebFacingLink.bind(this, item.url);
                }
                else if (item.url.indexOf("popup") !== -1) {
                    linkOnClick = this.HandlePopupLink.bind(this, item.url);
                }
                else {
                    linkOnClick = this.HandleRegularLink.bind(this, item.url);
                }

                return (
                    <a key={key} className="category__item col-xs-12 col-lg-4" onClick={linkOnClick}>
                        <article className={"category " + item.color}>
                            <span className={"category__icon--desktop icon-" + item.icon + "_32 " + item.color}></span>
                            <span className={"category__icon " + item.icon}></span>
                            <div className="category__text">
                                <span className="category__name">{categoryName__text}</span>
                                <h4 className="category__link">{item.name}</h4>
                            </div>
                        </article>
                    </a>
                );
            }, this);
        }

        return (
            <div>
                <BreadCrumbs breadcrumbs={this.state.breadcrumbs} language={this.props.language} />
                <div className="container-fluid wrapper__content--categoryGrid">
                    {dashboardLinks}
                </div>
            </div>
        );
    }
}

export default Dashboard;
