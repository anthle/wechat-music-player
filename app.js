// app.js
App({
  globalData:{
    screenWidth:375,
    screenHeight:375,
    statusBarHeight:20,
    contentHeight:500
  },
  onLaunch(){
    wx.getSystemInfo({
      success:res=>{
        this.globalData.screenWidth = res.screenWidth
        this.globalData.screenHeight = res.screenHeight
        this.globalData.statusBarHeight = res.statusBarHeight
        this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 44
      }
    })
  }
})