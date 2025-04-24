const config = {
    env: 'test',
    installers: [
        {
            name: 'eachinaclientframe',
            version: '1.3.1',
            targets: [
                // 'linux-x64',
                // 'linux-arm64',
                // 'linux-loong64',
                'win-ia32'
            ],
            children: [
                {
                    name: "questionnaire-answer-v3.0",
                    version: "2.6.4",
                    // 默认develop
                    branch: 'develop',
                    // icon: 'builderClient/icons/128x128.png'
                },
                {
                    name: 'eachinaenglishclient',
                    version: '1.0.2'
                },
                {
                    name: 'eachinaMusicClient',
                    version: '1.3.4'
                }
            ]
        },
        {
            name: 'eachinaclientframe',
            version: '1.4.0',
            targets: [
                // 'linux-x64',
                // 'linux-arm64',
                // 'linux-loong64',
                'win-ia32'
            ],
            children: [
                {
                    name: "questionnaire-answer-v3.0",
                    version: "2.6.4",
                    // 默认develop
                    branch: 'develop',
                    // icon: 'builderClient/icons/128x128.png'
                },
                {
                    name: 'eachinaenglishclient',
                    version: '1.0.2'
                },
                {
                    name: 'eachinaMusicClient',
                    version: '1.3.4'
                }
            ]
        },
        // {
        //     name: 'questionnaire-answer-v3.0',
        //     version: '2.100.3',
        //     includeChild: false,
        //     targets: [
        //         // 'linux-x64',
        //         // 'linux-arm64',
        //         // 'linux-loong64',
        //         'win-ia32'
        //     ]
        // }
    ],
}

module.exports = config;