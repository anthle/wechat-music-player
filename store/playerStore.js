import {HYEventStore} from 'hy-event-store'

const playerStore = new HYEventStore({
  state:{
    playSongsList:[],
    playSongsIndex:undefined
  }
})

export default playerStore;