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
    if (!Chart) {
      this.init_echarts();
    } else {
      this.setOption(Chart);
    }
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
      color: ["#37A2DA", "#32C5E9", "#67E0E3", "#9FE6B8"],
      tooltip: {
        trigger: 'item',
        formatter: "{b}: {c} 人 ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['系统管理员', '支部管理员', '联系人', '学生']
      },
      series: [{
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: dataList
      }]
    }
    return option;
  },

  async getTypeNumSync() {
    let type1Num = await this.getTypeNum('系统管理员');
    let type2Num = await this.getTypeNum('支部管理员');
    let type3Num = await this.getTypeNum('联系人');
    let type4Num = await this.getTypeNum('学生');

    let results = await Promise.all([type1Num, type2Num, type3Num, type4Num]);

    dataList = [{
        name: '系统管理员',
        value: results[0]
      },
      {
        name: '支部管理员',
        value: results[1]
      },
      {
        name: '联系人',
        value: results[2]
      },
      {
        name: '学生',
        value: results[3]
      },
    ]

    this.setData({
      userTypeList: dataList
    })

  },

  getTypeNum(typeName) {
    return new Promise(function(resolve, reject) {
      col.where({
        type: 'user',
        userType: typeName
      }).count().then(res => {
        resolve(res.total)
      })
    })
  },

  onClickDetail(event){
    console.log('event',event)
  }
})