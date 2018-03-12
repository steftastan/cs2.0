import React, { Component } from 'react';
import './../../global.config.env.js';
import { Localization, HandleWebFacingLink, HandlePopupLink, HandleRegularLink} from './../../global.helpers.js';

/**
 * ACCORDION/LEFT NAV COMPONENT
 *
 * The left navigation.
 *
 */
export class Accordion extends Component {

    constructor(props) {
      super(props);
      this.Localization = Localization;
      this.filterLinkList = this.filterLinkList.bind(this);
      this.toggleElem = this.toggleElem.bind(this);
    }

    /**
     * logic behind showing or hiding the navigation elements when the search function is used
     * @param elem - an HTML element or array of HTML elements to be hidden and shown.
     * @param display - a string that takes a value for the CSS property display (none, block, inline, inline-block).
     * @param requiresOpenClass - a boolean that specifies if the element will need to have a toggle class added to them.
     * @param action - a string that determines what will be done with the openClass if it is required. accepted values are 'add' or 'remove'.
     * @param openClassName - the CSS class that will be applied.
     */
    toggleElem(elem, display, requiresOpenClass, action, openClassName) {
        // set default values
        var i = 0;
        openClassName = openClassName ? openClassName : 'leftnav__item--open';
        display = display ? display : '';
        requiresOpenClass = requiresOpenClass ? requiresOpenClass : false;
        action = action ? action : 'add';

        if (elem.length) {
            // element is an array of multiple elements, enclose code in loop
            for (i = 0; i < elem.length; i++) {
                elem[i].style.display = display;
                // element is an HTML object
                if (requiresOpenClass && action === 'add') {
                    elem[i].classList.add(openClassName);
                } else if (requiresOpenClass && action === 'remove')  {
                    elem[i].classList.remove(openClassName);
                }
            }
        } else {
            // element is an HTML object
            if (requiresOpenClass && action === 'add') {
                elem.classList.add(openClassName);
            } else if (requiresOpenClass && action === 'remove')  {
                elem.classList.remove(openClassName);
            }
            elem.style.display = display;
        }
    }

    /**
     * Logic for filtering the link list according to the search
     * criteria entered by the user in the search box.
     */
    filterLinkList() {
        var inputBox, filter, ul, li, a, i, j;
        var result;
        var mainLinkClass = 'leftnav__child';
        var filteredMainLinks = [];

        inputBox = document.getElementById('searchInput');

        if (inputBox) {
            filter = inputBox.value.toUpperCase();

            ul = document.getElementById("linkList");
            li = ul.getElementsByTagName('li');

            // loop through all list items, and hide those who don't match the search query
            for (i = 0; i < li.length; i++) {
                a = li[i].getElementsByTagName("a");

                if (filter) {
                    for (j = 0; j < a.length; j++) {
                        if (a[j].innerHTML.toUpperCase().indexOf(filter) > -1) {

                            // if it finds a result, toggle ON all matching child links
                            this.toggleElem(a[j]);
                            filteredMainLinks.push(li[i]);
                            result = true;

                        } else {
                            // if it doesn't find a result
                            this.toggleElem(a[j], 'none');
                            this.toggleElem(li[i], 'none', true, 'remove');
                        }
                    }

                    if (result) {

                        /* we need to toggle ON the main link groups for every child
                           link that matches the search criteria, regardless of whether
                           these links themselves match the search.
                         */
                        this.toggleElem(filteredMainLinks, '', true, 'add');
                        this.toggleElem(li[i].getElementsByClassName(mainLinkClass), '');
                    }

                } else {

                    /* if the text box is empty, or the user clears up the text they
                       input, return the navigation to its default state.
                     */
                    this.toggleElem(a, '');
                    this.toggleElem(li[i], '', true, 'remove');
                    this.toggleElem(li[i].getElementsByClassName(mainLinkClass), '');
                }
            }
        }
    }


    componentWillMount() {
        document.addEventListener('keyup', this.filterLinkList, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.filterLinkList, false);
    }


    render() {
        var link = "";
        var link__text;
        var welcome__text = this.Localization('welcome', this.props.language);
        var filterNavigation__text = this.Localization('filterNavigation', this.props.language);

        if (this.props.links && this.props.links.results) {
            var commonSenseLinkList = this.props.links.results.map(function(item, key) {
                link__text = this.Localization(item.name, this.props.language);

                link = global.paths[global.env].REACT_LINK+global.paths[global.env].DASHBOARD+(item.code);

                return (
                    <Section key={key}>
                        <div id={item.code} className="leftnav__section">
                            <span className={"leftnav__child leftnav__icon icon-" + item.icon + "_32 " + item.color}></span>
                            <a className="leftnav__child leftnav__link" href={link}>{link__text}</a>
                            <a className="leftnav__child leftnav__arrow fa fa-chevron-right" href="#"></a>
                        </div>
                        <SubLinkList sublinks={item.sublinks} />
                    </Section>
                );
            }, this);
        }

        var accordion = (
            <nav id="nav" className="wrapper leftnav leftnav--toggle">
                <ul className="leftnav__list">
                    <li className="leftnav__fixed">
                        <div className="leftnav__section--fixed">
                            <span className="leftnav__user">{welcome__text + this.props.employeeName}</span>
                            <form className="form">
                                <i className="form__icon form__icon--company  fa fa-building"></i>
                                {this.props.children}
                            </form>
                        </div>
                        <div id="langWrapper--mobile"></div>
                    </li>
                    <li className="leftnav__fixed">
                        <div className="leftnav__section--fixed">
                            <span className="leftnav__search"></span>
                            <form className="form">
                                <i className="form__icon form__icon--search fa fa-search"></i>
                                <input id="searchInput" className="form__item form__filterLeftNav" type="text" placeholder={filterNavigation__text} />
                            </form>
                        </div>

                    </li>

                </ul>
                <ul id="linkList" className="leftnav__list">
                    {commonSenseLinkList}
                </ul>
            </nav>
        );

        return (
            <div>
                {accordion}
            </div>
        );
    }
}

export class Section extends Component {

    constructor() {
      super();
      this.handleClick = this.handleClick.bind(this);
      this.state = {
          open: false,
          childClass: "leftnav__child",
          sectionClass: "leftnav__section",
          className: 'leftnav__item '
      };
    }

    handleClick(event) {
        var sectionHeight;
        var subLinksHeight;

        event.preventDefault();

        if (event.target.hasAttribute("href")) {
          window.location.href = event.target.href;
        }

        if(this.state.open) {
            this.setState({
                open: false,
                height: sectionHeight,
                className: 'leftnav__item '
            });
        } else {
            this.setState({
                open: true,
                height: sectionHeight+subLinksHeight,
                className: 'leftnav__item leftnav__item--open'
            });
        }
    }

    render() {
        return (
            <li id={this.props.id}  className={this.state.className} onClick={this.handleClick}>
                {this.props.children}
            </li>
        );
    }
}

export class SubLinkList extends Component {

    constructor() {
      super();
      this.HandleWebFacingLink = HandleWebFacingLink;
      this.HandlePopupLink = HandlePopupLink;
      this.HandleRegularLink = HandleRegularLink;
    }

    render() {

        var link;
        var subLinks;
        var linkOnClick = {};

        if (this.props.sublinks && this.props.sublinks && this.props.sublinks.length) {
            subLinks = this.props.sublinks.map(function(item, key) {

                if (item.url.indexOf("GatewayServlet") !== -1) {
                    linkOnClick = this.HandleWebFacingLink.bind(this, item.url);
                }
                else if (item.url.indexOf("popup") !== -1) {
                    linkOnClick = this.HandlePopupLink.bind(this, item.url);
                }
                else {
                    linkOnClick = this.HandleRegularLink.bind(this, item.url);
                }

                return link = (<a key={key} className="leftnav__subItem" onClick={linkOnClick}>{item.name}</a>);

            }, this);
        }

        return (
            <div className="leftNav__subLinks">
                {subLinks}
            </div>
        );
    }
}
