// pages/main-music/main-music.js
import {getMusicBanner,getSongMenuList} from "../../services/music"
import recommendStore from "../../store/recommendStore"
import playerStore from "../../store/playerStore"
import rankingStore from "../../store/rankingStore"
import querySelect from "../../utils/query-select"
import {throttle} from "underscore"

const querySelectThrottle = throttle(querySelect,100)

Page({
  data:{
    musicBanner:[],
    imageHeight:0,
    recommendSongs:[],
    hotMenuList:[],
    screenWidth:0,
    recommentMenuList:[],
    rankingInfos:{},
    // 检测rankingInfos是否为空
    isRankingData:false,
    // 当前正在播放的歌曲
    currentSong:{},
    isPlaying:true
  },
  onLoad(){
    this.fetchGetMusicBanner()
    this.fetchGetHotMenuData()
    // this.fetchGetRecommedSong()
    recommendStore.onState('recommendSongInfo',(value)=>{
      if(!value.tracks) return
      this.setData({recommendSongs:value.tracks.slice(0,6)})
    })

    rankingStore.onState('newSongRanking',this.handleNewSongRanking)
    rankingStore.onState('originSongRanking',this.handleOriginSongRanking)
    rankingStore.onState('upSongRanking',this.handleUpSongRanking)

    recommendStore.dispatch('fetchRecommendSongAction')
    rankingStore.dispatch("fetchRankingDataAction")

    playerStore.onStates(['currentSong','isPlaying'],this.handlePlayInfos)
  },
  onClickInput(){
    wx.navigateTo({
      url: '../detail-search/detail-search',
    })
  },
  // 获取轮播图数据
  async fetchGetMusicBanner(){
      const res = await getMusicBanner()
      this.setData({
        musicBanner:res.banners
      })
  },
  async onBannerImageLoad(){
    const res = await querySelectThrottle('.banner-image')
      this.setData({
        imageHeight:res[0].height
      })
  },
  // 获取热门歌单数据
  async fetchGetHotMenuData(){
    const res = await getSongMenuList()
    const res1 = await getSongMenuList('欧美')
    this.setData({hotMenuList:res.playlists})
    this.setData({recommentMenuList:res1.playlists})
  },

  handleNewSongRanking(value){
    if(!value.name)return
    this.setData({isRankingData:true})
    const newRankingInfos = {...this.data.rankingInfos,newSongRanking:value}
    this.setData({rankingInfos:newRankingInfos})
  },
  handleOriginSongRanking(value){
    if(!value.name)return
    this.setData({isRankingData:true})
    const newRankingInfos = {...this.data.rankingInfos,originSongRanking:value}
    this.setData({rankingInfos:newRankingInfos})
  },
  handleUpSongRanking(value){
    if(!value.name)return
    this.setData({isRankingData:true})
    const newRankingInfos = {...this.data.rankingInfos,upSongRanking:value}
    this.setData({rankingInfos:newRankingInfos})
  },

  onRecommendMoreClick(){
    wx.navigateTo({
      url: '../detail-song/detail-song?type=recommend',
    })
  },

  handlePlayInfos({currentSong,isPlaying}){
    if (currentSong) {
      this.setData({currentSong})
    }
    if (isPlaying !== undefined) {
      this.setData({isPlaying})
    }
  },

  onSongItemTap(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState('playSongsList',this.data.recommendSongs)
    playerStore.setState('playSongsIndex',index)
  },

  onPauseOrPlayBtn(){
    playerStore.dispatch('changeMusicStatusAction')
  },

  onAlbumTap(){
    wx.navigateTo({
      // url: '/pages/music-player/music-player',
      url: '../../packagePlayer/pages/music-player/music-player'
    })
  },

  onunload(){
    recommendStore.offState('recommendSongInfo')
    rankingStore.offState("newSongRanking")
    rankingStore.offState("originSongRanking")
    rankingStore.offState("upSongRanking")
    playerStore.offState("currentSong")
  }
})
