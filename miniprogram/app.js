
App({
  onLaunch: function () {
    this.cloudInit();
    this.getUserInfo();
  },
  // cloudInit 初始化云开发配置
  // 调用 wx.cloud.init 传入 traceUser 为 true 代表记录用户到后台中。
  cloudInit: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env:"test-5qtqr",
        traceUser: true
      })
    }
  },
  getUserInfo: function() {
    return new Promise((resolve, reject)=> {
      if(this.globalData.openid){
        resolve(this.globalData.userInfo)
        return
      }
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                this.getOpenid();
                this.globalData.userInfo = res.userInfo;
                resolve(res.userInfo)
              }
            })
          }else{
            console.log('用户未授权');
          }
        }
      })
    });
  },
  getOpenid: function() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid;
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  globalData: {
    userInfo: {},
    openid: '',
  }
})