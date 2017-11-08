module.exports = {
    collections: {
        User: require('../models/user'),
        Api: require('../models/api'),
        Client: require('../models/client'),
        Provider: require('../models/provider')
    },
    data: {
        User: [
            {
                data: { email: 'gsilber@cyberdaptive.com', password: 'test' },
                relations: [
                    {
                        key: 'email',
                        field: 'clients',
                        child: {
                            schema: 'Client',
                            key: 'clientId',
                            queries: ['identityhubUI', 'testclient']
                        }
                    },
                    {
                        key: 'email',
                        field: 'apis',
                        child: {
                            schema: 'Api',
                            key: 'apiId',
                            queries: ['identityhubAPI', 'testapi']
                        }
                    }
                ]
            },
            {
                data: { email: 'test@test.com', password: 'test' },
                relations: [
                    {
                        key: 'email',
                        field: 'clients',
                        child: {
                            schema: 'Client',
                            key: 'clientId',
                            queries: ['testclient']
                        }
                    },
                    {
                        key: 'email',
                        field: 'apis',
                        child: {
                            schema: 'Api',
                            key: 'apiId',
                            queries: ['testapi']
                        }
                    }
                ]
            }
        ],
        Client: [
            {
                data: { name: 'Identity Hub', clientId: 'identityhubUI' },
                relations: [
                    {
                        key: 'clientId',
                        field: 'authorizedApis',
                        child: {
                            schema: 'Api',
                            key: 'apiId',
                            queries: ['identityhubAPI']
                        }
                    }
                ]

            },
            {
                data: { name: 'Test Client', clientId: 'testclient' },
                relations: [
                    {
                        key: 'clientId',
                        field: 'authorizedApis',
                        child: {
                            schema: 'Api',
                            key: 'apiId',
                            queries: ['testapi']
                        }
                    }
                ]
            }
        ],
        Api: [
            {
                data: { name: 'Identity API', apiId: 'identityhubAPI' },
                relations: []

            },
            {
                data: { name: 'Test API', apiId: 'testapi' },
                relations: []
            }
        ],
        Provider: [{ data: { providerType: 'google' }, relations: [] }],
       
    }
} 
