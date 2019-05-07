const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemManagement')

Page({

  data: {
    optionUserType: null,

    managementList: null
  },

  onLoad: function(options) {
    // console.log(options)
    if (options.userType) {
      this.setData({
        optionUserType: options.userType
      })
    }
  },

  onShow: function() {
    if (this.data.optionUserType) {
      col.where({
        type: 'user',
        userType:this.data.optionUserType
      }).get().then(res => {
        this.setData({
          managementList: res.data
        })

        for (let i in this.data.managementList) {
          if (this.data.managementList[i].academyId) {
            col.doc(this.data.managementList[i].academyId).get().then(res2 => {
              this.setData({
                [`managementList[${i}].academyName`]: res2.data.name
              })
            })
          }
          if (this.data.managementList[i].academyId) {
            col.doc(this.data.managementList[i].branchDepartmentId).get().then(res3 => {
              this.setData({
                [`managementList[${i}].branchDepartmentName`]: res3.data.name
              })
            })
          }
        }
      })
    } else {
      col.where({
        type: 'user'
      }).get().then(res => {
        this.setData({
          managementList: res.data
        })

        for (let i in this.data.managementList) {
          if (this.data.managementList[i].academyId) {
            col.doc(this.data.managementList[i].academyId).get().then(res2 => {
              this.setData({
                [`managementList[${i}].academyName`]: res2.data.name
              })
            })
          }
          if (this.data.managementList[i].academyId) {
            col.doc(this.data.managementList[i].branchDepartmentId).get().then(res3 => {
              this.setData({
                [`managementList[${i}].branchDepartmentName`]: res3.data.name
              })
            })
          }
        }
      })
    }
  },

  onSearchBranchDepartment(event) {
    col.where({
      type: 'user',
      nickname: db.RegExp({
        regexp: event.detail,
        options: 'i'
      })
    }).get().then(res => {
      this.setData({
        managementList: res.data
      })

      for (let i in this.data.managementList) {
        col.doc(this.data.managementList[i].academyId).get().then(res2 => {
          this.setData({
            [`managementList[${i}].academyName`]: res2.data.name
          })
        })

        col.doc(this.data.managementList[i].branchDepartmentId).get().then(res3 => {
          this.setData({
            [`managementList[${i}].branchDepartmentName`]: res3.data.name
          })
        })
      }
    })
  },

  // update or delete event
  onClickItem(event) {
    wx.navigateTo({
      url: '../userManagement/userManagement?id=' + event.target.dataset.id,
    })
  },

  onClickAdd(event) {
    wx.navigateTo({
      url: '../userManagement/userManagement',
    })
  },


})