const app = getApp()
const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemManagement')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../../images/user-unlogin.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(app.globalData.userType)
    // this.data.userType = app.globalData.userType
    this.setData({
      avatarUrl:app.globalData.avatarUrl,
      userType: app.globalData.userType
    })
    col.doc(app.globalData.userId).get().then(res => {
      console.log(res.data)
      this.setData({
        nickname: res.data.nickname,
        username: res.data.username,

        // academyName: res.data.academyId,
        // branchDepartmentName: '信息第一党支部',
        // className: '计算机154班',
        // contactName: res.data.contartPersonId,
        partyMemberType: res.data.partyMemberType
      })

      if (res.data.academyId) {
        col.doc(res.data.academyId).get().then(res => {
          this.setData({
            academyName: res.data.name
          })
        })
      }

      if (res.data.branchDepartmentId) {
        col.doc(res.data.branchDepartmentId).get().then(res => {
          this.setData({
            branchDepartmentName: res.data.name
          })
        })
      }

      if (res.data.classId) {
        col.doc(res.data.classId).get().then(res => {
          this.setData({
            className: res.data.name
          })
        })
      }

      if (res.data.contartPersonId) {
        col.doc(res.data.contartPersonId).get().then(res => {
          this.setData({
            contartPersonName: res.data.nickname
          })
        })
      }
    })
  },

})