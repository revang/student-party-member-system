const regeneratorRuntime = require("../../../utils/regeneratorRuntime.js")

import * as echarts from '../../../utils/ec-canvas/echarts'

const db = wx.cloud.database()
const col = db.collection('colPartyMemberSystemManagement')

let dataList = []
let Chart = null


Page({

  data: {

    userTypeList: null,

    ec: {
      lazyLoad: true
    }
  },

  onLoad: function(options) {
    this.getTypeNumSync().then(() => {
      this.echartsComponnet = this.selectComponent('#mychart');
      this.getData();
    })
  },

  getData: function() {
    this.init_echarts();
    // if (!Chart) {
    //   this.init_echarts();
    // } else {
    //   this.setOption(Chart);
    // }
  },

  init_echarts: function() {
    this.echartsComponnet.init((canvas, width, height) => {
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(Chart);
      return Chart;
    });
  },

  setOption: function(Chart) {
    Chart.setOption(this.getOption());
  },

  getOption: function() {
    var option = {
      color: ["#37A2DA", "#32C5E9", "#67E0E3", "#9FE6B8", "#FFDB5C", "#FF9F7F", "#FB7293"],
      xAxis: {
        type: 'category',
        data: ['信息', '城建', '管理', '生环', '现服', '人外', '家扬']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: dataList,
        type: 'bar'
      }]
    };
    return option;
  },

  async getTypeNumSync() {
    // get academy list
    // col.where({
    //   type:'academy'
    // }).get().then(res=>{
    //   console.log(res.data)
    // })

    let type1Num = await this.getTypeNum("988c1b1b5ccfa35a0cd8b2f2426d9197"); // "信息学院" "988c1b1b5ccfa35a0cd8b2f2426d9197"
    let type2Num = await this.getTypeNum("96c1cbbe5ccfecef0cfda9c540bb8855"); // "城建学院" "96c1cbbe5ccfecef0cfda9c540bb8855"
    let type3Num = await this.getTypeNum("988c1b1b5ccfecf80cff1f2c7e64c544"); // "管理学院" "988c1b1b5ccfecf80cff1f2c7e64c544"
    let type4Num = await this.getTypeNum("96c1cbbe5cd05cb40d4963db77e2a501"); // "生环学院" "96c1cbbe5cd05cb40d4963db77e2a501"
    let type5Num = await this.getTypeNum("96c1cbbe5cd05cca0d496a2930aeed6a"); // "现服学院" "96c1cbbe5cd05cca0d496a2930aeed6a"
    let type6Num = await this.getTypeNum("ee3099285cd05cd30d496d1205413212"); // "人外学院" "ee3099285cd05cd30d496d1205413212"
    let type7Num = await this.getTypeNum("9c4488c75cd05cdd0d4ba4b954420ec8"); // "家扬书院" "9c4488c75cd05cdd0d4ba4b954420ec8"

    let results = await Promise.all([type1Num, type2Num, type3Num, type4Num, type5Num, type6Num, type7Num]);

    dataList = [{
        name: '信息学院',
        value: results[0]
      },
      {
        name: '城建学院',
        value: results[1]
      },
      {
        name: '管理学院',
        value: results[2]
      },
      {
        name: '生环学院',
        value: results[3]
      },
      {
        name: '现服学院',
        value: results[4]
      },
      {
        name: '人外学院',
        value: results[5]
      },
      {
        name: '家扬书院',
        value: results[6]
      }
    ]

    this.setData({
      userTypeList: dataList
    })

  },

  getTypeNum(typeName) {
    return new Promise(function(resolve, reject) {
      col.where({
        type: 'branchDepartment',
        parentId: typeName
      }).count().then(res => {
        resolve(res.total)
      })
    })
  }
})