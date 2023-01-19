// components/menu-area/menu-area.js
const app = getApp()

Component({
  properties: {
    title:{
      type:String,
      value:""
    },
    MenuList:{
      type:Array,
      value:[]
    },
  },
  data:{
    screenWidth:375
  },
  lifetimes:{
    attached(){
      // 动态获取屏幕width
      this.setData({
        screenWidth:app.globalData.screenWidth
      })
    }
  }
})
