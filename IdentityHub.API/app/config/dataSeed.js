module.exports = {
    collections: {
        User: require('../models/user'),
        Api: require('../models/api'),
        Client: require('../models/client'),
        Provider: require('../models/provider'),
        Domain: require('../models/domain')
    },
    data: {
        User: [
            {email: 'gsilber@cyberdaptive.com', password: 'test'},
            {email: 'test@test.com',password: 'test'}
        ],
        Client: [
            {name: 'Identity Hub', clientId: 'identityhubUI'},
            {name: 'Test Client', clientId: 'testclient'}
        ],
        Api: [
            {name: 'Identity API', apiId: 'identityhubAPI'},
            {name: 'Test API', apiId: 'testapi'}
        ],
        Provider: [{ providerType: 'google' }],
        Domain: [
            {name: 'Site Global Domain',domainId: 'site!global'},
            {name: 'Test Domain',domainId: 'testDomain'}
        ]
    },
    relations:[
        {
            parentSchema: 'User',
            childSchema: 'Client',
            parentQuery: {email: 'gsilber@cyberdaptive.com'},
            childQuery: {clientId: 'identityhubUI'},
            parentField: 'clients'
        },
        {
            parentSchema: 'User',
            childSchema: 'Api',
            parentQuery: {email: 'gsilber@cyberdaptive.com'},
            childQuery: {apiId: 'identityhubAPI'},
            parentField: 'apis'
        },
        {
            parentSchema: 'Client',
            childSchema: 'Api',
            parentQuery: {clientId: 'identityhubUI'},
            childQuery: {apiId: 'identityhubAPI'},
            parentField: 'authorizedApis'
        },
        {
            parentSchema: 'User',
            childSchema: 'Domain',
            parentQuery: {email: 'gsilber@cyberdaptive.com'},
            childQuery: {domainId: 'site!global'},
            parentField: 'domains'
        },
        {
            parentSchema: 'Domain',
            childSchema: 'User',
            parentQuery: {domainId: 'site!global'},
            childQuery: {email: 'gsilber@cyberdaptive.com'},
            parentField: 'users'
        },
        {
            parentSchema: 'Client',
            childSchema: 'Domain',
            parentQuery: {clientId: 'identityhubUI'},
            childQuery: {domainId: 'site!global'},
            parentField: 'domain'
        },
        {
            parentSchema: 'Api',
            childSchema: 'Domain',
            parentQuery: {apiId: 'identityhubAPI'},
            childQuery: {domainId: 'site!global'},
            parentField: 'domain'
        }
    ]

    
} 
