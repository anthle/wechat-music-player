import {getHotSongMenu,getSongMenuList} from "../../services/music"

Page({
  data:{
    songMenus:[]
  },
  onLoad(){
    this.fetchHotSongMenu()
  },
  async fetchHotSongMenu(){
    const tagsRes = await getHotSongMenu()
    const tags = tagsRes.tags

    const allPromise =[]
    for (const tag of tags) {
      const res = getSongMenuList(tag.name)
      allPromise.push(res)
    }
    Promise.all(allPromise).then(res=>{
      this.setData({songMenus:res})
      console.log(this.data.songMenus);
    })
  }
})