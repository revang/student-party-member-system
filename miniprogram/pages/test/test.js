const db = wx.cloud.database()
const _ = db.command
const col = db.collection('colPartyMemberSystemManagement')


Page({

  data: {

  },

  onLoad: function(options) {
    let name = '信息'

    col.where({}
    //   _.or([{
    //   name: '信息学院'
    // }, {
    //   username: 'wgm'
    // }])
    
    ).get().then(res => {
      console.log(res)
    }
    )

  },

})