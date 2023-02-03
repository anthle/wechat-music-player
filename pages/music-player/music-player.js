// pages/music-player/music-player.js
import{getSongDetail,getSonglyric} from '../../services/player'
import {parseLyric} from '../../utils/parser-lyric'
import playerStore from '../../store/playerStore'
import {throttle} from 'underscore'

const app = getApp()
const audioContext = wx.createInnerAudioContext()

Page({
  data: {
    id:null,
    currentSong:{},
    lyricInfos:[],
    currentPage:0,
    contentHeight:undefined,
    pageTitles:["歌曲","歌词"],
    currentTime:undefined, //ms
    duration:undefined, //ms
    slideValue:undefined,
    isSliderChanging:false,
    isWaiting:false,
    isPlaying:true,
    currentLyricText:"",
    currentLyricTextIndex:-1,
    lyricScrollTop:0,

    playSongsList:[],
    PlaySongsIndex:undefined,

    isFirstPlay:true,

    playModeIndex:0, //0:normal 1:Single song cycle 2：Random Play
    playModeName:["order","repeat","random"]
  },
  onLoad(options) {
    // 获取设备信息
    this.setData({
      contentHeight:app.globalData.contentHeight
    })
    // 获取Id并保存
    const id = options.id
    this.setData({id})

    this.setupPlaySong(id)
    
    

    // 获取播放列表数据
    playerStore.onStates(["playSongsList","playSongsIndex"],this.getPlaySongsInfosHandler)
  },
  // 加载页面所需要的步骤
  setupPlaySong(id){
    this.setData({id})
    // 请求数据
    getSongDetail(id).then(res=>{
      this.setData({
        currentSong:res.songs[0],
        duration:res.songs[0].dt
      })
    })
    getSonglyric(id).then(res=>{
      const lyricString = res.lrc.lyric
      const lyricInfos = parseLyric(lyricString)
      this.setData({lyricInfos:lyricInfos})
    })

    // 监听播放进度
    if (this.data.isFirstPlay) {
      this.data.isFirstPlay = false
      const throttleUpdateProgress = throttle(this.updateProgress,500,{
         leading:false,
         trailing:false
      })
      audioContext.onTimeUpdate(()=>{
        // 设置定时器
        if (!this.data.isSliderChanging && !this.data.isWaiting) {
          throttleUpdateProgress()
        }
        // 循环获取当前时刻歌词
        if(!this.data.lyricInfos.length) return
        let index = this.data.lyricInfos.length -1
        for (const [i,item] of this.data.lyricInfos.entries()) {
          if (item.time>audioContext.currentTime * 1000) {
            index = i -1
            break;
          }
        }
        if(index === this.data.currentLyricTextIndex) return
        const currentLyricText = this.data.lyricInfos[index].text
        this.setData({
          currentLyricText,
          currentLyricTextIndex:index,
          lyricScrollTop:index * 35
        })
      })
      audioContext.onWaiting(()=>{
        audioContext.pause()
      })
      audioContext.onCanplay(()=>{
        audioContext.play()
      })
      audioContext.onEnded(()=>{
        if(audioContext.loop) return
        this.onNextBtnTap()
      })
    }

    // 播放歌曲
    audioContext.src =  `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true
  },
  onNavClick(){
    wx.navigateBack()
  },
  updateProgress(){
    // 记录当前播放时间
    this.setData({currentTime:audioContext.currentTime * 1000})
    
    // 修改sliderValue让slider实时变动
    const sliderValue = this.data.currentTime / this.data.duration *100
    this.setData({slideValue:sliderValue})
  },
  onSwiperChange(event){
    this.setData({currentPage:event.detail.current})
  },

  onNavTabItemTap(event){
    const index = event.target.dataset.set
    this.setData({currentPage: index})
  },

  onSlidreChange(event){
    // 设置定时器控制isWaiting的值实现延迟更新播放时间与sliderValue用于解决点击slider后有概率出现的slider值发生变化但动画卡帧的bug
    if (!this.data.isWaiting) {
      this.setData({isWaiting:true})
      setTimeout(() => {
        this.setData({isWaiting:false})
      }, 1000);
    }
    // 滑块点击后的值
    const value = event.detail.value
    // 播放的具体时间
    const currentTime = value/100 * this.data.duration
    this.setData({currentTime,isSliderChanging:false,slideValue:value})
    audioContext.seek(currentTime/1000)
  },
  // 监听滑块拖动
  onSliderChanging:throttle(function(event){
    this.data.isSliderChanging = true
    const value = event.detail.value
    const currentTime = value/100 * this.data.duration
    this.setData({currentTime:currentTime})
  },100),
  // 监听点击/暂停按钮
  onPlayOrPauseTap(){
    if (!audioContext.paused) {
      audioContext.pause()
      this.setData({isPlaying:false})
    } else {
      audioContext.play()
      this.setData({isPlaying:true})
    }
  },
  // 获取要播放的歌曲列表与index并保存
  getPlaySongsInfosHandler({playSongsList,playSongsIndex}){
    if (playSongsList) {
      this.setData({playSongsList})
    }
    if (playSongsIndex !== undefined) {
      this.setData({playSongsIndex})
    }
  },
  onUnload(){
    playerStore.offStates(['playSongsList','playSongsIndex'],this.getPlaySongsInfosHandler)
  },
  // 点击返回
  stepBack(){
    wx.navigateBack(-1)
  },
  // 切歌
  onPervBtnTap(){
    this.changeNewSong(false)
  },
  onNextBtnTap(){
    this.changeNewSong()
  },
  changeNewSong(isNext = true){
    let index = this.data.playSongsIndex
    index = isNext? index + 1 : index - 1
    switch(this.data.playModeIndex){
      case 0:
      case 1:
        if (index>this.data.playSongsList.length - 1) index = 0
        if (index<0) index = this.data.playSongsList.length-1
        break;
      case 2:
        index = this.randomPlayFilter()
        break;
    }
   
    const newSong = this.data.playSongsList[index]
    this.setData({currentSong:[],currentLyricText:'',currentTime:0,duration:0,slideValue:0})
    this.setupPlaySong(newSong.id)
    this.setData({isPlaying:true})
    playerStore.setState("playSongsIndex",index)
  },

  //切歌模式
  onModeBtnTap(){
    let index = this.data.playModeIndex
    index = index + 1
    if(index>this.data.playModeName.length-1) index = 0
    // 单曲循环
    if (index === 1) {
      audioContext.loop = true
    }else{
      audioContext.loop = false
    }
    this.setData({playModeIndex:index})
  },
  // 过滤随机播放时可能产生的Index相等情况
  randomPlayFilter(){
    const index = Math.floor(Math.random()*this.data.playSongsList.length)
    if (index === this.data.playSongsIndex) {
      return this.randomPlayFilter()
    }
    return index
  }
})