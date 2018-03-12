global.AccountsPayable = {
    widgets : [{
        name: 'toolBox',
        endpoint: global.endpoints[global.env].ACCOUNTS_PAYABLE_TOOLBOX
    }, {
        name: 'dataTable',
        title: 'Accounts Payable',
        endpoint: global.endpoints[global.env].ACCOUNTS_PAYABLE,
        bootStrapClass : 'col-12',
        customColumns: [{
                name: 'name',
                width: 60
            }, {
                name: 'address',
                width: 50
            }, {
                name: 'city',
                width: 30
            }, {
                name: 'province',
                width: 30
            }, {
                name: 'telephone',
                width: 30
            }, {
                name: 'balance',
                width: 30,
                type: 'currency'
            }, {
                name: 'lastInvoiceDate',
                width: 40
            }, {
                name: 'lastCheckDate',
                width: 35
            }, {
                name: 'currPeriodAMT',
                width: 40,
                type: 'currency'
            }],
        options: {
            sizePerPageList: [ {
            text: '25', value: 25
            }, {
            text: '50', value: 50
            }, {
            text: '500', value: 500
            }],
            sizePerPage: 25
        }
    }, {
        name: 'dataTable',
        title: 'cashDisbursement',
        customColumns: [{
                name: 'name',
                width: 75
            }, {
                name: 'location',
                width: 40
            }, {
                name: 'currentWeek',
                width: 50
            }, {
                name: 'currency',
                width: 50
            }, {
                name: 'type',
                width: 40
            }],
        endpoint: global.endpoints[global.env].ACCOUNTS_PAYABLE_CASH_DISBURSEMENT,
        bootStrapClass : 'col-lg-6 col-sm-12',
        options: {}
    }, {
        name: 'dataChart',
        title: 'accountsPayableChart',
        endpoint: global.endpoints[global.env].ACCOUNTS_PAYABLE_CASH_DISBURSEMENT,
        bootStrapClass : 'col-lg-6 col-sm-12',
        type: 'pie',
        aggregateBy: 'type',
        calculateBy: 'totalDue',
        label: 'accountsPayableChart',
        buildTable: true,
        formatTableData: { name: 'totalDue', type: 'currency'}
    }, {
        name: 'slidingToolbox',
        endpoint: global.endpoints[global.env].ACCOUNTS_PAYABLE_SLIDING
    }
]};
