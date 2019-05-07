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

  onLoad: function (options) {
    this.getTypeNumSync().then(() => {
      this.echartsComponnet = this.selectComponent('#mychart');
      this.getData();
    })
  },

  getData: function () {
    if (!Chart) {
      this.init_echarts();
    } else {
      this.setOption(Chart);
    }
  },

  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(Chart);
      return Chart;
    });
  },

  setOption: function (Chart) {
    Chart.setOption(this.getOption());
  },

  getOption: function () {   
    var option ={
      color: ["#37A2DA", "#32C5E9", "#67E0E3", "#9FE6B8"],
      title: {
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{b} : {c}人 ({d}%)"
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        x: 'left',
        data: ['正式党员', '预备党员', '入党积极分子', '群众'],
      },
      series: [
        {
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data:dataList,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    return option;
  },

  async getTypeNumSync() {
    let type1Num = await this.getTypeNum('正式党员');
    let type2Num = await this.getTypeNum('预备党员');
    let type3Num = await this.getTypeNum('入党积极分子');
    let type4Num = await this.getTypeNum('群众');

    let results = await Promise.all([type1Num, type2Num, type3Num, type4Num]);

    dataList = [{
      name: '正式党员',
      value: results[0]
    },
    {
      name: '预备党员',
      value: results[1]
    },
    {
      name: '入党积极分子',
      value: results[2]
    },
    {
      name: '群众',
      value: results[3]
    },
    ]

    this.setData({
      userTypeList: dataList
    })

  },

  getTypeNum(typeName) {
    return new Promise(function (resolve, reject) {
      col.where({
        type: 'user',
        userType: '学生',
        partyMemberType: typeName
      }).count().then(res => {
        resolve(res.total)
      })
    })
  }
})