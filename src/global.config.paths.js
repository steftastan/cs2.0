global.paths = {
    dev: {
        BASE_URL: '/',
        REACT_LINK: '/commonsense/react/',
        SERVLET_LINK: '/commonsense/react/',
        DASHBOARD: 'dashboard/',
        BUILD_ROUTE: 'commonsense/react/'
    },

    prod: {
        BASE_URL: '/commonsense/',
        REACT_LINK: '/commonsense/react/',
        SERVLET_LINK: '/commonsense/servlet/',
        DASHBOARD: 'dashboard/',
        BUILD_ROUTE: 'react/'
    }
};

global.endpoints  = {
    dev: {
        SESSION: '/webservices/Session.json',
        COMPANIES: '/webservices/Companies.json',
        ACCORDION: '/webservices/FullMenu.json',
        ACCOUNTS_PAYABLE: '/webservices/AccountsPayable.json',
        ACCOUNTS_PAYABLE_CASH_DISBURSEMENT: '/webservices/AccountsPayableCashDisbursement.json',
        ACCOUNTS_PAYABLE_SUMMARY: '/webservices/AccountsPayableSummary.json',
        ACCOUNTS_PAYABLE_TOOLBOX: '/webservices/AccountsPayableToolbox.json',
        ACCOUNTS_PAYABLE_SLIDING: '/webservices/AccountsPayableSlidingToolBox.json',
        PAYROLL: '/webservices/AccountsPayable.json',
        PAYROLL_SUMMARY: '/webservices/AccountsPayableSummary.json',
        PAYROLL_SLIDING: '/webservices/AccountsPayableSlidingToolBox.json'
    },

    prod: {
        SESSION: '/commonsense/services/user/session',
        COMPANIES: '/commonsense/services/user/portal/companies',
        ACCORDION: '/commonsense/services/user/portal/menu',
        ACCOUNTS_PAYABLE: '/commonsense/services/finance/accounts-payable',
        ACCOUNTS_PAYABLE_CASH_DISBURSEMENT: '/commonsense/services/finance/accounts-payable/cash-disbursement',
        ACCOUNTS_PAYABLE_SUMMARY: '/commonsense/services/finance/accounts-payable/summary',
        ACCOUNTS_PAYABLE_TOOLBOX: '/commonsense/react/webservices/AccountsPayableToolbox.json',
        ACCOUNTS_PAYABLE_SLIDING: '/commonsense/react/webservices/AccountsPayableSlidingToolBox.json',
        PAYROLL: '/commonsense/services/finance/accounts-payable',
        PAYROLL_SUMMARY: '/commonsense/services/finance/accounts-payable/summary',
        PAYROLL_SLIDING: '/commonsense/react/webservices/AccountsPayableSlidingToolBox.json'
    }
};
