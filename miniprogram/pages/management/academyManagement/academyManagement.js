import Toast from '../../../utils/vant-weapp/toast/toast';

const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemManagement')

Page({

  data: {
    id: null,
    name: null
  },

  onLoad: function(options) {
    if(options.id){
      col.doc(options.id).get().then(res => {
        this.setData({
          id: res.data._id,
          name: res.data.name
        })
      })
    }
  },

  onChangeName(event) {
    this.setData({
      name: event.detail
    })
  },

  onClickAdd(event) {
    col.add({
      data: {
        type: 'academy',
        name: this.data.name
      }
    }).then(res => {
      Toast.success('添加成功');
      // clear input box content
      // this.setData({
      //   name: null
      // })
    })
  },

  onClickUpdate(event){
    col.doc(this.data.id).update({
      data:{
        name:this.data.name
      }
    }).then(res=>{
      Toast.success('修改成功');
    })
  },

  onClickDelete(event){
    col.doc(this.data.id).remove().then(res => {
      Toast.success('删除成功');
    })
  }

})