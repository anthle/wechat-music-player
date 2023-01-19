// pages/main-video/main-video.js'
import { jlRequest } from '../../services/request'
import { getTopMv} from '../../services/video'

Page({
  data:{
    videoList:[],
    offset:0,
    hasMore:true
  },
  onLoad(){
    this.fetchTopMv()
  },
  async fetchTopMv(){
    const res = await getTopMv(this.data.offset)
    const newVideoList = [...this.data.videoList,...res.data]
    this.setData({
      videoList:newVideoList
    })
    this.data.offset = this.data.videoList.length
    console.log(res.hasMore);
    this.data.hasMore = res.hasMore
  },
  // 上拉加载更多
  onReachBottom(){
    if(!this.data.hasMore) return
    this.fetchTopMv()
  },
  
  async onPullDownRefresh(){
    // 重置数据
    this.data.videoList=[]
    this.data.offset = 0
    this.data.hasMore = true

    await this.fetchTopMv()
    wx.stopPullDownRefresh()
  }
})