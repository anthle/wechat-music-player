export default function throttle(fn, interval, options = {
  leading: true,
  trailng: false
}) {
  let lastTime = 0
  let {
      leading,
      trailng
  } = options
  let timer = null
  const _throttle = function (...args) {
    return new Promise((resolve,reject)=>{
      let nowTime = new Date().getTime()
      if (!leading && !lastTime) lastTime = nowTime
      let remianTime = interval - (nowTime - lastTime)
      if (remianTime <= 0) {
          if (timer) {
              clearTimeout(timer)
          }
          const res = fn.apply(this, args)
          resolve(res)
          lastTime = nowTime
      }
      if (trailng && !timer) {
          timer = setTimeout(() => {
              timer = null
              lastTime = !leading ? 0 : new Date().getTime()
              const res = fn.apply(this, args)
              resolve(res)
          }, remianTime);
      }
    })
  }
  return _throttle
}