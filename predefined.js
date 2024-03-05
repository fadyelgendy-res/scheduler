const predefined = {
    statement: {
        cronExpression: "*/30 * * * *", // Time Intervals?
        headers: {}, // How to get The token?
        method: 'get',
        query: {},
        callbackUrl: 'http://localhost:5666/api/externalBank/v1_getStatementCallback'
    }
};

module.exports = predefined;