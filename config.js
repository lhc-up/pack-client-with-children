const config = {
    env: 'test',
    children: [
        // {
        //     name: "questionnaire-answer-v3.0",
        //     version: "2.60.3",
        //     // 默认develop
        //     branch: 'develop',
        // },
        {
            name: 'eachinaenglishclient',
            version: '1.0.1'
        },
        // {
        //     name: 'eachinaMusicClient',
        //     version: '1.3.3'
        // }
    ],
    installers: [
        {
            name: 'eachinaclientframe',
            version: '1.9.0',
            // 如果为false，则表示不打包子应用，只打包installer；
            // 如果为true，则表示打包子应用，且打包的子应用为config.children中的所有子应用；
            includeChild: true,
            targets: [
                'linux-x64',
                // 'linux-arm64',
                // 'linux-loong64',
                // 'win-ia32'
            ]
        },
        {
            name: 'questionnaire-answer-v3.0',
            version: '2.100.3',
            includeChild: false,
            targets: [
                // 'linux-x64',
                // 'linux-arm64',
                // 'linux-loong64',
                'win-ia32'
            ]
        }
    ],
}

module.exports = config;