global.Payroll = {
    widgets : [{
        name: 'dataTable',
        title: 'Payroll',
        endpoint: global.endpoints[global.env].PAYROLL,
        bootStrapClass : 'col-lg-6 col-sm-12',
        options: {
            sizePerPageList: [ {
            text: '25', value: 25
            }, {
            text: '50', value: 50
            }, {
            text: '500', value: 500
            }],
            sizePerPage: 25
        },
        customColumns: [{
                name: 'name',
                width: 60
            }, {
                name: 'address',
                width: 50
            }, {
                name: 'balance',
                width: 30,
                type: 'currency'
            }]
    }, {
        name: 'dataChart',
        title: 'Payroll',
        endpoint: global.endpoints[global.env].ACCOUNTS_PAYABLE_CASH_DISBURSEMENT,
        bootStrapClass : 'col-lg-6 col-sm-12',
        type: 'bar',
        aggregateBy: 'type',
        calculateBy: 'totalDue',
        label: 'Payroll',
        buildTable: true
    }
]};
