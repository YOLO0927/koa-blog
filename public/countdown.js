exports.countdown = (date) => {
  var currTime = new Date().getTime()
  var countdownTime = currTime - date.getTime()
  var second = countdownTime / 1000
  if (second < 60) {
    return '更新于 1 分钟前'
  } else if (second >= 60 && second < 3600) {
    return `更新于 ${parseInt(second / 60)} 分钟前`
  } else if (second >= 3600 && second < 3600 * 24) {
    return `更新于 ${parseInt(second / 3600)} 小时之前`
  } else if (second >= 3600 * 24) {
    return `更新于 ${parseInt(second / (3600 * 24))} 天之前`
  }
}
