const app = getApp()
const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemManagement')

Page({

  data: {
    // 用户
    // userInfo: null,
    userId: null,
    userType: null,
    openId: null,

    // 组件
    buttonTitle: '下一步',

    // 输入框
    username: null,
    password: null,

    // 验证
    isNext: false
  },


  onLoad: function(options) {
    console.log(options)
    this.setData({
      // userInfo: app.globalData.userInfo,
      openId: options.openid
    })
  },

  // 输入框绑定事件
  inputUsername(event) {
    this.changeValue('username', event.detail)
  },

  inputPassword(event) {
    this.changeValue('password', event.detail)
  },

  changeValue(name, value) {
    this.setData({
      [`${name}`]: value
    })
  },

  // 登录
  buttonClick(event) {
    console.log(this.data)

    if (!this.data.isNext) {
      // 获取用户信息
      col.where({
        type: 'user',
        username: this.data.username
      }).get().then(res => {
        if (res.data[0]) {
          console.log('用户表有记录')
          this.setData({
            userInfo: res.data[0],
            userId: res.data[0]._id,
            userType: res.data[0].userType,
            buttonTitle: '登录'
          })
        } else {
          console.log('用户表没有记录')
          this.setData({
            buttonTitle: '注册'
          })
        }
      })

      this.setData({
        isNext: true,
      })
    } else {
      // 用户表有记录：验证登录
      if (this.data.buttonTitle == '登录') {
        if (this.data.username == this.data.userInfo.username && this.data.password == this.data.userInfo.password) {
          wx.showToast({
            title: '登录成功',
            success: res => {
              app.globalData.userId = this.data.userInfo._id,
              app.globalData.userType = this.data.userType

              wx.switchTab({
                url: '../../management/managementIndex/managementIndex',
              })
            }
          })
      }
      
       else {
        wx.showToast({
          title: '密码错误',
          icon: 'loading'
        })
      }
    }
    // 用户表没有记录：注册 
    else {
      col.add({
        data: {
          // 用户信息 登录
          username: this.data.username,
          password: this.data.password,

          // 用户信息 基本
          avatarUrl: this.data.userInfo.avatarUrl,
          nickName: this.data.userInfo.nickName,
          gender: this.data.userInfo.gender,

          // 用户信息 地址
          country: this.data.userInfo.country,
          province: this.data.userInfo.province,
          city: this.data.userInfo.city,

          // 用户信息 类型
          type: '用户',
          userType: '学生',
          studentType: '群众'
        }
      }).then(res => {
        app.globalData.userId = res._id
      })


      wx.showToast({
        title: '注册成功',
        success: res => {
          wx.switchTab({
            url: '../../management/managementIndex/managementIndex',
          })
        }
      })
    }

  }

},

//
buttonClear() {
  this.setData({
    isNext: false,
    buttonTitle: '下一步',
    username: null,
    password: null,
    userId: null
  })
}
})