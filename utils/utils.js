const path = require('path');
const fs = require('fs');
function getChildPkg(root) {
    const folder = path.join(root, 'pack');
    const list = fs.readdirSync(folder);
    const p = list.find(v => v.startsWith('child-') && v.endsWith('.asax'));
    return path.join(folder, p);
}

function getInstaller(root) {
    const folder = path.join(root, 'pack');
    const list = fs.readdirSync(folder);
    const extensions = ['.exe', '.deb', '.rpm', '.dmg', '.pkg'];
    const installer = list.find(v => extensions.some(ext => v.endsWith(ext)));
    return {
        installer: path.join(folder, installer),
        smallPkg: path.join(folder, list.find(v => v.endsWith('.asax'))),
    };
}

function formatTime(t) {
    if (typeof t !== 'object') t = new Date(time);
    const date = t.toLocaleDateString().replace(/\//g, '-');
    const time = t.toLocaleTimeString().replace(/:/g, '-');
    return `${date}-${time}`;
}

function formatNow() {
    return formatTime(new Date());
}

module.exports = {
    getChildPkg,
    getInstaller,
    formatTime,
    formatNow,
}