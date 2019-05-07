import Toast from '../../../utils/vant-weapp/toast/toast'

const app=getApp()

const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemMaterial')

Page({

  data: {
    type:null,
    typeName:null,

    title: null,

    documentRes: null,

    documentTypeList: ['入党申请书', '入党志愿书', '转正申请书', '思想汇报'],
    documentType: null,
    documentshow: false,

    date: null,
    timeshow: false,
    currentDate: new Date(),
    minDate: new Date(2018, 0, 1).getTime()
  },

  onLoad: function(options) {
    if(options.type){
      if(options.type=='document'){
        this.setData({
          type:'document',
          typeName:'文档'
        })
      } else if (options.type == 'activity') {
        this.setData({
          type: 'activity',
          typeName: '志愿活动',
        })
      }
    }
  },

  // title event
  onClickTitle(event) {
    this.setData({
      title: event.detail
    })
  },

  // choose document res, event
  onClickShowDocumentType(event) {
    this.setData({
      documentshow: true
    })
  },
  onChangeDocument(event) {
    this.setData({
      documentType: event.detail.value
    })
  },
  onConfirmDocument(event) {
    this.setData({
      documentType: event.detail.value,
      documentshow: false
    })
  },
  onCancelDocument(event) {
    this.setData({
      documentType: null,
      documentshow: false
    })
  },



  // time
  onClickShowDate() {
    this.setData({
      timeshow: true
    })
  },


  onConfirmDate(event) {
    const {
      detail,
      currentTarget
    } = event;
    this.setData({
      date: this.getResult(detail, currentTarget.dataset.type),
      timeshow: false
    })
  },

  onCancelDate(event) {
    const {
      detail,
      currentTarget
    } = event;
    this.setData({
      date: null,
      timeshow: false
    })
  },

  getResult(time, type) {
    const date = new Date(time);
    switch (type) {
      case 'datetime':
        return date.toLocaleString();
      case 'date':
        return date.toLocaleDateString();
      case 'year-month':
        return `${date.getFullYear()}/${date.getMonth() + 1}`;
      case 'time':
        return time;
      default:
        return '';
    }
  },



  onClickChooseDocument() {
    wx.chooseImage({
      success: res => {
        let dateNumber = new Date().getTime()
        let documentCloudPath = 'storagePartyMemberSystemMaterial/document/' + dateNumber + res.tempFilePaths[0].substr(res.tempFilePaths[0].lastIndexOf('.'))
        let documentTempPath = res.tempFilePaths[0]

        wx.showLoading({
          title: '数据加载中',
        })

        wx.cloud.uploadFile({
          cloudPath: documentCloudPath,
          filePath: documentTempPath,
          success: res => {
            this.setData({
              documentRes: res.fileID
            }, res => {
              wx.hideLoading()
            })
          }
        })
      }
    })
  },

  onClickSubmit() {
    col.add({
      data:{
        type: 'document',
        title: this.data.title,
        documentType: this.data.documentType,
        documentRes: this.data.documentRes,
        date: this.data.date,
        userId: app.globalData.userId
      }
    }).then(res=>{
      Toast.success('添加成功')
    })
  }
})