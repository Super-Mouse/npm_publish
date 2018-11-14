import Version from './src/version.js';

let callbackList = [];
window['VKAppBridge'] = {};
let vkappbridge = window.VKAppBridge;
vkappbridge['receiveFromNative'] = function(res) {
  try {
    let response = JSON.parse(res);
    if (response.callbackId && response.method === 'web/is_load_ready') {
      appExe('vkappbridge://__bridge_callback__#' + response.callbackId)
    }
    for (let index = 0; index < callbackList.length; index++) {
      if (callbackList[index].id === response.responseId) {
        response.responseData.code !== 200 ? callbackList[index].reject(response.responseData) : callbackList[index].resolve(response.responseData);
        callbackList.splice(index, 1);
        break
      }
    }
  } catch (error) {
    // 回传结果pares失败
  }
};

function appExe(command, cb) {
  return new Promise((resolve, reject) => {
    let callback = new URL(command);
    let iframe = getIframe();
    if (callback.hash) {
      let callbackid = callback.hash.replace('#', '');
      callbackList.push({ id: callbackid, callback: cb, resolve: resolve, reject: reject })
    }
    iframe.contentWindow.location.replace(command)
  })
}

function getIframe() {
  let appBridgeIframe = document.createElement('iframe');
  appBridgeIframe.setAttribute('id', 'appBridgeIframe');
  appBridgeIframe.style.visibility = 'invisible';
  appBridgeIframe.style.display = 'none';
  appBridgeIframe.style.height = '0';
  appBridgeIframe.style.width = '0';
  document.body.appendChild(appBridgeIframe);
  setTimeout(() => {
    document.body.removeChild(appBridgeIframe)
  }, 5000);
  return appBridgeIframe
}

const appBack = ()=> {
  appExe('vkappbridge://history/back')
};

const showToast = (toastTxt, toastTime)=> {
  let toast = toastTxt;
  let duration = toastTime;
  appExe(`vkappbridge://toast/show?text=${toast}&duration=${duration}`)
};

const phoneCall = (phoneNum)=> {
  appExe('vkappbridge://phone/call?phone_number=' + phoneNum)
};

const applyPermission = ()=> {
  return new Promise((resolve, reject)=>{
    appExe('vkappbridge://apply/permission?permissions=album|camera#' + 'function_' + new Date().getTime())
      .then(data => {
        resolve(data)
      }).catch(err=>{
        reject(err)
    })
  })
};

const getNetworkType = ()=> {
  return new Promise((resolve, reject)=>{
    appExe('vkappbridge://net/gettype#' + 'function_' + new Date().getTime())
      .then(data => {
        resolve(data)
      }).catch(err=>{
        reject(err)
    })
  })

};

/**
 * ios 跳转 需要找ios开发配置
 * android 全量跳转
 * vkparent 协议
 * @param url
 */
const gotoUrl = (url)=> {
  appExe(`vkparent://${url}`)
};

const videoPlay = (vTiele, vUrl)=> {
  var title = vTiele;
  var url = vUrl;
  appExe('vkappbridge://video/play?video_url=' + url + '&title=' + title + '&start_time='
    + 1111122222)
};

/**
 * userLogout 调用APP做登出操作
 * @param {number} phoneNum 手机号(必填)
 * @param {string} type 登入时的类型type = sms短信 / pwd密码 default = sms
 */
const userLogout = (phoneNum, type)=> {
  var _type = type === 'pwd' ? 'pwd' : 'sms';
  var _phone = phoneNum;
  appExe('vkappbridge://user/logout?loginType=' + _type + '&phone=' + _phone)
};

const shareInfo = (title, description, thumbnail, link)=> {
  return new Promise((resolve, reject)=>{
    appExe('vkappbridge://share/info?title=' + title + '&description=' + description + '&thumbnail=' + thumbnail + '&link=' + link + '#function_' + new Date().getTime())
    .then(data => {
      resolve(data)
    }).catch(err=>{
      reject(err)
    })
  })
};

// 调用 native支付
const pingpp = (channel, paydata)=> {
  return new Promise((resolve, reject)=>{
    let pingppchannel = channel === 'alipay' ? 'alipay' : 'wechat'
    let pingppdata = JSON.stringify(paydata);
    appExe('vkappbridge://pay/pingpp?channel=' + pingppchannel + '&data=' + pingppdata + '#function_' + new Date().getTime())
      .then(data => {
        resolve(data)
      }).catch(err=>{
        reject(err)
    })
  })
};

// 调用 native支付 支付宝网页支付拦截唤醒支付宝
const payIntercapt = (channel)=> {
  return new Promise((resolve, reject)=>{
    appExe('vkappbridge://pay/intercept?channel=' + channel + '#function_' + new Date().getTime())
      .then(data => {
        resolve(data)
      }).catch(err=>{
        reject(err)
    })
  })
};

// 调用 隐藏app底部菜单栏
const tabbarVisibility = (isVisible)=> {
  return new Promise((resolve, reject)=>{
    appExe('vkappbridge://app.tabbar/visibility?function=booklist&isVisible=' + isVisible + '#function_' + new Date().getTime())
      .then(data => {
        resolve(data)
      }).catch(err=>{
        reject(err)
    })
  })
};

// 调用 隐藏app底部菜单栏
const webLoadReady = ()=> {
  appExe('vkappbridge://app.web/load_ready')
};

//新开webview hybrid 2.0.1
const newWebview = (url, target)=> {
  appExe(`vkappbridge://app/openURL?url=${url}&target=${target}`)
};

/**
 * trackClick 触发点击事件埋点记录能力
 * @param {number} clickId 点击事件id，神策记录使用
 * @param {object} params 其他需要统计到埋点的相关信息,采用字典结构
 */
const trackClick = (clickId, params)=> {
  appExe(`vkappbridge://track/click?clickId=${clickId}&params=${JSON.stringify(params)}`)
};

/**
 * trackTrigger 触发事件埋点记录能力
 * @param {number} triggerId 触发事件id，神策记录使用
 * @param {object} params 其他需要统计到埋点的相关信息,采用字典结构
 */
const trackTrigger = (triggerId, params)=> {
  appExe(`vkappbridge://track/trigger?triggerId=${triggerId}&params=${JSON.stringify(params)}`)
};

/**
 * trackPageview 页面生命周期事件变动记录能力
 * @param {string} pageName 统计用的页面标示，可以使用url或者独立配置
 * @param {string} pageEvent 页面生命周期节点，目前可用的有enter\exit
 * @param {object} params 其他需要统计到埋点的相关信息,采用字典结构
 */
const trackPageview = (pageName, pageEvent, params)=> {
  appExe(`vkappbridge://track/pageview?pageName=${pageName}&event=${pageEvent}&params=${JSON.stringify(params)}`)
};

//Android 升级接口
const androidUpVer = (upgradeInfo)=> {
  appExe(`vkappbridge://upgrade/showTips?upgradeInfo=${upgradeInfo}`)
};

//IOS 查询安装对应scheme的应用
const iosScheme = (scheme)=> {
  return new Promise((resolve, reject)=>{
    appExe(`vkappbridge://apply/scheme?scheme=${scheme}#function_${new Date().getTime()}`)
      .then(data => {
        resolve(data)
      }).catch(err=>{
        reject(err)
    })
  })
};

//IOS 打开对应scheme的应用
const iosOpenScheme = (scheme, installScheme)=> {
  appExe(`vkappbridge://apply/openScheme?installSchemeURL=${scheme}&uninstallSchemeURL=${installScheme}`)
};

// js一加载就调用ready
setTimeout(function() {
  appExe('vkappbridge://__bridge_ready__')
}, 500);



export {phoneCall, showToast, applyPermission, getNetworkType, videoPlay, userLogout, shareInfo, gotoUrl, pingpp, payIntercapt, tabbarVisibility, webLoadReady, appBack, newWebview, trackClick, trackTrigger, trackPageview, androidUpVer, iosScheme, iosOpenScheme}
