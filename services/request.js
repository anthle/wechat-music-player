class JLRequest{
  constructor(basrUrl){
    this.baseUrl = basrUrl
  }

  request(options){
    const {url} = options
    return new Promise((resovle,reject)=>{
      wx.request({
        ...options,
        url:this.baseUrl + url,
        success:(res)=>{
          resovle(res.data)
        },
        fail:(err)=>{
          console.log(err);
        }
      })
    })
  }
  get(options){
    return this.request({
      ...options,
      method:'get'
    })
  }
  post(options){
    return this.request({
      ...options,
      method:'post'
    })
  }
}

export const jlRequest = new JLRequest('http://codercba.com:9002')
// export const jlRequest = new JLRequest('https://coderwhy-music.vercel.app/')