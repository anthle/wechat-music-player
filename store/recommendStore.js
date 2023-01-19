import {HYEventStore} from 'hy-event-store'
import {getRecommendSongData} from "../services/music"

const recommendStore = new HYEventStore({
  state:{
    recommendSongInfo:{}
  },
  actions:{
    fetchRecommendSongAction(content){
      getRecommendSongData(3778678).then(res=>{
        content.recommendSongInfo = res.playlist
      })
    }
  }
})

export default recommendStore