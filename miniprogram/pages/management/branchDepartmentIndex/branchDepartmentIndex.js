const db = wx.cloud.database()
const _ = db.command
const col = db.collection('colPartyMemberSystemManagement')

Page({

  data: {
    type: null,
    typeName: null,

    managementList: null
  },

  onLoad: function(options) {
    // console.log(options)
    if (options.type == 'branchDepartment') {
      this.setData({
        type: 'branchDepartment',
        typeName: '支部'
      })
    } else if (options.type == 'class') {
      this.setData({
        type: 'class',
        typeName: '班级'
      })
    } else {

    }

  },

  onShow: function() {
    col.where({
      type: this.data.type
    }).get().then(res => {
      this.setData({
        managementList: res.data
      })

      for (let i in this.data.managementList) {
        col.doc(this.data.managementList[i].parentId).get().then(res2 => {
          this.setData({
            [`managementList[${i}].parentName`]: res2.data.name
          })
        })
      }
    })
  },

  onSearchBranchDepartment(event) {
    col.where(
      {
        type: this.data.type,
        name: db.RegExp({
          regexp: event.detail,
          options: 'i'
        })
      }
      // _.or([{
      //   type: this.data.type,
      //   name: db.RegExp({
      //     regexp: event.detail,
      //     options: 'i'
      //   })
      // }, {
      //     type: this.data.type,
      //     academyId: db.RegExp({
      //       regexp: "988c1b1b5ccfa35a0cd8b2f2426d9197",
      //       options: 'i'
      //     })
      // }])
    ).get().then(res => {
      this.setData({
        managementList: res.data
      })
    })
  },

  // update or delete event
  onClickItem(event) {
    wx.navigateTo({
      url: '../branchDepartmentManagement/branchDepartmentManagement?id=' + event.target.dataset.id + '&type=' + this.data.type,
    })
  },

  onClickAdd(event) {
    wx.navigateTo({
      url: '../branchDepartmentManagement/branchDepartmentManagement?type=' + this.data.type,
    })
  },


})