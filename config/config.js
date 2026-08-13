const config = {
    environments: {

        qa: {
            baseURL: 'https://www.tdsm.app/CentralizeAdmin/Login/Login?encId=VlihNAnvV5M_EQUAL_',
            cspURL: 'https://www.tdsm.app/CentralizeSP/Student/Login/CoreAutomationtesting260805',
            csmURL: 'https://www.tdsm.app/StaffMobile/Login/Login?encId=lqtii5942hmt3f7myMFOrh6OrA1jJPH3NBEVu7xuiqq9NvD3uZjIXA%3D%3D'
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
    cspURL: 'https://www.tdsm.app/CentralizeSP/Student/Login/CoreAutomationtesting260805',
    csmURL: 'https://www.tdsm.app/StaffMobile/Login/Login?encId=lqtii5942hmt3f7myMFOrh6OrA1jJPH3NBEVu7xuiqq9NvD3uZjIXA%3D%3D'

};

module.exports = config;