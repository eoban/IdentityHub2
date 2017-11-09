module.exports = {
    collections: {
        User: require('../models/auth/user'),
        Api: require('../models/auth/api'),
        Client: require('../models/auth/client'),
        Provider: require('../models/auth/provider')
    },
    data: {
        User: [
            {
                data: { email: 'gsilber@cyberdaptive.com', password: 'test',roles: [
                    {roletype: 'client', parentId: 'identityhubUI',roles:['user','admin']},
                    {roletype: 'api', parentId: 'identityhubAPI',roles:['user','admin']}
                ] },
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
