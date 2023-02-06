// pages/music-player/music-player.js
import playerStore,{audioContext} from '../../../store/playerStore'
import {throttle} from 'underscore'

const app = getApp()

Page({
  data: {
    id:null,
    currentSong:{},
    lyricInfos:[],
    currentTime:undefined, //ms
    duration:undefined, //ms
    currentLyricTextIndex:-1,
    currentLyricText:"",

    currentPage:0,
    contentHeight:undefined,
    pageTitles:["歌曲","歌词"],
    isWaiting:false,
    isPlaying:true,
    sliderValue:undefined,
    isSliderChanging:false,
    lyricScrollTop:0,
    playSongsList:[],
    PlaySongsIndex:undefined,
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
    if (id) {
      playerStore.dispatch("playMusicWithSongIdAction",id)
    }
    
    // 获取store共享数据
    playerStore.onStates(["playSongsList","playSongsIndex"],this.getPlaySongsInfosHandler)
    playerStore.onStates(["id","currentTime","lyricInfos","currentSong","duration","currentLyricTextIndex","currentLyricText","isFirstPlay","isPlaying","playModeIndex","sliderValue"],this.getPlayerInfosHandler)
  },

  onNavClick(){
    wx.navigateBack()
  },

  updateProgress:throttle(function(currentTime){
    if(this.data.isSliderChanging || this.data.isWaiting) return
    // 记录当前播放时间
    const sliderValue = currentTime / this.data.duration * 100
    playerStore.setState('sliderValue',sliderValue)
    // 修改sliderValue让slider实时变动
    this.setData({
      currentTime,
      sliderValue:sliderValue
    })
  },1000,{
    leading:false,
    trailing:false
  }),

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
    audioContext.seek(currentTime/1000)
    this.setData({currentTime,isSliderChanging:false,sliderValue:value})
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
    playerStore.dispatch("changeMusicStatusAction")
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
  getPlayerInfosHandler({id,currentTime,lyricInfos,currentSong,duration,currentLyricTextIndex,currentLyricText,isFirstPlay,isPlaying,playModeIndex,sliderValue}){
    if (id !== undefined) {
      this.setData({id})
    }
    if (currentTime !== undefined) {
      this.updateProgress(currentTime)
    }
    if (duration !== undefined) {
      this.setData({duration})
    }
    if (currentLyricTextIndex !== undefined) {
      this.setData({
        currentLyricTextIndex,
        lyricScrollTop:currentLyricTextIndex * 35
      })
    }
    if (currentLyricText !== undefined) {
      this.setData({currentLyricText})
    }
    if (lyricInfos) {
      this.setData({lyricInfos})
    }
    if (currentSong) {
      this.setData({currentSong})
    }
    if (isFirstPlay) {
      this.setData({isFirstPlay})
    }
    if (isPlaying !== undefined) {
      this.setData({isPlaying})
    }
    if (playModeIndex !== undefined) {
      this.setData({playModeIndex})
    }
    if (sliderValue !== undefined) {
      this.setData({sliderValue})
    }
  },
  onUnload(){
    playerStore.offStates(['playSongsList','playSongsIndex'],this.getPlaySongsInfosHandler)
    playerStore.offStates(["id","currentTime","lyricInfos","currentSong","duration","currentLyricTextIndex","currentLyricText","isFirstPlay","isPlaying","playModeIndex","sliderValue"],this.getPlayerInfosHandler)
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
    playerStore.dispatch("playNextMusicAction",isNext)
  },

  //切歌模式
  onModeBtnTap(){
    playerStore.dispatch("changeMusciPlayModeAction")
  }
})