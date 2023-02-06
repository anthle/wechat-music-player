export function randomPlayFilter(ctx){
  const index = Math.floor(Math.random()*(ctx.playSongsList.length))
  if (index === ctx.playSongsIndex) {
    return randomPlayFilter(ctx)
  }
  return index
}