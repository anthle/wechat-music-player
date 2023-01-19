import{jlRequest} from './request'

export function getMusicBanner(type=0){
  return jlRequest.get({
    url:'/banner',
    data:{
      type
    }
  })
}

export function getRecommendSongData(id){
  return jlRequest.get({
    url:'/playlist/detail',
    data:{
      id
    }
  })
}

export function getSongMenuList(cat="全部",limit=6,offset=0){
  return jlRequest.get({
    url:'/top/playlist',
    data:{
      cat,
      limit,
      offset
    }
  })
}

export function getHotSongMenu(){
  return jlRequest.get({
    url:"/playlist/hot"
  })
}