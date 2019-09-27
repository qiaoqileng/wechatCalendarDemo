/**
 * 默认计算后3个月
 */
export const getResultDays = (targetDays, dateRange = 3) => {
  let resultDays = [...targetDays]
  if (Array.isArray(resultDays) && resultDays.length > 0) {
    let period = 28
    let duration = 3
    // 排序
    resultDays.sort((a, b) => {
      let aValue = getDateValue(a)
      let bValue = getDateValue(b)
      if (aValue < bValue) {
        return -1;
      } else if (bValue > bValue) {
        return 1;
      }
      return 0;
    })
    // 计算平均时长和周期
    const durAvgMethod = (a, b) => (a.length + b.length) / 2
    let _duration = resultDays.reduce(durAvgMethod)
    let first = resultDays[0]
    let end = resultDays[resultDays.length - 1]
    let _period = (end[end.length - 1] - first[0]) / (resultDays.length - 1)
    period = (period + _period) / 2
    duration = (duration + _duration) / 2
    // 计算预测日期
    for (i = 0; i < dateRange; i++) {
      let lastItem = resultDays[resultDays.length - 1]
      let lastDay = lastItem[lastItem.length - 1]
      let newItem = []
      for (j = 0; i < Math.floor(duration); j++) {
        let dateMill = lastDay.mills + (period + j) * 24 * 3600 * 1000
        let date = new Date(dateMill)
        let item = {
          day: date.getDate(),
          select: true,
          date,
          mills: dateMill
        }
        newItem.push(item)
      }
      resultDays.push(newItem)
    }
  }
  return resultDays
}

export const getDateValue = (a) => {
  if (Array.isArray(a) && a.length > 0) {
    return a.mills
  }
}