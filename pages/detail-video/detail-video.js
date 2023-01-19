// pages/detail-video/detail-video.js
import {getMVUrl,getMvInfo,getMvRelatedVideo} from '../../services/video'

Page({
  data:{
    id:undefined,
    mvUrl:undefined,
    mvInfo:{},
    relatedVideoList:[],
    danmuList:[
      {text:"哈哈哈好听的",color:"#ffffff",time:1},
      {text:"呵呵呵还不错",color:"#ffff00",time:10}
    ]
  },
  onLoad(options){
    const id = options.id
    this.setData({
      id
    })
    this.fetchMvUrl()
    this.getMvInfo()
    this.getMvRelatedVideo()
  },
  // 发请求拿到视频地址
  async fetchMvUrl(){
    const res = await getMVUrl(this.data.id)
    this.setData({
      mvUrl:res.data.url
    })
  },
  async getMvInfo(){
    const res = await getMvInfo(this.data.id)
    this.setData({
      mvInfo:res.data
    })
  },
  async getMvRelatedVideo(){
    const res = await getMvRelatedVideo(this.data.id)
    this.setData({
      relatedVideoList:res.data
    })
  }
})