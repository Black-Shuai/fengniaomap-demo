<template>
  <div>
   <router-link to="/indoormap">点击信息显示</router-link>
    <!-- 加载地图容器 -->
    <div id="fengMap" style="height: 100vh;"></div>
  </div>
</template>

<script>
export default {
  name: 'InfoWindow',
  data () {
    return {
      // 定义全局map变量
      map: null,
      // 定义marker层
      layer: null
    }
  },
  mounted () {
    this.initmap()
  },
  methods: {
    initmap () {
      let fmapID = '10347'
      /**
       * 初始化参数，默认使用在线数据，从蜂鸟视图数据服务器加载模型数据
       * https://www.fengmap.com/docs/js/v2.4.0_beta/fengmap.FMMap.html
       **/
      let mapOptions = {
        container: document.getElementById('fengMap'),
        // defaultViewMode: fengmap.FMViewMode.MODE_2D, // 初始二维还是三维状态，三维状态为MODE_3D
        // defaultControlsPose: fengmap.FMDirection.NORTH,
        defaultControlsPose: 180, // 角度值。
        // 地图数据位置

        mapScaleLevelRange: [16, 23], // 比例尺级别范围， 16级到23级
        defaultMapScaleLevel: 20, // 默认比例尺级别设置为19级
        // mapServerURL: 'http://test6.fengmap.com/FMDemoStorage/data/10347',
        mapServerURL: '../../static/data/' + fmapID,
        // 主题数据位置
        mapThemeURL: '../../static/data/theme',
        // 必要，地图应用名称，通过蜂鸟云后台创建
        appName: '蜂鸟研发SDK_2_0',
        // 必要，地图应用密钥，通过蜂鸟云后台获取
        key: '57c7f309aca507497d028a9c00207cf8'
      }

      // 初始化地图对象
      this.map = new fengmap.FMMap(mapOptions)

      // 打开Fengmap服务器的地图数据和主题
      this.map.openMapById(fmapID, function (error) {
        // 打印错误信息
        console.log(error)
      })

      // 地图加载完成事件
      this.map.on('loadComplete', this.addPopInfoWindow()
      )
    },
    /**
     * 信息框控件配置
     * https://www.fengmap.com/docs/js/v2.4.0_beta/fengmap.FMPopInfoWindow.html
     **/
    addPopInfoWindow () {
      // 独立信息窗坐标点
      var target = {
        // 地图坐标
        coord: {
          x: 12961581.8454802,
          y: 4861817.63647148,
          z: 0
        },
        groupID: 1 // 楼层id
      }
      // 添加独立信息窗
      var ctlOpt = {
        // 添加信息框的地图位置坐标
        mapCoord: {
          // 设置弹框的x轴
          x: target.coord.x,
          // 设置弹框的y轴
          y: target.coord.y,
          // 控制信息框距离地图的高度
          height: 2,
          // 设置弹框位于的楼层,当前聚焦楼层
          groupID: target.groupID
        },
        // 设置弹框的宽度
        width: 200,
        // 设置弹框的高度px
        height: 100,
        // 设置弹框的内容
        content: '<a target="_bank" href="https://www.fengmap.com">这是一个独立信息框</a>',
        closeCallBack: function () {
          // 信息窗点击关闭操作
          console.log('信息窗关闭了！')
        }
      }
      // 添加弹框到地图上，独立信息窗
      let popMarker = new fengmap.FMPopInfoWindow(this.map, ctlOpt)
    }
  }
}
</script>

<style scoped>

</style>
