import React, { Component } from 'react';

export class CompanyList extends Component {

    constructor(props) {
      super(props);
      this.companyList = [];
    }

    render() {
        if (this.props.companies && this.props.companies.results) {
            this.companyList = this.props.companies.results.map(function(item, key) {
                if (item.name) {
                    return (<option key={key} value={item.name} id={key}>{item.name}</option>);
                }
            }, this);
        }

        return(
            <select id="companyList" value={this.props.defaultCompanyName} onChange={this.props.onChange} className="form__item form__selectCompany">
                {this.companyList}
            </select>
        );
    }
}
