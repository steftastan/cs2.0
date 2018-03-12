import React, { Component } from 'react';
import './../../global.config.env.js';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { Localization, WhichDevice, SetLanguage, HandleWebFacingLink, HandlePopupLink, HandleRegularLink } from './../../global.helpers.js';

/**
 * BREADCRUMBS LAYOUT COMPONENT
 *
 * The breadcrumbs are the horizontal navigation bar that contain the breadcrumb breadcrumb trail
 * of links, as well as the Language Switch, and can also allow room for the links
 * toolbox that comes with most inner pages.
 *
 */
export class BreadCrumbs extends Component {

    constructor(props) {
      super(props);
      this.Localization = Localization;
      this.WhichDevice = WhichDevice;
      this.SetLanguage = SetLanguage;
      this.HandleWebFacingLink = HandleWebFacingLink;
      this.HandlePopupLink = HandlePopupLink;
      this.HandleRegularLink = HandleRegularLink;
      this.toggleNav = this.toggleNav.bind(this);
      this.toggleLayout = this.toggleLayout.bind(this);
      this.clickAnywhereToClose = this.clickAnywhereToClose.bind(this);
      this.stopPropagation = this.stopPropagation.bind(this);
      this.openLang = this.openLang.bind(this);
      this.toggleLang = this.toggleLang.bind(this);
      this.buildCrumbs = this.buildCrumbs.bind(this);
      this.state = {
          open: true,
          selectedLang: this.props.language,
          breadcrumbs: [],
          trail: []
      };
      this.defaultLang = this.props.language;
      this.openClassName = '';
      this.navButtonId = 'navButton';
      this.navButton = {};
      this.navId = 'nav';
      this.nav = {};
      this.toggleClass = 'leftnav--toggle';
      this.langWrapper = {};
      this.langWrapperId = 'langWrapper';
      this.langWrapperOpenClass = 'rightnav__langSelect--open';
      this.langListClass = 'rightnav__lang';
      this.activeClass = 'rightnav__lang--active';
      this.openClass = 'rightnav__lang--open';
      this.selectedClass = 'rightnav__lang--selected';
      this.toolBox;
      this.trail = [];
      this.elemsToToggle = {
          header: 'header',
          breadcrumbs: 'breadcrumbs',
          contentWrapper: 'contentWrapper'
      };
    }

    componentDidUpdate(prevProps, prevState) {
        this.langWrapper.addEventListener('mouseenter', this.openLang, false);
        this.langWrapper.addEventListener('mouseleave', this.openLang, false);
        this.langWrapper.addEventListener('mousedown', this.openLang, false);
    }

    componentWillReceiveProps(nextProps) {
        /** Verify the breadcrumb props received from the parent Component
         * and assign them to this Component's state
         */
        if (nextProps.breadcrumbs) {
            this.setState({
                breadcrumbs : nextProps.breadcrumbs,
                trail: this.buildCrumbs(nextProps.breadcrumbs)
            });
        }
    }

    componentDidMount() {
        var selectedLang;

        this.nav =  document.getElementById(this.navId);
        this.navButton =  document.getElementById(this.navButtonId);
        this.langWrapper = document.getElementById(this.langWrapperId);

        if (this.state.open) {
            this.toggleNav();
        }

        if (this.WhichDevice() === 'mobile') {
            $("#"+this.langWrapperId).appendTo("#langWrapper--mobile")
        }

        /* Add event listeners to the navigation elements */
        if (this.nav && this.navButton) {
            document.addEventListener('mousedown', this.clickAnywhereToClose, false);
            this.nav.addEventListener('mousedown', this.stopPropagation, false);
            this.navButton.addEventListener('mousedown', this.toggleNav, false);
        }

        /* Grab the default language from the global variable and set it.  */
        if (this.langWrapper) {
            selectedLang = document.getElementById(this.props.language); // TODO CHANGE
            this.toggleLang(selectedLang, true, true);
        }
    }

    openLang(event) {
        var languages = document.getElementsByClassName(this.langListClass);
        var clickedLang;
        var i;

        if (event.type === 'mouseenter') {
            for (i = 0; i < languages.length; i++) {
                this.langWrapper.classList.add(this.langWrapperOpenClass);
                this.toggleLang(languages[i], true);
            }
        } else if (event.type === 'mouseleave') {
            for (i = 0; i < languages.length; i++) {
                this.langWrapper.classList.remove(this.langWrapperOpenClass);
                this.toggleLang(languages[i], false);
            }
        } else if (event.type === 'mousedown') {
            this.langWrapper.classList.remove(this.langWrapperOpenClass);
            for (i = 0; i < languages.length; i++) {

                if (languages[i].id === event.target.id) {
                    this.setState({
                        selectedLang: languages[i].id
                    });

                    /* Language is saved to session here */
                    this.SetLanguage(languages[i].id);

                    clickedLang = document.getElementById(languages[i].id);
                    if (!clickedLang.classList.contains(this.selectedClass)) {
                        clickedLang.classList.add(this.selectedClass, this.activeClass, this.openClass);
                        this.toggleLang(languages[i], false);
                    } else {
                        this.toggleLang(languages[i], true);
                    }

                } else {
                    // modify non-clicked languages
                    languages[i].classList.remove(this.selectedClass);
                    this.toggleLang(languages[i], false);
                }
            }
        }
    }

    buildCrumbs(crumb) {
        var trail = [];
        var caret = '';
        var linkOnClick = {};
        var linkToCategory = global.paths[global.env].BUILD_ROUTE+global.paths[global.env].DASHBOARD;

        var crumbs = [{
            name: this.Localization('personalPreferences', this.props.language),
            code: 7,
            url: linkToCategory+'7'
        }];

        if (crumb.code !== 7) {
            crumb.name = this.Localization(crumb.name, this.props.language);
            if (crumb.hasOwnProperty('code') && !crumb.isPage) {
                crumb['url'] = linkToCategory+crumb.code;
            } else if (crumb.hasOwnProperty('code') && crumb.isPage) {
                crumbs.push({name: crumb.category, url: linkToCategory+crumb.code});
                crumb['url'] = crumb.url;
            } else {
                crumb['url'] = '#';
            }
            crumbs.push(crumb);
        }

        return trail = crumbs.map(function(item, key) {
            if (key > 0 && key < crumbs.length) caret = 'fa fa-caret-right';

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
                <a key={key} className={"breadcrumbs__link"} onClick={linkOnClick}>
                    <span className={"breadcrumbs__caret " + caret}></span>
                    {item.name}
                </a>
            );
        }, this);
    }

    /**
     * Applies the styles to show or hide languages depending on the chosen language
     * @param lang - the HTML element that represents the language tag
     * @param active - a boolean flag that specifies this is the currently-selected language.
     * @param defaultLang - a boolean flag that allows the default language to be highlighted after a page load.
     */
    toggleLang(lang, active, defaultLang) {

        if (defaultLang) {
            lang.classList.add(this.selectedClass);
        }

        if (lang) {
            if (active) {
                if (!lang.classList.contains(this.selectedClass)) {
                    lang.classList.add(this.openClass);
                } else {
                    lang.classList.add(this.activeClass, this.openClass);
                }
            } else {
                if (!lang.classList.contains(this.selectedClass)) {
                    lang.classList.remove(this.activeClass, this.openClass);
                }
            }
        }
    }

    stopPropagation(event) {
        event.stopPropagation();
    }

    toggleNav(event) {
        if (event) event.stopPropagation();

        if (this.nav) this.toggleLayout();

        this.setState({
            open: !this.state.open
        });
    }

    /**
     * Handle open/close menu button and apply the classes to resize the
     * main content view accordingly.
     */
    toggleLayout() {
        var header = document.getElementById(this.elemsToToggle.header);
        var breadcrumbs = document.getElementById(this.elemsToToggle.breadcrumbs);
        var contentWrapper = document.getElementById(this.elemsToToggle.contentWrapper);
        var openFlag = '--open';

        if(this.state.open) {
            this.nav.classList.remove(this.toggleClass);

            if (this.WhichDevice() === 'mobile') {
                this.navButton.classList.remove('fa-close');
                this.navButton.classList.add('fa-navicon');
            } else {
                this.navButton.classList.remove('fa-navicon');
                this.navButton.classList.add('fa-close');
            }

            header.classList.add(this.elemsToToggle.header+openFlag);
            breadcrumbs.classList.add(this.elemsToToggle.breadcrumbs+openFlag);
            contentWrapper.classList.add(this.elemsToToggle.contentWrapper+openFlag);

        } else {
            this.nav.classList.add(this.toggleClass);

            if (this.WhichDevice() === 'mobile') {
                this.navButton.classList.remove('fa-navicon');
                this.navButton.classList.add('fa-close');
            } else {
                this.navButton.classList.remove('fa-close');
                this.navButton.classList.add('fa-navicon');
            }



            header.classList.remove(this.elemsToToggle.header+openFlag);
            breadcrumbs.classList.remove(this.elemsToToggle.breadcrumbs+openFlag);
            contentWrapper.classList.remove(this.elemsToToggle.contentWrapper+openFlag);
        }

    }

    clickAnywhereToClose(event) {
        if (this.WhichDevice() === 'mobile') {
            if (this.state.open) {
                this.toggleNav(event);
            }
        }
    }

    render() {
        var logout__text =  this.Localization('logout', this.props.language);

        return (
            <section id="breadcrumbs" className="breadcrumbs">
                <div className="wrapper wrapper__breadcrumbs">
                    <div id="navButton" className="grid__item leftnav__hamburger fa fa-close"></div>
                    <div className="grid__item breadcrumbs__trail">
                        {this.state.trail}
                    </div>
                    {this.props.children}
                    <div className="grid__item rightnav rightnav--mobileHidden">
                        <div id="langWrapper" className="wrapper rightnav__langSelect">
                            <div className="rightnav__container">
                            <span id="en_CA" className="rightnav__lang">EN</span>
                            <span id="fr_CA" className="rightnav__lang">FR</span>
                            </div>
                        </div>
                        <Link className="rightnav__logout" to="/commonsense">{logout__text}</Link>
                    </div>
                </div>
            </section>
        );
    }
}
