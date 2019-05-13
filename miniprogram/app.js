//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      // development
      avatarUrl:null,
      userType:"学生",
      userId: "96c1cbbe5cd027fb0d24d4a2261656c2"
    }
  }
})
