import { jlRequest} from './request'

export function getTopMv(offset = 0,limit = 20 ){
  return jlRequest.get({
    url:"/top/mv",
    data:{
      limit,
      offset
    }
  })
}

export function getMVUrl(id){
  return jlRequest.get({
    url:"/mv/url",
    data:{
      id
    }
  })
}

export function getMvInfo(mvid){
  return jlRequest.get({
    url:"/mv/detail",
    data:{
      mvid
    }
  })
}

export function getMvRelatedVideo(id){
  return jlRequest.get({
    url:"/related/allvideo",
    data:{
      id
    }
  })
}