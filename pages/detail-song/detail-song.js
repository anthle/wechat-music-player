// pages/detail-song/detail-song.js
import rankingStore from "../../store/rankingStore"
import playerStore from "../../store/playerStore"
import recommendSongs from '../../store/recommendStore'
import {getRecommendSongData} from "../../services/music"


Page({
  data: {
    key:'',
    type:'',
    songInfos:{},
    id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const key = options.id
    const type = options.type
    this.setData({key,type})
    if (this.data.type ==='ranking') {
      rankingStore.onState(this.data.key,this.handleRanking)
    }else if(this.data.type ==='recommend'){
      recommendSongs.onState('recommendSongInfo',this.handleRanking)
    }else if(this.data.type ==='menu'){
      const id = options.id
      this.data.id = id
      this.fetchMenuItemSong()
    }
  },
  onUnload(){
    if (this.data.type ==='ranking') {
      rankingStore.offState(this.data.key,this.handleRanking)
    }else if(this.data.type ==='recommend'){
      recommendSongs.offState('recommendSongInfo',this.handleRanking)
    }
  },
  onSongsListTap(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState('playSongsList',this.data.songInfos.tracks)
    playerStore.setState('playSongsIndex',index)
  },
  handleRanking(value){
    if(this.data.type==='recommend'){
      value.name = '推荐歌曲'
    }
    this.setData({songInfos:value})
    wx.setNavigationBarTitle({
      title: value.name
    })
  },
  async fetchMenuItemSong(){
    const res = await getRecommendSongData(this.data.id)
    this.setData({songInfos:res.playlist})
  }
})