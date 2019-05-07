const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemManagement')

Page({

  data: {
    managementList: null
  },

  onLoad: function(options) {},

  onShow: function() {
    col.where({
      type: 'academy'
    }).get().then(res => {
      this.setData({
        managementList: res.data
      })
    })
  },

  onSearchAcademy(event) {
    col.where({
      type: 'academy',
      name: db.RegExp({
        regexp: event.detail,
        options: 'i'
      })
    }).get().then(res => {
      this.setData({
        managementList: res.data
      })
    })
  },

  // update or delete event
  onClickItem(event) {
    wx.navigateTo({
      url: '../academyManagement/academyManagement?id=' + event.target.dataset.id,
    })
  },

  onClickAdd(event) {
    wx.navigateTo({
      url: '../academyManagement/academyManagement',
    })
  }

})