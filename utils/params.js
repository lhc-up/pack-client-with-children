// 参数格式
const params = {
    clients: [
        // 按标识查找，如果存在，则更新，如果不存在，则新增
        {
            name: '国家义务教育质量监测网络测试系统',
            identification: 'eachinacoreframe',
            copyright: '科大讯飞',
            description: '国家监测客户端',
            iconImg: 'zip file relative path',
            versionCode: '1.3.5',
            bigVersionFile: 'zip file relative path',
            smallVersionFile: 'zip file relative path',
            isEncrypt: '0',
            apps: [
                // 按标识查找，如果存在，则更新，如果不存在，则新增
                {
                    applicationName: '网络测试系统',
                    identification: 'questionaire',
                    iconImg: 'zip file relative path',
                    description: '网络测试系统',
                    // 需要比当前存在的应用版本高，否则报错提示
                    version: '1.3.5',
                    file: 'zip file relative path',
                    isEncrypt: '0'
                },
                {
                    applicationName: '英语测试系统',
                    identification: 'english',
                    iconImg: 'zip file relative path',
                    description: '英语测试系统',
                    version: '1.3.5',
                    file: 'zip file relative path',
                    isEncrypt: '0'
                }
            ]
        },
        {
            name: '国家义务教育质量监测网络测试系统',
            identification: 'eachinacoreframe-linux-arm64',
            copyright: '科大讯飞',
            description: '国家监测客户端',
            iconImg: 'zip file relative path'
            /// ...
        }
    ]
};


function genClientParams() {
    
}