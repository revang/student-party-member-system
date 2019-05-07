import Toast from '../../../utils/vant-weapp/toast/toast';

const app=getApp()

const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemMaterial')
const colManagement = db.collection('colPartyMemberSystemManagement')

Page({
  data: {
    // user information
    nickname: null,
    academyName: null,
    branchDepartmentName: null,
    className: null,
    partyMemberType: null,

    // material information
    materialId:null,
    title: null,
    documentType: null,
    documentRes: null,
    date: null,

    // van-popup component reviewState
    reviewState: null,
    reviewStateShow: false,
    reviewStateList: ['通过', '拒绝'],

    reviewState:null,
    reviewComment:null,
    
    // 操作状态：是否显示提交按钮 默认true
    operateState:true
  },

  onLoad: function(options) {
    if (options.id) {
      col.doc(options.id).get().then(res => {
        this.setData({
          materialId:res.data._id,
          title: res.data.title,
          documentType: res.data.documentType,
          documentRes: res.data.documentRes,
          date: res.data.date,
        })

        colManagement.doc(res.data.userId).get().then(res2 => {
          this.setData({
            nickname: res2.data.nickname,
            partyMemberType: res2.data.partyMemberType
          })

          colManagement.doc(res2.data.academyId).get().then(res3 => {
            this.setData({
              academyName: res3.data.name
            })
          })

          colManagement.doc(res2.data.branchDepartmentId).get().then(res3 => {
            this.setData({
              branchDepartmentName: res3.data.name
            })
          })

          colManagement.doc(res2.data.classId).get().then(res3 => {
            this.setData({
              className: res3.data.name
            })
          })
        })

        col.where({
          materialId: options.id,
          userId:app.globalData.userId
        }).get().then(res2=>{
          if(res2.data[0]){
            this.setData({
              reviewState: res2.data[0].reviewState,
              reviewComment: res2.data[0].reviewComment,
              operateState: false // 操作状态 隐藏提交按钮
            })
          }
        })
      })
    }
  },

  onClickView() {
    wx.cloud.downloadFile({
      fileID: this.data.documentRes,
      success(res2) {
        const filePath = res2.tempFilePath
        wx.openDocument({
          filePath
        })
      }
    })
  },

  // van-popup component reviewState
  onClickShowReviewState() {
    this.setData({
      reviewStateShow: true
    })
  },
  onConfirmReviewState(event) {
    this.setData({
      reviewState: event.detail.value=='通过'?true:false,
      reviewStateShow: false
    })
  },
  onCancelReviewState(event) {
    this.setData({
      reviewState: null,
      reviewStateShow: false
    })
  },

  onChangeReviewComment(event){
    this.setData({
      reviewComment:event.detail
    })
  },

  onClickSubmit(){
    col.add({
      data:{
        type: 'documentReview',
        userId:app.globalData.userId,
        materialId: this.data.materialId,
        reviewState: this.data.reviewState,
        reviewComment: this.data.reviewComment,
        reviewTime: new Date()
      }
    }).then(res=>{
      Toast.success('提交成功')
    })
  }
})