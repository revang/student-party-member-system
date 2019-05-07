import Toast from '../../../utils/vant-weapp/toast/toast';

const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemManagement')

Page({
  data: {

    // 用户信息（部分）+ userType partyMemberType
    id: null,
    nickname: null,
    username: null,
    password: null,
    academyId: null,
    branchDepartmentId: null,
    contartPersonId: null,
    classId: null,

    // 用户类型
    userType: null,
    userTypeShow: false,
    userTypeList: ['系统管理员', '支部管理员', '联系人', '学生'],

    // 学院
    academyType: null,
    academyTypeShow: false,
    academyTypeList: null,

    // 支部
    branchDepartmentType: null,
    branchDepartmentTypeShow: false,
    branchDepartmentTypeList: null,

    // 班级
    classType: null,
    classTypeShow: false,
    classTypeList: null,

    // 联系人
    contartPersonType: null,
    contartPersonTypeShow: false,
    contartPersonTypeList: null,

    // 政治面貌
    partyMemberType: null,
    partyMemberTypeShow: false,
    partyMemberTypeList: ['正式党员', '预备党员', '入党积极分子', '群众'],

    // List
    academyList: null,
    branchDepartmentList: null,
    classList: null,
    partyMemberList: null
  },

  onLoad: function(options) {
    if (options.id) {
      col.doc(options.id).get().then(res => {
        this.setData({
          // 用户信息（部分）+ userType partyMemberType
          id: res.data._id,
          nickname: res.data.nickname,
          username: res.data.username,
          password: res.data.password,
          academyId: res.data.academyId,
          branchDepartmentId: res.data.branchDepartmentId,
          contartPersonId: res.data.contartPersonId,
          classId: res.data.classId,
          userType: res.data.userType,
          partyMemberType: res.data.partyMemberType
        })

        if (res.data.academyId) {
          col.doc(res.data.academyId).get().then(res2 => {
            this.setData({
              academyType: res2.data.name
            })
          })
        }

        if (res.data.branchDepartmentId) {
          col.doc(res.data.branchDepartmentId).get().then(res2 => {
            this.setData({
              branchDepartmentType: res2.data.name
            })
          })
        }

        if (res.data.classId) {
          col.doc(res.data.classId).get().then(res2 => {
            this.setData({
              classType: res2.data.name
            })
          })
        }

        if (res.data.contartPersonId) {
          col.doc(res.data.contartPersonId).get().then(res2 => {
            this.setData({
              contartPersonType: res2.data.nickname
            })
          })
        }
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

  // input box: username password, bind event
  changeValue(event) {
    this.setData({
      [`${event.currentTarget.dataset.key}`]: event.detail
    })
  },

  // 用户类型, event
  onClickShowUserType() {
    this.setData({
      userTypeShow: true
    })
  },
  onChangeUserType(event) {
    this.setData({
      userType: event.detail.value
    })
  },
  onConfirmUserType(event) {
    this.setData({
      userType: event.detail.value,
      userTypeShow: false
    })
  },
  onCancelUserType(event) {
    this.setData({
      userType: null,
      userTypeShow: false
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
      academyTypeShow: false,
      // clear branchDepartment class
      branchDepartmentTypeList: null,
      branchDepartmentType: null,
      branchDepartmentId: null,
      classTypeList: null,
      classType: null,
      classId: null,
      contartPersonTypeList: null,
      contartPersonType: null,
      contartPersonId: null
    })

    col.where({
      type: 'academy',
      name: event.detail.value,
    }).get().then(res => {
      this.setData({
        academyId: res.data[0]._id
      })

      // get branchDepartment List
      col.where({
        type: 'branchDepartment',
        parentId: res.data[0]._id
      }).get().then(res2 => {
        this.setData({
          branchDepartmentList: res2.data
        })

        for (var i in res2.data) {
          this.setData({
            [`branchDepartmentTypeList[${i}]`]: res2.data[i].name
          })
        }
      })

      col.where({
        type: 'class',
        parentId: res.data[0]._id
      }).get().then(res2 => {
        this.setData({
          classList: res2.data
        })

        for (var i in res2.data) {
          this.setData({
            [`classTypeList[${i}]`]: res2.data[i].name
          })
        }
      })
    })

  },
  onCancelAcademyType(event) {
    this.setData({
      academyType: null,
      academyTypeShow: false
    })
  },

  // 支部, event
  onClickShowBranchDepartmentType(event) {
    this.setData({
      branchDepartmentTypeShow: true
    })
  },
  onChangeBranchDepartmentType(event) {
    this.setData({
      branchDepartmentType: event.detail.value
    })
  },
  onConfirmBranchDepartmentType(event) {
    this.setData({
      branchDepartmentType: event.detail.value,
      branchDepartmentTypeShow: false
    })

    col.where({
      type: 'branchDepartment',
      name: event.detail.value
    }).get().then(res => {
      // console.log('branchDepartment: ', res)
      this.setData({
        branchDepartmentId: res.data[0]._id
      })

      col.where({
        type: 'user',
        userType: '联系人',
        branchDepartmentId: res.data[0]._id
      }).get().then(res2 => {
        this.setData({
          contartPersonList: res2.data
        })

        for (var i in res2.data) {
          this.setData({
            [`contartPersonTypeList[${i}]`]: res2.data[i].nickname // nickname
          })
        }
      })
    })
  },
  onCancelBranchDepartmentType(event) {
    this.setData({
      branchDepartmentType: null,
      branchDepartmentTypeShow: false
    })
  },

  // 班级, event
  onClickShowClassType(event) {
    this.setData({
      classTypeShow: true
    })
  },
  onChangeClassType(event) {
    this.setData({
      classType: event.detail.value
    })
  },
  onConfirmClassType(event) {
    this.setData({
      classType: event.detail.value,
      classTypeShow: false
    })

    col.where({
      type: 'class',
      name: event.detail.value
    }).get().then(res => {
      this.setData({
        classId: res.data[0]._id
      })
    })
  },
  onCancelClassType(event) {
    this.setData({
      classType: null,
      classTypeShow: false
    })
  },

  // 联系人, event
  onClickShowContartPersonType(event) {
    this.setData({
      contartPersonTypeShow: true
    })
  },
  onChangeContartPersonType(event) {
    this.setData({
      contartPersonType: event.detail.value
    })
  },
  onConfirmContartPersonType(event) {
    this.setData({
      contartPersonType: event.detail.value,
      contartPersonTypeShow: false
    })

    col.where({
      type: 'user',
      userType: '联系人',
      nickname: event.detail.value
    }).get().then(res => {
      this.setData({
        contartPersonId: res.data[0]._id
      })
    })
  },
  onCancelContartPersonType(event) {
    this.setData({
      contartPersonType: null,
      contartPersonTypeShow: false
    })
  },

  // 政治面貌, event
  onClickShowPartyMemberType() {
    this.setData({
      partyMemberTypeShow: true
    })
  },
  onChangePartyMemberType(event) {
    this.setData({
      partyMemberType: event.detail.value
    })
  },
  onConfirmPartyMemberType(event) {
    this.setData({
      partyMemberType: event.detail.value,
      partyMemberTypeShow: false
    })
  },
  onCancelPartyMemberType(event) {
    this.setData({
      partyMemberType: null,
      partyMemberTypeShow: false
    })
  },

  onClickAdd(event) {
    // console.log('type: user', this.data.username, this.data.password, this.data.nickname, this.data.userType)
    // console.log(this.data.academyId, this.data.branchDepartmentId, this.data.classId, this.data.contartPersonId, this.data.partyMemberType)
    col.add({
      data: {
        type: 'user',
        nickname: this.data.nickname,
        username: this.data.username,
        password: this.data.password,
        userType: this.data.userType,

        academyId: this.data.academyId,
        branchDepartmentId: this.data.branchDepartmentId,
        classId: this.data.classId,
        contartPersonId: this.data.contartPersonId,
        partyMemberType: this.data.partyMemberType
      }
    }).then(res => {
      Toast.success('添加成功')
    })
  },

  onClickUpdate(event) {
    col.doc(this.data.id).update({
      data: {
        type: 'user',
        nickname: this.data.nickname,
        username: this.data.username,
        password: this.data.password,
        userType: this.data.userType,

        academyId: this.data.academyId,
        branchDepartmentId: this.data.branchDepartmentId,
        classId: this.data.classId,
        contartPersonId: this.data.contartPersonId,
        partyMemberType: this.data.partyMemberType
      }
    }).then(res => {
      Toast.success('修改成功')
    })
  },

  onClickDelete(event) {
    col.doc(this.data.id).remove().then(res => {
      Toast.success('删除成功')
    })
  }
})