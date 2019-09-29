// miniprogram/pages/calendar/calendar.js
import calendarUtils from '../../utils/calendarUtils.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: new Date(),
    year: 0,
    month: 0,
    dayInMonth: 0,
    days: 0,
    editMode: false,
    week: ['日', '一', '二', '三', '四', '五', '六'],
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // TODO 设置默认今天
    this.childDates = []
    this.targetDays = [] //TODO getData
    this.resultDays = [...this.targetDays]

    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let dayInMonth = date.getDate()
    let days = this.refreshDays(year, month, dayInMonth)

    this.setData({
      date,
      year,
      month,
      dayInMonth,
      days
    })
  },

  refreshDays: function (year = this.data.year, month = this.data.month, dayInMonth=this.data.dayInMonth) {
    let key = `${year}-${month}`
    if (typeof this.cacheMonthMap === 'undefined') {
      this.cacheMonthMap = {}
    }
    let days = this.cacheMonthMap[key]
    if (typeof days === 'undefined') {
      let tempDate = new Date(year, month, 0)
      let dayCount = tempDate.getDate()
      tempDate.setDate(1)
      let firstDayInWeek = tempDate.getDay()
      days = new Array(dayCount + firstDayInWeek).fill('').map((item, index) => {
        let day = index - firstDayInWeek + 1
        let date = `${year}-${month}-${day}`
        let select
        if (this.data.editMode) {
          if (this.validateTempData(this.targetDays, date)) {
            select = true
          } else {
            select = false
          }
        } else {
          if (this.validateTempData(this.resultDays, date)) {
            select = true
          } else {
            select = false
          }
          select = day === dayInMonth
        }
        return {
          day,
          select,
          date,
          mills: new Date(date).getTime()
        }
      })
      this.cacheMonthMap[key] = days
    } else {
      days.forEach(item => {
        if (this.data.editMode) {// 如果是编辑模式,则判断真实数组
          if (this.validateTempData(this.targetDays,item.date)) {
            item.select = true
          } else {
            item.select = false
          }
        } else {//如果是展示模式,则展示预测计算过的数组
          if (this.validateTempData(this.resultDays, item.date)) {
            item.select = true
          } else {
            item.select = false
          }
          // TODO 用户点击的选中
          item.select = item.day === dayInMonth
        }
      })
    }
    return days
  },

  onDayClick: function(event) {
    console.log(event)
    let {
      item
    } = event.currentTarget.dataset
    this.fillTempDatas(item)
    let days = this.refreshDays(this.data.year, this.data.month, item.day)
    this.setData({
      days,
      dayInMonth: item.day
    })
  },

  fillTempDatas: function(item) {
    let find = false
    this.targetDays.forEach(t => {
      if (t.sort().toString() === this.childDates.sort().toString()) {
        find = true
        if (Array.isArray(t) && t.includes(item)) {
          t.splice(t.indexOf(item), 1)
        } else {
          t.push(item)
        }
      }
    })
    if (!find) {
      this.childDates = [item]
      this.targetDays.push(this.childDates)
    }
  },

  validateTempData: function(array, date) {
    if (Array.isArray(array) && array.length > 0) {
      let find = array.find(s => {
        if (Array.isArray(s)) {
          let _find = s.find(d => d.date === date)
          if (typeof _find !== 'undefined') {
            return true
          }
        }
        return false
      })
      if (find) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  },
  onSetting: function(event) {
    this.tempDatas = this.targetDays
    this.setData({
      editMode: true
    })
  },
  onCancel: function(event) {
    this.targetDays = this.tempDatas
    this.tempDatas = []
    this.childDates = []
    let days = this.refreshDays()
    this.setData({
      editMode: false, days
    })
  },
  onConfirm: function(event) {
    this.childDates = []
    this.targetDays = this.tempDatas
    this.resultDays = calendarUtils.getResultDays(this.targetDays)
    let days = this.refreshDays()
    this.setData({
      editMode: false, days
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})