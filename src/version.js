const cookies = require('cookies-js')

let isAndroid = /Android/i.test(window.navigator.userAgent)
let isIOS = /iPhone/i.test(window.navigator.userAgent)
let isApp = false

isApp = !!(cookies.get('isFromApp') || 0)

function versionCompare(currVersion, afferentVerison) {
    if (!currVersion || !afferentVerison) {
        return !currVersion ? -1 : 1
    }
    if (currVersion === afferentVerison) {
        return 0
    }
    let currArr = currVersion.split('.')
    let afferentArr = afferentVerison.split('.')
    let currLength = currArr.length
    let afferentLength = afferentArr.length
    let longestLength = currLength > afferentLength ? currLength : afferentLength
    for (let i = 0; i < longestLength; i++) {
        if (i == currArr.length) {
            return -1
        }
        if (i == afferentLength.length) {
            return 1
        }
        let currValue = currArr[i]
        let afferentValue = afferentArr[i]
        if (currValue > afferentValue) {
            return 1
        } else if (currValue < afferentValue) {
            return -1
        }
    }
    if (longestLength === currLength) {
        return 1
    }
    if (longestLength === afferentLength) {
        return -1
    }
}
// 获取当前 App版本号
function getCurrentAppVersion() {
    let vn = '1.0.0.0' //默认设置版本
    try {
        let appEnv = cookies.get('appEnv')
        if (appEnv) {
            appEnv = JSON.parse(appEnv)
            vn = appEnv.vn
        }
    } catch (error) {
        // 版本号parse失败
    }
    return vn
}

// 当前版本号是否大于等于指定版本
function appVersionCompare(version) {
    if (isApp) {
        let current = getCurrentAppVersion()
        return (versionCompare(current, version) >= 0)
    }
    return false
}
// 当前版本号是否小于指定版本
function appVersionCompareLessThan(version) {
    if (isApp) {
        let current = getCurrentAppVersion()
        return (versionCompare(current, version) < 0)
    }
    return false
}
export default {
    isAndroid: isAndroid,
    isIOS: isIOS,
    isApp: isApp,
    vn: getCurrentAppVersion(),
    appVersionCompare: appVersionCompare,
    appVersionCompareLessThan: appVersionCompareLessThan
}