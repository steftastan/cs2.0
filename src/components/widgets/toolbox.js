import React, { Component } from 'react';
import $ from 'jquery';
import { WhichDevice } from './../../global.helpers.js';

export class ToolBox extends Component {

    constructor(props) {
      super(props);
      this.WhichDevice = WhichDevice;
      this.state = {
          open: false,
          toolBox: [],
          device: ''
      };
      this.toggleClass = 'toolBox__wrapper--toggle';
      this.subLinks = [];
      this.toolButtonId = 'toolButton';
      this.toolBoxId = 'toolBoxWrapper';
      this.toolBoxClass = 'toolBox__group';
      this.toolBoxItem = 'toolBox__item';
      this.toolBoxLink = 'toolBox__link';
      this.toolBoxBack = 'toolBox__back';
      this.active = 'active';
      this.inactive = 'inactive';
      this.toolNav = [];
      this.animateToolBox = this.animateToolBox.bind(this);
      this.toggleNav = this.toggleNav.bind(this);
      this.resetNav = this.resetNav.bind(this);
      this.toolBoxWrapper = {};
      this.toolBoxHeight = 0;
      this.menuClass = '';
      this.wrapperClass = '';
      this.navClass = '';
      this.tbClass = '';
    }

    /* Handle open/close button available on mobile */
    toggleNav(e) {
        e.stopPropagation();
        this.toolNav = document.getElementById(this.toolBoxId);
        this.toolButton = document.getElementById(this.toolButtonId);
        var firstToolBox;

        if(this.state.open) {
            this.setState({
                open: false
            });
            this.toolNav.classList.remove(this.toggleClass);
            this.toolButton.classList.add('fa-ellipsis-v');
            this.toolButton.classList.remove('fa-close');
            this.resetNav();

        } else {
            this.setState({
                open: true
            });
            this.toolNav.classList.add(this.toggleClass);
            this.toolButton.classList.add('fa-close');
            this.toolButton.classList.remove('fa-ellipsis-v');
            firstToolBox = document.getElementById('firstToolBox');

            /* Get the child's computed height so we can adjust the wrapper accordingly. */
            this.toolBoxHeight = window.getComputedStyle(firstToolBox);
            this.toolBoxHeight = this.toolBoxHeight.getPropertyValue('height');
            this.toolBoxWrapper.style.height = this.toolBoxHeight;
        }
    }

    /* Reset the toolbox elements inside our navigation if the user closes out of it */
    resetNav() {
        var toolBoxGroups;
        toolBoxGroups = this.toolNav.getElementsByClassName(this.toolBoxClass);
        if (toolBoxGroups.length) {
            for (var i = 0; i < toolBoxGroups.length; i++) {
                if (i !== 0) toolBoxGroups[i].classList.remove(this.active);
                toolBoxGroups[i].classList.remove(this.inactive);
            }
        }
    }

    /**
     * Function to animate the toolbox, recursively allows children to call this
     * function back to keep exploring children elements, regardless of depth.
     */
    animateToolBox(e) {
        e.preventDefault();
        var clickedItem = e.target;
        var toolBoxGroup;
        var childItem;
        var url;
        var activeButton;
        var backButton = null;
        var oldGroup;

        /* Ensure we have stored the correct DOM node, we need to move the entire group off the screen */
        if (!clickedItem.classList.contains(this.toolBoxClass)) {
            toolBoxGroup = (clickedItem.classList.contains(this.toolBoxItem) ? clickedItem.parentNode : clickedItem.parentNode.parentNode);
        }

        /* Ensure we have stored the correct DOM node, to bring in the new level of nav */
        childItem = clickedItem.getElementsByClassName(this.toolBoxClass) ? clickedItem.getElementsByClassName(this.toolBoxClass)[0] : [];

        /* Sliding logic for all buttons except the back button */
        if (!clickedItem.classList.contains(this.toolBoxBack)) {
            if (clickedItem.getElementsByClassName(this.toolBoxClass).length) {
                childItem = clickedItem.getElementsByClassName(this.toolBoxClass)[0];

            } else if (clickedItem.getElementsByClassName(this.toolBoxLink)) {
                childItem = clickedItem.parentNode.getElementsByClassName(this.toolBoxClass)[0];
            } else {
                childItem = [];
            }

            if (clickedItem.classList.contains(this.toolBoxBack)) {
                backButton = (clickedItem.classList.contains(this.toolBoxBack) ? clickedItem : clickedItem.parentNode);
            }

            /* There children tool box still */
            if (childItem) {
                /* Move the tool box off the screen */
                toolBoxGroup.classList.add(this.inactive);

                /* Move the new set of options into position*/
                childItem.classList.add(this.active);

                /* Get the child's computed height so we can adjust the wrapper accordingly. */
                this.toolBoxHeight = window.getComputedStyle(childItem);
                this.toolBoxHeight = this.toolBoxHeight.getPropertyValue('height');
                this.toolBoxWrapper.style.height = this.toolBoxHeight;

                clickedItem.removeEventListener('click', this.animateToolBox);
                childItem.addEventListener('click', this.animateToolBox);
            }

            /* We reached the end of the list, allow the user to click on the option */
            if (!childItem) {
                activeButton = (clickedItem.classList.contains(this.toolBoxLink) ? clickedItem : clickedItem.childNodes[0]);
                if (activeButton) {
                    url = (activeButton.hasAttribute('href') ? activeButton.getAttribute('href') : '');
                    window.location.href = url;
                }

            }
        } else {
            /**
             * Logic to control the back button
             */
             backButton = (clickedItem.classList.contains(this.toolBoxBack) ? clickedItem : clickedItem.parentNode);
             oldGroup = (toolBoxGroup.parentNode.parentNode.classList.contains(this.inactive) ? toolBoxGroup.parentNode.parentNode : null);

             if (oldGroup) {
                 oldGroup.classList.remove(this.inactive);
             }
        }
    }

    componentWillMount() {
        /**
         * Obtain ToolBox data in order to build navigation
         */
        var device = this.WhichDevice();

        if (device !== 'mobile') {
            this.menuClass = 'dropdown-submenu';
            this.wrapperClass = 'navbar navbar-default navbar-fixed-top';
            this.navClass = 'nav navbar-nav';
            this.tbClass = 'dropdown-menu multi-level';
        }

        this.setState({toolBox: this.props.results, device: device});
    }

    componentDidMount() {
        var navButton = document.getElementById(this.toolButtonId);
        document.addEventListener('mousedown', this.clickAnywhereToClose, false);

        /* Add click event to the tool box button on mobile */
        navButton.addEventListener('mousedown', this.toggleNav, false);
        this.toolBoxWrapper = document.getElementById(this.toolBoxId);

        if (this.state.device === 'mobile') {
            this.toolBoxWrapper.addEventListener('click', this.animateToolBox);
        } else {

            $(document).ready(function() {
                $('.navbar a.toolBox__toggle').on('click', function(e) {
                    var $el = $(this);
                    var $parent = $(this).offsetParent();

                    $(this).parent("li").toggleClass('open');
                    if(!$parent.parent().hasClass('nav')) {
                        $el.next().css({"top": $el[0].offsetTop, "left": $parent.outerWidth() - 4});
                    }

                    $('.nav li.open').not($(this).parents("li")).removeClass("open");

                    return false;
                });

                $("#toolBox").detach().appendTo("#toolBoxHolder");
            });

            $(document).mouseup(function(e) {
                var container = $(".navbar a.toolBox__toggle");

                // if the target of the click isn't the container nor a descendant of the container
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    $('.nav li.open').removeClass("open");
                }
            });
        }
    }

    componentDidUpdate() {
        /**
         * Add mouse events here to trigger animation.
         */
        this.toolBoxWrapper = document.getElementById(this.toolBoxId);

        if (this.WhichDevice() === 'mobile') {
            this.toolBoxWrapper.addEventListener('click', this.animateToolBox);
        }
    }

    render() {
        var renderToolBox;

        if (this.state.toolBox) {
            renderToolBox = this.state.toolBox.map(function(item, key) {
                if (item.subLinks && item.subLinks.length) {
                    this.subLinks = item.subLinks;
                }
                return (
                    <li className="toolBox__item" key={key} id={key}>
                        <a className="toolBox__link toolBox__toggle" data-toggle="dropdown" href={item.url}>{item.linkName}</a>
                        <SubLinks tbClass={this.tbClass} menuClass={this.menuClass} subLinks={this.subLinks}/>
                    </li>
                );
            }, this);
        }

        return (
            <section id="toolBox" className="toolBox">
                <div id="toolButton" className="grid__item leftnav__ellipsis leftnav--desktopHidden fa fa-ellipsis-v"></div>
                <div id="toolBoxWrapper" className={"toolBox__wrapper " + this.wrapperClass}>
                    <ul id="firstToolBox" className={this.navClass + " toolBox__group"}  role="navigation">
                        {renderToolBox}
                    </ul>
                </div>
            </section>
        );
    }
}

/**
 * Recursively generates the list of links for the tool box widget.
 */
export class SubLinks extends Component {
    constructor(props) {
      super(props);
      this.toolBox = [];
      this.subLinks = [];
      this.noSubLinks = 'dropdown';
    }

    render() {
        var tools = [];
        var subMenu = [];
        var menuClass = this.props.menuClass;
        var tbClass = this.props.tbClass;

        if (this.props.subLinks) {
            tools = this.props.subLinks.map(function(item, key) {

                /* Clear the subMenu array to prepare for each new iteration */
                if (subMenu) {
                    subMenu = [];
                }

                /**
                 * Recursively call this function as long
                 * as the application keeps finding subLink arrays.
                 * print an option without an arrow once we run out of children.
                 */

                if (!item.subLinks) {
                    menuClass = this.noSubLinks;
                }

                if (item.subLinks) {
                    subMenu = <SubLinks tbClass={tbClass} menuClass={menuClass} subLinks={item.subLinks}/>;
                }

                return (
                    <li className={menuClass +" toolBox__item"} key={key} id={key}>
                        <a className="toolBox__link toolBox__link--child" href={item.url}>{item.linkName}</a>
                        {subMenu}
                    </li>
                );
            }, this);
        }

        return (
            <ul className={"toolBox__group "+tbClass}>
                <li className="toolBox__item toolBox__back">
                    <a href="#" className="toolBox__link toolBox__back"><span className="toolBox__back toolBox__caret fa fa-angle-left"></span>Back</a>
                </li>
                {tools}
            </ul>
        );
    }
}
