const app = getApp()

Page({
  data: {
    avatarUrl: '../../../images/user-unlogin.png',
    nickName: '未授权',
  },

  onLoad: function (options) {
    // console.log(this.data)
    // 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
    // 参考：https://developers.weixin.qq.com/miniprogram/dev/api/wx.getSetting.html
    wx.getSetting({
      success: res => {
        // console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 获取用户信息。调用前需要 用户授权 scope.userInfo。
          // 参考文档：https://developers.weixin.qq.com/miniprogram/dev/api/wx.getUserInfo.html
          wx.getUserInfo({
            success: userRes => {
              // console.log(userRes)
              app.globalData.avatarUrl = userRes.userInfo.avatarUrl
              this.setData({
                avatarUrl: userRes.userInfo.avatarUrl,
                nickName: userRes.userInfo.nickName,
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function (event) {
    if (!this.authorization_state && event.detail.userInfo) {
      this.setData({
        avatarUrl: event.detail.userInfo.avatarUrl,
        nickName: event.detail.userInfo.nickName
      })
    }

    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      // console.log(res.result.openid)
      app.globalData.userInfo = event.detail.userInfo

      wx.redirectTo({
        url: '../login/login?openid=' + res.result.openid,
      })
    })
  }
})