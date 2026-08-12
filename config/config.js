const config = {
    environments: {

        qa: {
            baseURL: 'https://www.tdsm.app/CentralizeAdmin/Login/Login?encId=VlihNAnvV5M_EQUAL_',
            cspURL: 'https://www.tdsm.app/CentralizeSP/Student/Login/CoreAutomationtesting260805'
        },

        uat: {
            baseURL: 'https://uat.client.com',
            cspURL: ''
        },

        prod: {
            baseURL: 'https://client.com',
            cspURL: ''
        }

    },
    baseURL: 'https://www.tdsm.app/CentralizeAdmin/Login/Login?encId=VlihNAnvV5M_EQUAL_',
    cspURL: 'https://www.tdsm.app/CentralizeSP/Student/Login/CoreAutomationtesting260805'

};

module.exports = config;