import Toast from '../../../utils/vant-weapp/toast/toast'

const app = getApp()

const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemMaterial')

Page({

  data: {
    // user info
    userId: null,
    userType: null,

    // video info
    id: null,
    title: null,
    videoUrl: null,
    imageUrl: null,
    duration: null,
    updateDate: null,

    // playState: false(pause) true(continue)
    playState: false,
    playTime: 0,
    isPlayed: false,

  },

  onLoad: function(options) {
    // // get userInfo
    // this.setData({
    //   userId: app.globalData.userId,
    //   userType: app.globalData.userType
    // })

    console.log(options.id)

    col.doc(options.id).get().then(res => {
      console.log(res.data)
      this.setData({
        id: options.id,
        title: res.data.title,
        videoUrl: res.data.videoUrl,
        imageUrl: res.data.imageUrl,
        duration: res.data.duration,
        updateDate: res.data.updateDate.toLocaleDateString()
      })
    })

    const timer = setInterval(() => {
      if (this.data.playState == true) {
        this.data.playTime++
      }
      console.log('video play time: ' + this.data.playTime)
    }, 1000)

    if (this.data.isPlayEnd == true) {
      clearInterval(timer)
    }

  },

  modifyVideoState() {
    this.setData({
      playState: !this.data.playState,
    })
  },

  start() {
    this.modifyVideoState()
  },

  pause() {
    this.modifyVideoState()
  },

  stop() {
    this.setData({
      playState: false
    })


    // compart play time and video duration
    if (this.data.playTime >= this.data.duration * 0.9) {
      this.setData({
        isPlayed: true
      })
      Toast.success('播放成功')
    } else {
      Toast.fail('播放失败')
    }

    // insert document(video play document)
    // col.add({
    //   data: {
    //     type: '视频播放',
    //     videoId: this.data.id,
    //     userId: this.data.userId,
    //     state: this.data.isPlayed,
    //     updateDate: new Date()
    //   }
    // })

  }

})