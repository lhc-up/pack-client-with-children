const config = {
    name: '国家监测',
    env: 'release',
    installers: [
        {
            name: 'eachinaclientframe',
            version: '1.4.0',
            sign: true,
            targets: [
                'linux-x64',
                'linux-arm64',
                'linux-loong64',
                // 'win-ia32'
            ],
            children: [
                {
                    name: "questionnaire-answer-v3.0",
                    version: "2.6.5",
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
        }
    ],
}

module.exports = config;