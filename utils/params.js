// 参数格式
const params = {
    clients: [
        // 按标识查找，如果存在，则更新，如果不存在，则新增
        {
            clientName: '客户端名称',
            identification: '客户端标识',
            copyright: '版权',
            description: '描述',
            iconImg: 'zip file relative path',
            versionCode: '1.3.5',
            bigVersionFile: 'zip file relative path',
            smallVersionFile: 'zip file relative path',
            isEncrypt: '0',
            apps: [
                // 按标识查找，如果存在，则更新，如果不存在，则新增
                {
                    applicationName: '子应用名称',
                    identification: '子应用标识',
                    iconImg: 'zip file relative path',
                    description: '描述',
                    // 需要比当前存在的应用版本高，否则报错提示
                    versionCode: '1.3.5',
                    versionFile: 'zip file relative path',
                    isEncrypt: '0'
                },
            ]
        },
    ]
}