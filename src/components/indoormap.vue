<template>
  <div>
    <div id="xmap" style="width: 100%;height: 100vh"></div>
    <!-- 提示信息 -->
    <span id="tip" class="tip">请尝试使用鼠标点击地图上的颜色区域进行拾取操作</span>
  </div>
</template>

<script>
export default {
  name: 'indoormap',
  data () {
    return {
      map: null,
      selectedModel: null,
      clickedPOI: false,
      eventID: null,
      buttonTypeText: null,
      // 地图是否加载完成
      mapIsOk: false,
      // 定义定位点marker
      locationMarker: null
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
        container: document.getElementById('xmap'),
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
      this.map.on('loadComplete', function () {
        console.log('地图加载完成！')
        // 显示按钮
        document.getElementById('tip').style.display = 'block'
      })
      // 地图点击事件，需要在地图加载完成之后操作
      this.map.on('mapClickNode', function (event) {
        console.log(event)
        if (!event.nodeType) {
          if (this.selectedModel) {
            this.selectedModel.selected = false
          }
        }

        // 鼠标左右键点击事件
        let buttonType = event.domEvent.button
        if (buttonType === 0) {
          this.buttonTypeText = '我是鼠标左键点击'
          console.log('我是鼠标左键点击')
        } else if (buttonType === 2) {
          this.buttonTypeText = '我是鼠标右键点击'
          console.log('我是鼠标右键点击')
        }

        // 地图模型
        var target = event.target
        if (!target) {
          return
        }

        // 筛选点击类型,打印拾取信息
        switch (target.nodeType) {
          // 地面模型
          case fengmap.FMNodeType.FLOOR:
            if (this.clickedPOI && event.eventInfo.eventID === this.eventID) return
            let info1 = '拾取对象类型： 地图 \n' +
                '地图位置坐标：x: ' + event.eventInfo.coord.x + '，y:' + event.eventInfo.coord.y
            if (this.selectedModel) {
              this.selectedModel.selected = false
            }
            // 弹出信息框
            alert(info1)
            break

            // model模型
          case fengmap.FMNodeType.MODEL:
            if (this.clickedPOI && event.eventInfo.eventID === this.eventID) {
              // 取消地图上所有模型高亮状态
              this.map.selectNull()
              this.clickedPOI = false
              return
            }
            // 过滤类型为墙的model
            if (target.typeID === 30000) {
              // 其他操作
              return
            }
            let info = '拾取对象类型： 模型 \n' +
                'FID：' + target.FID + '\n' +
                'model中心点坐标：x: ' + target.x + '，y:' + target.y + '\n' +
                '地图位置坐标：x: ' + event.eventInfo.coord.x + '，y:' + event.eventInfo.coord.y

            // 模型高亮
            if (this.selectedModel && this.selectedModel.FID !== target.FID) {
              this.selectedModel.selected = false
            }
            target.selected = true
            this.selectedModel = target

            setTimeout(function () {
              // 弹出信息框
              alert(info)
            }, 300)
            break

            // 公共设施、图片标注模型
          case fengmap.FMNodeType.FACILITY:
          case fengmap.FMNodeType.IMAGE_MARKER:
            this.clickedPOI = true
            this.eventID = event.eventInfo.eventID
            var info = '拾取对象类型： 公共设施 \n' +
                '地图位置坐标：x: ' + event.eventInfo.coord.x + '，y:' + event.eventInfo.coord.y
            if (this.selectedModel) {
              this.selectedModel.selected = false
            }
            // 弹出信息框
            alert(info)
            break
        }
      })

      // 过滤是否可触发点击事件mapClickNode方法的地图元素，返回true为可触发
      this.map.pickFilterFunction = function (event) {
        // 如设置点击墙模型时不高亮
        if (event.typeID === 300000) {
          return false
        }
        return true
      }
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
  #xmap{
    width: 100%;
    height: 100%;
  }
</style>
