// pages/music-player/music-player.js
import{getSongDetail,getSonglyric} from '../../services/player'

Page({
  data: {
    id:null,
    currentSong:{},
    songLyric:""
  },
  onLoad(options) {
    const id = options.id
    this.setData({id})

    getSongDetail(id).then(res=>{
      this.setData({currentSong:res.songs[0]})
    })

    getSonglyric(id).then(res=>{
      this.setData({songLyric:res.lrc.lyric})
    })

  },
})