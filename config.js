const config = {
    env: 'test',
    children: [
        "questionnaire-answer-v3.0",
        "eachinaenglishclient",
        "eachinaMusicClient"
    ],
    parent: 'eachinaclientframe',
    targets: [
        'linux-x64',
        'linux-arm64',
        'linux-loong64',
        'win-ia32'
    ]
}

module.exports = config;