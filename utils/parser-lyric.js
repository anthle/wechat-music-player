import { result } from "underscore";

const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
export function parseLyric(lyricString){
  const lyricInfos = []
  const lyricLines = lyricString.split("\n")
  for (const lineString of lyricLines) {
    const results = timeReg.exec(lineString)
    if(!results) continue
    const minute = results[1] * 60 * 1000
    const seconds = results[2] * 1000
    const milliseconds = results[3].length===2 ? results[3] * 10 : results[3] * 1  
    const time = minute + seconds + milliseconds
    const text = lineString.replace(timeReg,'')
    const lyricInfo = {
      text,
      time
    }
    lyricInfos.push(lyricInfo)
  }
  return lyricInfos
}