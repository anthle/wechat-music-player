// components/menu-item/menu-item.js
Component({
  properties: {
    itemData:{
      type:Object,
      value:{}
    }
  },
  methods:{
    onMenuItemTap(){
      wx.navigateTo({
        url: `../../pages/detail-song/detail-song?type=menu&id=${this.properties.itemData.id}`,
      })
    }
  }
})
