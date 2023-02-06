import {HYEventStore} from 'hy-event-store'
import {getSongDetail,getSonglyric} from '../services/player'
import {parseLyric} from '../utils/parser-lyric'
import {randomPlayFilter} from '../utils/randomPlayFilter'

export const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state:{
    playSongsList:[],
    playSongsIndex:undefined,

    // 歌曲播放页所需的state
    id:null,
    currentSong:{},
    lyricInfos:[],
    currentTime:undefined, //ms
    duration:undefined, //ms
    currentLyricTextIndex:-1,
    currentLyricText:"",
    isFirstPlay:true,
    isPlaying:true,
    playModeIndex:0, //0:normal 1:Single song cycle 2：Random Play

    sliderValue:null
  },
  actions:{
    playMusicWithSongIdAction(ctx,id){
      // 播放之前重置所有数据
      ctx.currentLyricText = ''
      ctx.currentSong = {}
      ctx.currentTime = 0
      ctx.duration = 0
      ctx.slideValue = 0
      ctx.lyricInfos = []
      // 获取id
      ctx.id = id
      // 请求数据
      getSongDetail(id).then(res=>{
        ctx.currentSong = res.songs[0]
        ctx.duration = res.songs[0].dt
      })
      getSonglyric(id).then(res=>{
        const lyricString = res.lrc.lyric
        const lyricInfos = parseLyric(lyricString)
        // this.setData({lyricInfos:lyricInfos})
        ctx.lyricInfos = lyricInfos
      })

      // 监听播放进度
      if (ctx.isFirstPlay) {
        ctx.isFirstPlay = false
        audioContext.onTimeUpdate(()=>{
          // 循环获取当前时刻歌词
          // console.log(audioContext.currentTime);灵异现象
          ctx.currentTime = audioContext.currentTime * 1000
          if(!ctx.lyricInfos.length) return
          let index = ctx.lyricInfos.length -1
          for (const [i,item] of ctx.lyricInfos.entries()) {
            if (item.time>audioContext.currentTime * 1000) {
              index = i -1
              break;
            }
          }
          if(index === ctx.currentLyricTextIndex || index === -1) return
          const currentLyricText = ctx.lyricInfos[index].text
          ctx.currentLyricText = currentLyricText
          ctx.currentLyricTextIndex = index
        })
        audioContext.onWaiting(()=>{
          audioContext.pause()
        })
        audioContext.onCanplay(()=>{
          audioContext.play()
        })
        audioContext.onEnded(()=>{
          if(audioContext.loop) return
          this.dispatch("playNextMusicAction")
        })
      }
      // 播放歌曲
      audioContext.src =  `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true
    },
    changeMusicStatusAction(ctx){
      if (!audioContext.paused) {
        audioContext.pause()
        ctx.isPlaying = false
      } else {
        audioContext.play()
        ctx.isPlaying = true
      }
    },
    changeMusciPlayModeAction(ctx){
      let index = ctx.playModeIndex
      index = index + 1
      if(index===3) index = 0
      // 单曲循环
      if (index === 1) {
        audioContext.loop = true
      }else{
        audioContext.loop = false
      }
      ctx.playModeIndex = index
    },
    playNextMusicAction(ctx,isNext=true){
      let index = ctx.playSongsIndex
      index = isNext? index + 1 : index - 1
      switch(ctx.playModeIndex){
        case 0:
        case 1:
          if (index>ctx.playSongsList.length - 1) index = 0
          if (index<0) index = ctx.playSongsList.length-1
          break;
        case 2:
          index = randomPlayFilter(ctx)
          break;
      }
      const newSong = ctx.playSongsList[index]
      this.dispatch("playMusicWithSongIdAction",newSong.id)
      ctx.isPlaying = true
      ctx.playSongsIndex = index
    },
  }
})

export default playerStore;