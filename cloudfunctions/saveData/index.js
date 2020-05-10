// 云函数入口文件
const cloud = require('wx-server-sdk')
/**
 * 默认计算后3个月
 */
function getResultDays(targetDays, dateRange = 3, period = 28, duration = 3) {
  let resultDays = [...targetDays]
  if (Array.isArray(resultDays) && resultDays.length > 0) {
    period = typeof period === 'undefined' ? 28 : period
    duration = typeof duration === 'undefined' ? 3 : duration
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
    if (resultDays.length > 1) { //大于一组的数据才算平均数,否则还是原来的数据
      const durAvgMethod = (a, b) => (a.length + b.length) / 2
      let _duration = resultDays.reduce(durAvgMethod)
      let first = resultDays[0]
      let end = resultDays[resultDays.length - 1]
      let _period = (end[end.length - 1] - first[0]) / (resultDays.length - 1)
      period = (period + _period) / 2
      duration = (duration + _duration) / 2
    }
    console.log('period:' + period)
    console.log('duration:' + duration)
    // 计算预测日期
    let i
    for (i = 0; i < dateRange; i++) {
      let lastItem = resultDays[resultDays.length - 1]
      let lastDay = lastItem[lastItem.length - 1]
      let newItem = []
      let j
      for (j = 0; j < Math.floor(duration); j++) {
        let dateMill = lastDay.mills + (period + j) * 24 * 3600 * 1000
        let date = new Date(dateMill)
        let item = {
          day: date.getDate(),
          select: true,
          date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
          mills: dateMill
        }
        console.log('预测的第' + i + '个周期:')
        console.log(item)
        newItem.push(item)
      }
      resultDays.push(newItem)
    }
  }
  return {
    resultDays,
    period,
    duration
  }
}

function getDateValue(a) {
  if (Array.isArray(a) && a.length > 0) {
    return a.mills
  }
}

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  return new Promise((resolve, reject) => {
    let {
      targetDays
    } = event

    let { OPENID, UNIONID } = cloud.getWXContext()
    db.collection('ymd_data').where({
      unionid: UNIONID,
      openId: OPENID
    }).get().then(res => {
      console.log(res)
      let {data} = res

      let _id
      let period
      let duration
      let dateRange
      if(Array.isArray(data) && data.length > 0){
        _id = data[0]._id
        period = data[0].period
        duration = data[0].duration
        dateRange = data[0].dateRange
      }
      let {
        resultDays,
        period: _period,
        duration: _duration
      } = getResultDays(targetDays, dateRange, period, duration)
      if (typeof _id === 'undefined') {
        db.collection('ymd_data').add({
          data: {
            unionid: UNIONID,
            openId: OPENID,
            period: 28,
            duration: 3,
            dateRange: 3,
            targetDays
          }
        }).then(res => {
          console.log(res)
          resolve({
            success: true,
            msg: '',
            resultDays,
            period: _period,
            duration: _duration
          })
        }).catch(err => {
          console.log(err)
          reject({
            success: false,
            msg: err
          })
        })
      } else {
        db.collection('ymd_data').doc(_id).update({
          data: {
            unionid: UNIONID,
            openId: OPENID,
            targetDays, 
            period: _period,
            duration: _duration
          }
        }).then(res => {
          console.log(res)
          resolve({
            success: true,
            msg: '',
            resultDays,
            period: _period,
            duration: _duration
          })
        }).catch(err => {
          console.log(err)
          reject({
            success: false,
            msg: err
          })
        })
      }
    }).catch(err => {
      console.log(err)
      reject({
        success: false,
        msg: err
      })
    })
  })
}