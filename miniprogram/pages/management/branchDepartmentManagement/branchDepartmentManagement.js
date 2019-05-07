import Toast from '../../../utils/vant-weapp/toast/toast';

const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemManagement')

Page({

  data: {
    type: null,
    typeName: null,

    id: null,
    parentId: null,
    name: null,

    academyList: null,

    // 学院
    academyType: null,
    academyTypeShow: false,
    academyTypeList: null,
  },

  onLoad: function(options) {
    if(options.type){
      this.setData({
        type: options.type,
        typeName: options.type=='branchDepartment'?'支部':'班级'
      })
    }
    // wx.setNavigationBarTitle({
    //   title: '当前页面'
    // })

    if (options.id) {
      col.doc(options.id).get().then(res => {
        this.setData({
          id: res.data._id,
          parentId: res.data.parentId,
          name: res.data.name
        })

        col.doc(res.data.parentId).get().then(res2 => {
          this.setData({
            academyType: res2.data.name
          })
        })
      })
    }

    // get academyList
    col.where({
      type: 'academy'
    }).get().then(res => {
      this.setData({
        academyList: res.data
      })

      for (let i in res.data) {
        this.setData({
          [`academyTypeList[${i}]`]: res.data[i].name
        })
      }
    })
  },

  onChangeName(event) {
    this.setData({
      name: event.detail
    })
  },

  // 学院, event
  onClickShowAcademyType(event) {
    this.setData({
      academyTypeShow: true
    })
  },
  onChangeAcademyType(event) {
    this.setData({
      academyType: event.detail.value
    })
  },
  onConfirmAcademyType(event) {
    this.setData({
      academyType: event.detail.value,
      academyTypeShow: false
    })

    for (let i in this.data.academyList) {
      if (this.data.academyList[i].name == event.detail.value) {
        this.setData({
          parentId: this.data.academyList[i]._id
        })
      }
    }
  },
  onCancelAcademyType(event) {
    this.setData({
      academyType: null,
      academyTypeShow: false,
      parentId: null
    })
  },

  onClickAdd(event) {
    col.add({
      data: {
        type: this.data.type,
        parentId: this.data.parentId,
        name: this.data.name
      }
    }).then(res => {
      Toast.success('添加成功');
    })

  },

  onClickUpdate(event) {
    col.doc(this.data.id).update({
      data: {
        parentId: this.data.parentId,
        name: this.data.name
      }
    }).then(res => {
      Toast.success('修改成功');
    })
  },

  onClickDelete(event) {
    col.doc(this.data.id).remove().then(res => {
      Toast.success('删除成功');
    })
  }

})