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
                    },
                    {
                        key: 'email',
                        field: 'domains',
                        child: {
                            schema: 'Domain',
                            key: 'domainId',
                            queries: ['site!global']
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
                    },
                    {
                        key: 'email',
                        field: 'domains',
                        child: {
                            schema: 'Domain',
                            key: 'domainId',
                            queries: ['testDomain']
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
                    },
                    {
                        key: 'clientId',
                        field: 'domains',
                        child: {
                            schema: 'Domain',
                            key: 'domainId',
                            queries: ['site!global']
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
                    },
                    {
                        key: 'clientId',
                        field: 'domains',
                        child: {
                            schema: 'Domain',
                            key: 'domainId',
                            queries: ['testDomain']
                        }
                    }
                ]
            }
        ],
        Api: [
            {
                data: { name: 'Identity API', apiId: 'identityhubAPI' },
                relations: [
                    {
                        key: 'apiId',
                        field: 'domain',
                        child: {
                            schema: 'Domain',
                            key: 'domainId',
                            queries: ['site!global']
                        }
                    }
                ]

            },
            {
                data: { name: 'Test API', apiId: 'testapi' },
                relations: [
                    {
                        key: 'apiId',
                        field: 'domain',
                        child: {
                            schema: 'Domain',
                            key: 'domainId',
                            queries: ['testDomain']
                        }
                    }
                ]
            }
        ],
        Provider: [{ data: { providerType: 'google' }, relations: [] }],
        Domain: [
            {
                data: { name: 'Site Global Domain', domainId: 'site!global' },
                relations: [
                    {
                        key: 'domainId',
                        field: 'users',
                        child: {
                            schema: 'User',
                            key: 'email',
                            queries: ['gsilber@cyberdaptive.com']
                        }
                    }
                ]
            },
            {
                data: { name: 'Test Domain', domainId: 'testDomain' },
                relations: [
                    {
                        key: 'domainId',
                        field: 'users',
                        child: {
                            schema: 'User',
                            key: 'email',
                            queries: ['test@test.com']
                        }
                    }
                ]
            }
        ]
    }
} 
