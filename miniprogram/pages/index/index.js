import * as echarts from '../../utils/ec-canvas/echarts';

var dataList = [];
var k = 0;
var Chart = null;

Page({

  data: {
    ec: {
      lazyLoad: true // 延迟加载
    }
  },

  onLoad: function (options) {
    this.echartsComponnet = this.selectComponent('#mychart');
    this.getData(); //获取数据
  },

  getData: function () {
  	/**
  	 * 此处的操作：
  	 * 获取数据json
  	 */
    if (k % 2) {
      dataList = [1, 2, 3, 4, 5, 6];
    } else {
      dataList = [7, 6, 9, 2, 5, 6];
    }
    k++;
    //如果是第一次绘制
    if (!Chart) {
      this.init_echarts(); //初始化图表
    } else {
      this.setOption(Chart); //更新数据
    }
  },
  //初始化图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      // Chart.setOption(this.getOption());
      this.setOption(Chart);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function (Chart) {
    // Chart.clear();  // 清除
    Chart.setOption(this.getOption());  //获取新数据
  },
  getOption: function () {
    // 指定图表的配置项和数据
    var option = {
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: dataList,
        type: 'line'
      }]
    }
    return option;
  },
})