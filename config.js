const config = {
    env: 'test',
    children: [
        {
            name: "questionnaire-answer-v3.0",
            version: "2.60.3"
        },
        {
            name: 'eachinaenglishclient',
            version: '1.0.1'
        },
        {
            name: 'eachinaMusicClient',
            version: '1.3.3'
        }
    ],
    installers: [
        {
            name: 'eachinaclientframe',
            version: '1.9.0',
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