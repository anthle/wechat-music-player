import jlRequest from './index'

export function getSongDetail(ids){
  return jlRequest.get({
    url:"/song/detail",
    data:{
      ids
    }
  })
}

export function getSonglyric(id){
  return jlRequest.get({
    url:"/lyric",
    data:{
      id
    }
  })
}