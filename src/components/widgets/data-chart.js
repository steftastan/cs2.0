/*
 * React-Chartjs2 found here:
 * https://github.com/houjiazong/react-chartjs2
 */

import React, { Component } from 'react';
import './../../global.config.env.js';
import { Localization, ConvertRgbToRgba, DataFormatter } from './../../global.helpers.js';
import RC2 from 'react-chartjs2';

export class DataChart extends Component {

    constructor(props) {
        super(props);
        this.Localization = Localization;
        this.ConvertRgbToRgba = ConvertRgbToRgba;
        this.DataFormatter = DataFormatter;
        this.processData = this.processData.bind(this);
        this.colors = global.colors;
        this.myChart = null;
        this.data = {};
        this.buildTable = [];
        this.tableRows = [];

    }

    /*
     * Build data to in the statistics chart.
     * Reference to this solution: https://stackoverflow.com/questions/21874436/summarize-and-group-json-object-in-jquery
     */
    processData() {
        var rawData = this.props.results;
        var aggregateBy = this.props.options.aggregateBy;
        var calculateBy = this.props.options.calculateBy;
        var output = {};
        var parseNumber = 0;

        if (rawData && aggregateBy && calculateBy) {
            try {
                output = rawData.reduce(function(out, curr) {

                    parseNumber = (!isNaN(curr[calculateBy]) ? Math.floor(curr[calculateBy]) : Math.floor(parseInt(curr[calculateBy].replace(/\s/g, "").replace(",", ""))));

                    out.dataset[curr[aggregateBy]] = out.dataset[curr[aggregateBy]] || {};
                    out.dataset[curr[aggregateBy]]['dataName'] = curr[aggregateBy] || {};
                    out.dataset[curr[aggregateBy]][calculateBy] = (out.dataset[curr[aggregateBy]][calculateBy] || 0) + parseNumber;
                    out.total['total'] = (out.total['total'] || 0) + parseNumber;
                    return out;

                }, {'dataset' : {}, 'total':{}});
            } catch (e) {
                /* The operation fails if:
                 *
                 * The data returned from the web service doesn't have columns that match the names
                 * provided in the aggregateBy and calculateBy properties.
                 * To fix, double check the data received from the WS, or modify the values
                 * for aggregateBy and calculateBy in global.pages.js for that page's configuration.
                 */
                console.log('An error ocurred while generating the data chart.');
            }

        }
        return output;
    }

    /*
     * Build data object for the chart.
     */
    componentWillMount() {
        var chartData = this.processData(); // The new object with the aggregated data.
        var type = this.props.options.type || 'pie'; //Default to pie chart if no type was specified.
        var chartLabel = this.Localization(this.props.options.label, this.props.language) || '';
        var buildTable = this.props.options.buildTable;
        var labels = [];
        var data = [];
        var backgroundColor = [];
        var borderColor = [];
        var total = 0;

        if (chartData) {

            for (var key in chartData.dataset) {

                /* Obtain percentage */
                total = (chartData.dataset[key][this.props.options.calculateBy] / chartData.total.total * 100);

                labels.push(chartData.dataset[key].dataName);
                data.push(chartData.dataset[key][this.props.options.calculateBy]);

                if (buildTable) {

                    /* Use the format type specified in config file or treat currency as default. */
                    var formatType = (this.props.options.formatTableData ? this.props.options.formatTableData.type : 'currency');

                    /* Looks for the element to convert in the DataSet based on the data passed in the formatTableData, if available.
                     * If that isn't available, it defaults to using the column specified in calculateBy.
                     */
                    var formatData = (chartData.dataset[key][this.props.options.formatTableData] ? chartData.dataset[key][this.props.options.formatTableData.name] : chartData.dataset[key][this.props.options.calculateBy]);
                    var formattedCell = this.DataFormatter(formatData, null, formatType);

                    this.tableRows.push(
                        <tr className="dataChart__row" key={key}>
                            <td className="dataChart__cell">{chartData.dataset[key].dataName}</td>
                            <td className="dataChart__cell">{formattedCell}</td>
                            <td className="dataChart__cell">{total.toFixed(2)}%</td>
                        </tr>
                    );
                }
            }

            if (buildTable) {
                this.buildTable.push(
                    <div key={this.props.index} className="col-lg-6">
                        <table key={this.props.index} className="dataChart__table">
                            <thead className="dataChart__heading">
                                <tr>
                                    <th className="dataChart__cell--heading">{this.props.options.aggregateBy}</th>
                                    <th className="dataChart__cell--heading">{this.props.options.calculateBy}</th>
                                    <th className="dataChart__cell--heading">%</th>
                                </tr>
                            </thead>
                            <tbody className="dataChart__tableBody">
                                {this.tableRows}
                            </tbody>
                        </table>
                    </div>
                );
            }

            /* Build arrays of cosmetic details*/
            if (labels.length) {
                for (var i = 0; i < labels.length; i++) {
                    borderColor.push(this.colors[i]);
                    backgroundColor.push(this.ConvertRgbToRgba(this.colors[i], 0.2));
                }
            }

            /* Push to config object */
            this.data = {
                labels: labels,
                type: type,
                datasets: [{
                    label: chartLabel,
                    data: data,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1
                }]
            };
        }
    }

    render() {
        var title__text = this.Localization(this.props.options.title, this.props.language);
        var bootStrapClass = this.props.options.buildTable ? 'col-lg-6' : 'col-12';

        return (
            <div key={this.props.theKey} className={this.props.options.bootStrapClass}>
                <div className="wrapper wrapper__content--whiteBox">
                    <h2 className={'dataTable__title'}>{title__text}</h2>
                    <div className={bootStrapClass}>
                        <RC2 data={this.data} type={this.data.type} />
                    </div>
                    {this.buildTable}
                </div>
            </div>
        );
    }
}
