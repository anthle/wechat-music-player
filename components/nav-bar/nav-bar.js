// components/nav-bar/nav-bar.js
const app = getApp()

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多 slot 支持
  },
  properties:{
    title:{
      type:String,
      value:"导航标题"
    }
  },
  data:{
    statusBarHeight:undefined
  },
  lifetimes:{
    // 获取设备信息
    attached(){
      this.setData({ statusBarHeight: app.globalData.statusBarHeight})
    }
  },
  methods:{
    onLeftClick(){
      this.triggerEvent('leftClick')
    }
  }
})
