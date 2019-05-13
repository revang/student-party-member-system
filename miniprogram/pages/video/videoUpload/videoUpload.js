import Toast from '../../../utils/vant-weapp/toast/toast'

const regeneratorRuntime = require("../../../utils/regeneratorRuntime.js")

const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemMaterial')

Page({

  data: {
    // base info
    title: null,
    // videoUrl: null,
    // imageUrl: null,

    // video/image filename(cloud object storage), 15 bit random number
    roundTitle: Math.round(Math.random() * Math.pow(10, 15)).toString(),

    // choose video resources info
    videoTempPath: null,
    videoCloudPath: null,
    duration: null,

    // choose image resources info
    imageTempPath: null,
    imageCloudPath: null,
  },

  onLoad: function (options) {
    // get video info
    // if (options.id) {
    //   col.doc(options.id).get().then(res => {
    //     console.log(res.data)
    //     this.setData({
    //       id: options.id,
    //       title: res.data.title,
    //       videoUrl: res.data.videoUrl,
    //       imageUrl: res.data.imageUrl,
    //       videoTempPath: '选择',
    //       imageTempPath: '选择'
    //     })
    //   })
    // }
  },

  inputTitle(event) {
    // console.log('update title: ' + event.detail)
    this.setData({
      title: event.detail
    })
  },

  chooseVideoRes(event) {
    console.log('choose video resources.')
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: res => {
        console.log('tempPath: ' + res.tempFilePath + '; duration: ' + Math.round(res.duration))
        this.setData({
          videoTempPath: res.tempFilePath,
          videoCloudPath: 'partymember-dev/videos/' + this.data.roundTitle + '/video.mp4',
          duration: Math.round(res.duration),
        })
      }
    })
  },

  chooseImageRes(event) {
    console.log('choose image resources.')
    wx.chooseImage({
      success: res => {
        console.log('tempPath: ' + res.tempFilePaths[0])
        this.setData({
          imageTempPath: res.tempFilePaths[0],
          imageCloudPath: 'partymember-dev/videos/' + this.data.roundTitle + '/image.jpg',
        })
      }
    })
  },

  // upload video and image resources
  uploadFileRes(cloudPath, tempPath) {
    return new Promise(function (resolve, reject) {
      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: tempPath
      }).then(res => {
        resolve(res.fileID)
      })
    })
  },

  // update video and image resources, then insert document
  async uploadFileResSync() {
    // show toast
    const toast = Toast({
      type: 'loading',
      message: '正在上传',
      loadingType: 'spinner',
      duration: 0,
      selector: '#van-toast'
    })

    // step 1: upload video/image resources
    let videoUrl = await this.uploadFileRes(this.data.videoCloudPath, this.data.videoTempPath)
    let imageUrl = await this.uploadFileRes(this.data.imageCloudPath, this.data.imageTempPath)
    let results = await Promise.all([videoUrl, imageUrl])

    // step 2: insert document
    col.add({
      data: {
        type: '视频',
        title: this.data.title,
        videoUrl: results[0],
        imageUrl: results[1],
        duration: this.data.duration,
        updateDate: new Date()
      }
    }).then(res => {
      // update toast
      toast.setData({
        type: 'success',
        message: '上传成功',
      })

      // hide toast
      toast.clear()
    })
  },

  buttonAdd() {
    console.log('update video and image resources, then insert document.')

    this.uploadFileResSync()

    // this is not a good method.
    // // step 1: upload video resources
    // wx.cloud.uploadFile({
    //   cloudPath: this.data.videoCloudPath,
    //   filePath: this.data.videoTempPath,
    //   success: res => {
    //     console.log('videoUrl: '+res.fileID)
    //     this.setData({
    //       videoUrl: res.fileID
    //     })
    //     // step2: upload image resources
    //     wx.cloud.uploadFile({
    //       cloudPath: this.data.imageCloudPath,
    //       filePath: this.data.imageTempPath,
    //       success: res2 => {
    //         console.log('imageUrl: '+res2.fileID)
    //         this.setData({
    //           imageUrl: res2.fileID,
    //         })
    //         // insert document is a metter
    //       }
    //     })
    //   },
    // })
  },

  // buttonUpdate(event) {
  //   console.log(this.data)
  //   //update video info
  //   col.doc(this.data.id).update({
  //     data: {
  //       title: this.data.title,
  //       // videoUrl
  //       // imageUrl
  //     }
  //   }).then(res => {
  //     Toast.success('修改成功')
  //   })
  // }

})