import {HYEventStore} from "hy-event-store"
import {getRecommendSongData} from "../services/music"

const rankingIdsMap = {
  newSongRanking:3779629,
  originSongRanking:2884035,
  upSongRanking:19723756
}

const rankingStore = new HYEventStore({
  state:{
    newSongRanking:{},
    originSongRanking:{},
    upSongRanking:{}
  },
  actions:{
    fetchRankingDataAction(content){
      for (const key in rankingIdsMap) {
        const id = rankingIdsMap[key]
        getRecommendSongData(id).then(res=>{
          content[key]=res.playlist
        })
      }
    }
  }
})

export default rankingStore