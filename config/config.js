const environments = {
    staging: {
        baseURL: 'https://www.staging.ms/CentralizedAdminDemo/Login/Login?encID=6l_PLUS_AtnWPStg_EQUAL_',
        csmURL: 'https://www.staging.ms/CStaffPortalDemo/Login/Login?encId=hUdHaYCxYUC9NvD3uZjIXA%3D%3D',
        cspURL: 'https://www.staging.ms/CentralizeSP/Student/Login/core',
        teenOEURL: 'https://www.staging.ms/OE/Customer/studentTeen?companyId=/CSAIbRpSJU',
        adultOEURL: 'https://www.staging.ms/OE/Customer/studentAdult?companyId=/CSAIbRpSJU',
        rtOEURL: 'https://www.staging.ms/OE/Customer/studentRT?companyId=/CSAIbRpSJU',
        ktOEURL: 'https://www.staging.ms/OE/Customer/studentWT?companyId=/CSAIbRpSJU'
    },

    uat: {
        baseURL: 'https://www.tdsm.app/CentralizeAdminUAT/Login/Login?encID=UjPJnFaEbPg_EQUAL_',
        csmURL: 'https://www.tdsm.app/StaffMobileUAT/Login/Login?encId=yIWA0yZrnEQpW3w3JxyEmw==',
        cspURL: 'https://tdsm.app/CentralizeSPUAT/Student/Login/CoreUAT',
        teenOEURL: 'https://www.tdsm.app/OEUAT/Customer/studentTeen?companyId=KVt8NycchJs',
        adultOEURL: 'https://www.tdsm.app/OEUAT/Customer/studentAdult?companyId=KVt8NycchJs',
        rtOEURL: 'https://www.tdsm.app/OEUAT/Customer/studentRT?companyId=KVt8NycchJs',
        ktOEURL: 'https://www.tdsm.app/OEUAT/Customer/studentWT?companyId=KVt8NycchJs'
    },

    coreServer1: {
        baseURL: 'http://tds.ms/CentralizeAdmin/Login/Login/Core',
        csmURL: 'https://www.tds.ms/StaffMobile/Login/Login?encId=jilqn2/1CQK9NvD3uZjIXA==',
        cspURL: 'https://www.tds.ms/CentralizeSP/Student/Login/Core',
        teenOEURL: 'https://www.tds.ms/OE/Customer/studentTeen?companyId=/CSAIbRpSJU',
        adultOEURL: 'https://www.tds.ms/OE/Customer/studentAdult?companyId=/CSAIbRpSJU',
        rtOEURL: 'https://www.tds.ms/OE/Customer/studentRT?companyId=/CSAIbRpSJU',
        ktOEURL: 'https://www.tds.ms/OE/Customer/studentWT?companyId=/CSAIbRpSJU'
    },

    // Current default: Core Server 2
    coreServer2: {
        baseURL: 'https://www.tdsm.app/CentralizeAdmin/Login/Login?encId=VlihNAnvV5M_EQUAL_',
        csmURL: 'https://www.tdsm.app/StaffMobile/Login/Login?encId=lqtii5942hmt3f7myMFOrh6OrA1jJPH3NBEVu7xuiqq9NvD3uZjIXA%3D%3D',
        cspURL: 'https://www.tdsm.app/CentralizeSP/Student/Login/CoreAutomationtesting260805',
        teenOEURL: 'https://www.tdsm.app/OE/Customer/studentTeen?companyId=h9YwUPSXnrc=',
        adultOEURL: 'https://www.tdsm.app/OE/Customer/studentAdult?companyId=h9YwUPSXnrc=',
        ktOEURL: 'https://www.tdsm.app/OE/Customer/studentWT?companyId=h9YwUPSXnrc=',
        rtOEURL: 'https://www.tdsm.app/OE/Customer/studentRT?companyId=h9YwUPSXnrc=&param=RT'
    }
};

const currentEnv = process.env.ENV || 'coreServer2';
const activeEnv = environments[currentEnv] || environments.coreServer2;

const config = {
    environments,
    ...activeEnv
};

export default config;