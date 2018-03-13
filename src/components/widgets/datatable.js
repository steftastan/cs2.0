/**
 * DATA TABLE WIDGET
 *
 * Data table created with React Bootstrap Table by Allen Fang
 * http://allenfang.github.io/react-bootstrap-table
 */

import React, { Component } from 'react';
import $ from 'jquery';
import './../../global.languages.js';
import './../../global.config.env.js';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Localization, DataFormatter} from './../../global.helpers.js';

export class DataTable extends Component {

    constructor(props) {
      super(props);
      this.Localization = Localization;
      this.DataFormatter = DataFormatter;
      this.pagination = 'pagination';
      this.tableData = [];
      this.options = {};
      this.filters = [];
      this.newPaginationClass = 'dataTable__pagination';
      this.state = {
          all: false,
          filters: []
      };
    }

    componentWillMount() {

        if (this.options.data) {
            /* TODO: Handle multiple endpoints */

            /* TODO: Should be able to do the filtering on the client side, no need for multiple endpoints
            just react router and params... maybe call getWidget again or make another function */
        }

        this.tableData = this.props.results;
        this.options = {
            page: 1,  // which page you want to show as default
            sizePerPageList: [ {
            text: '10', value: 10
            }, {
            text: '25', value: 25
            }, {
            text: '50', value: 50
            } ], // you can change the dropdown list for size per page
            sizePerPage: 10,  // which size per page you want to locate as default
            pageStartIndex: 1, // where to start counting the pages
            paginationSize: 5,  // the pagination bar size.
            prePage: this.Localization('prev', this.props.language), // Previous page button text
            nextPage: this.Localization('next', this.props.language), // Next page button text
            firstPage: this.Localization('first', this.props.language), // First page button text
            lastPage: this.Localization('last', this.props.language), // Last page button text
            paginationShowsTotal: true,  // Accept bool or function
            paginationPosition: 'top'  // default is bottom, top and both is all available
        };

        /**
         * Replace the default values in the options variable if custom
         * data was sent from the page.
         */
        if (this.props.options && this.props.options.options) {

            for (var key in this.options) {
                /* Override all the default values */
                if (this.props.options.options.hasOwnProperty(key)) {
                    this.options[key] = this.props.options.options[key];
                }

                /* TODO over write tableData maybe in component will mount depending if there are filters up in the URL... so bring in all data Android
                filter results over here */

                /* Append "All" option as another default item in pagination count. */
                if (key === 'sizePerPageList' && this.state.all === false) {
                    this.options.sizePerPageList[this.options.sizePerPageList.length] = {
                        text: this.Localization('all', this.props.language), value: this.tableData.length
                    };
                }
            }
        }

        /* Build filter options*/
        if (this.props.filters) {
            for (var i = 0; i < this.props.filters.length; i++) {
                console.log(this.props.filters[key]);
                this.filters.push(<a key={key} className="tag" href={this.props.filters[i].params}>{this.props.filters[i].displayName}</a>);
            }

            this.setState({
                all: true,
                filters: this.filters
            });
        }


    }

    componentDidMount() {
        var pagination = document.getElementsByClassName(this.pagination);
        var tableContainer;

        /**
         * We must adjust the positioning of our pagination element post-mount, unfortunately
         * this cannot be customized with the current version of React BootStrap Table (version 4.0)
         */

         for (var i = 0; i < pagination.length; i++) {
             if (pagination[i].nodeName === 'UL') {
                 $(pagination[i].parentNode).addClass(this.newPaginationClass);
                 tableContainer = $(pagination[i].parentNode).closest('.react-bs-table-container');
                 $(pagination[i].parentNode).detach().appendTo(tableContainer.first('.dataTable__pagination'));
             }
         }
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        var dataColumns = [];
        var tableHeaders;
        var align;
        var filterBy;
        var title__text;
        var columnName;
        var columnName__text;
        var columnType;
        var columnWidth;


        /* TODO: When to retrieve new changes I would have to over write the tableData info */

        if (this.tableData && this.tableData.length) {

            /**
             * Build the table's columns
             * We can pass the custom columns we want to use with the customColumn property from the config.
             * The fallback behavior is to display all columns.
             */
            if (this.props.options) {
                dataColumns = (this.props.options.customColumns ? this.props.options.customColumns : Object.keys(this.tableData[0]));

                if (dataColumns.length) {
                    tableHeaders = dataColumns.map(function(item, key) {
                        filterBy = (dataColumns && (dataColumns.indexOf(item) !== -1)) ? { type: 'TextFilter' } : {};
                        columnName = item.name || item;
                        columnType = item.type || '';
                        columnWidth = ''+item.width+'' || 50;
                        columnName__text = this.Localization(columnName, this.props.language); // Translated version of the column name.
                        align = (item.type && item.type === 'currency') ? 'right' : 'left'; // Align contents to the right when the column is formatted as currency.

                        return (
                            <TableHeaderColumn
                                key={key}
                                width={columnWidth}
                                isKey={key === 0 ? true : false}
                                dataAlign={align}
                                dataFormat={this.DataFormatter}
                                formatExtraData={columnType}
                                filter={filterBy}
                                dataSort={true}
                                dataField={columnName}>
                                    {columnName__text}
                            </TableHeaderColumn>
                        );

                    }, this);
                }
            }
        }

        if (this.tableData) {
            title__text = this.Localization(this.props.options.title, this.props.language); // Translated version of the chart's title.
            var table = (
                <div className="wrapper wrapper__content--whiteBox">
                    <h2 className={'dataTable__title'}>{title__text}</h2>
                    <div className="tag__wrapper col-md-6 col-xs-6 col-sm-6 col-lg-6">
                        {this.filters}
                    </div>
                    <BootstrapTable key={this.props.index} data={this.tableData} options={this.options} striped hover pagination tableHeaderClass={'dataTable__row--header'} trClassName={'dataTable__row--content'}>
                        {tableHeaders}
                    </BootstrapTable>
                    <div className="dataTable__pagination"></div>
                </div>
            );
        }

        return (
            <div key={this.props.index} className={this.props.options.bootStrapClass}>
                {table}
            </div>

        );
    }
}
