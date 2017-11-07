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
            {
                email: 'gsilber@cyberdaptive.com',
                password: 'test',
                apis: []
            }
        ],
        Client: [
            {
                name: 'testapp',
                clientId: 'testapp',
                apis: []
            }
        ],
        Api: [
            {
                name: 'testapi',
                apiId: 'testapi'
            }
        ],
        Provider: [{ providerType: 'google' }],
        Domain: [{name: 'test',domainId: 'test'}]
    },
    relations:[
        {
            parentSchema: 'User',
            childSchema: 'Client',
            parentQuery: {email: 'gsilber@cyberdaptive.com'},
            childQuery: {clientId: 'testapp'},
            parentField: 'clients'
        },
        {
            parentSchema: 'User',
            childSchema: 'Api',
            parentQuery: {email: 'gsilber@cyberdaptive.com'},
            childQuery: {apiId: 'testapi'},
            parentField: 'apis'
        }
    ]

    
} 
