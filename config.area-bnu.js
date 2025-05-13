const config = {
    env: 'release',
    installers: [
        {
            name: 'eachinaclientframe',
            version: '1.0.0',
            sign: false,
            branch: 'support/bnu-area-2025',
            targets: [
                'linux-x64',
                'linux-arm64',
                'linux-loong64',
            ],
            children: [
                {
                    name: "questionnaire-answer-v3.0",
                    version: "1.0.0",
                    branch: 'support/bnu-area-2025',
                },
            ]
        }
    ],
}

module.exports = config;