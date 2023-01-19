// components/area-header/area-header.js
Component({
  properties: {
    title:{
      type:String,
      value:'默认标题'
    },
    hasMore:{
      type:Boolean,
      value:true
    },
    itemData:{
      type:Object,
      value:{}
    }
  },
  methods:{
    onHasMore(){
      if (this.data.title =='推荐歌曲') {
        return this.triggerEvent('onRecommendMoreClick')
      }
      wx.navigateTo({
        url: '../../pages/detail-menu/detail-menu',
      })
    }
  }
})
