const app = getApp()
const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemMaterial')

Page({
  data: {
    videoList: [],

    // chooseItem
    chooseItemId: null,
    chooseItemTitle: null,

    // action select info
    // show: false,
    // actions: [{
    //   name: '观看视频'
    // },
    // {
    //   name: '修改视频信息'
    // },
    // {
    //   name: '删除视频'
    // }
    // ]
  },

  onLoad: function (options) {
    // // get userType
    this.setData({
      userType: app.globalData.userType,
      // userId: app.globalData.userId
    })
  },

  onSearchVideo(event) {
    col.where({
      type: '视频',
      title: db.RegExp({
        regexp: event.detail,
        options: 'i'
      })
    }).get().then(res => {
      this.setData({
        videoList: res.data
      })
    })
  },

  onShow() {
    // get videoList
    col.where({
      type: '视频',
    }).get().then(res => {
      // console.log('video list:')
      // console.log(res.data)
      // clear videoList
      this.data.videoList = []

      for (let i = 0; i < res.data.length; i++) {
        this.data.videoList.push({
          _id: res.data[i]._id,
          title: res.data[i].title,
          updateDate: res.data[i].updateDate.toLocaleDateString(),
          duration: res.data[i].duration
        })

        // get state
        col.where({
          type: '视频播放',
          videoId: res.data[i]._id,
          userId: app.globalData.userId,
          state: true
        }).get().then(res => {
          // if (res.data[0]) {
          //   this.setData({
          //     [`videoList[${i}].state`]: true
          //   })
          // } else {
          //   this.setData({
          //     [`videoList[${i}].state`]: false
          //   })
          // }
          if (res.data[0]) {
            this.data.videoList[i].state = true
          } else {
            this.data.videoList[i].state = false
          }
          this.setData({
            videoList: this.data.videoList
          })
        })
      }

      this.setData({
        videoList: this.data.videoList
      })
    })
  },

  onClickNavigateToPlay(event) {
    // console.log("video id: " + event.target.dataset.id)
    wx.navigateTo({
      url: '../videoPlay/videoPlay?id=' + event.target.dataset.id,
    })
  },

  // getOptions(event) {
  //   // console.log(event.target.dataset.id)
  //   this.setData({
  //     chooseItemId: event.target.dataset.id,
  //     chooseItemTitle: event.target.dataset.title,
  //     show: true
  //   })
  // },

  // // action select
  // onSelect(event) {
  //   console.log(this.data.chooseItemId);
  //   console.log(event.detail.name)
  //   if (event.detail.name == '观看视频') {
  //     wx.navigateTo({
  //       url: '../videoPlay/videoPlay?id=' + this.data.chooseItemId,
  //     })
  //   } else if (event.detail.name == '修改视频信息') {
  //     wx.navigateTo({
  //       url: '../videoManagement/videoManagement?id=' + this.data.chooseItemId,
  //     })
  //   } else if (event.detail.name == '删除视频') {

  //   } else {
  //     // null
  //   }

  //   this.setData({
  //     show: false
  //   })
  // },

  // onClose() {
  //   this.setData({
  //     show: false
  //   });
  // },

  buttonAdd() {
    wx.navigateTo({
      url: '../videoUpload/videoUpload',
    })
  }


})