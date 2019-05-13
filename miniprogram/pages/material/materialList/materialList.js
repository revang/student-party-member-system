const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemMaterial')
const colManagement = db.collection('colPartyMemberSystemManagement')

Page({

  data: {
    type: null,
    typeName: null,

    materialList: []
  },

  onLoad: function(options) {
    if (options.type){
      if (options.type =='document'){
        this.setData({
          type: 'document',
          typeName: '文档',
        })
      } else if (options.type == 'activity'){
        this.setData({
          type: 'activity',
          typeName: '志愿活动',
        })
      }
    }
  },

  onShow(){
    col.where({
      type: 'document'
    }).get().then(res => {
      this.setData({
        materialList: res.data
      })

      for (let i in this.data.materialList) {
        col.where({
          type: 'documentReview',
          materialId: this.data.materialList[i]._id
        }).get().then(res2 => {
          if (res2.data[0]) {
            this.data.materialList[i].reviewState = res2.data[0].reviewState
          } else {
            this.data.materialList[i].reviewState = null
          }
          this.setData({
            materialList: this.data.materialList
          })
        })

        colManagement.doc(this.data.materialList[i].userId).get().then(res2 => {
          this.setData({
            [`materialList[${i}].nickname`]: res2.data.nickname
          })

          colManagement.doc(res2.data.academyId).get().then(res3 => {
            this.setData({
              [`materialList[${i}].academyName`]: res3.data.name
            })
          })

          colManagement.doc(res2.data.classId).get().then(res3 => {
            this.setData({
              [`materialList[${i}].className`]: res3.data.name
            })
          })

        })
      }
    })
  },

  onSearchMaterial(event) {
    col.where({
      type: this.data.type,
      title: db.RegExp({
        regexp: event.detail,
        options: 'i'
      })
    }).get().then(res => {
      this.setData({
        materialList: res.data
      })

      for (let i in this.data.materialList) {
        colManagement.doc(this.data.materialList[i].userId).get().then(res2 => {
          this.setData({
            [`materialList[${i}].nickname`]: res2.data.nickname
          })

          colManagement.doc(res2.data.academyId).get().then(res3 => {
            this.setData({
              [`materialList[${i}].academyName`]: res3.data.name
            })
          })

          colManagement.doc(res2.data.classId).get().then(res3 => {
            this.setData({
              [`materialList[${i}].className`]: res3.data.name
            })
          })

        })
      }
    })
  },

  onClickItem(event) {
    wx.navigateTo({
      url: '../materialReview/materialReview?id=' + event.target.dataset.id,
    })
  }

})