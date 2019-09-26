// miniprogram/pages/calendar/calendar.js
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
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let dayInMonth = date.getDate()
    let days = this.refreshDays(year, month, dayInMonth)
    
    this.targetDays = []
    this.resultDays = []
    this.setData({
      date,
      year,
      month,
      dayInMonth,
      days
    })
  },

  refreshDays: function(year, month, dayInMonth) {
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
          if (Array.isArray(this.tempDatas) && this.validateTempData(date)) {
            select = true
          } else {
            select = false
          }
        } else {
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
        if (this.data.editMode) {
          if (Array.isArray(this.tempDatas) && this.validateTempData(item.date)) {
            item.select = true
          } else {
            item.select = false
          }
        } else {
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
    if (typeof this.tempDatas === 'undefined') {
      this.tempDatas = []
    }
    let find = this.validateTempData(item.date)
    if (find) {
      this.tempDatas.splice(this.tempDatas.indexOf(find), 1)
    } else {
      this.tempDatas.push(item)
    }
  },
  validateTempData:function(date){
    let find = this.tempDatas.find(s => {
      if(Array.isArray(s)){
        let find = s.find(d=>d.date === date)
        if(typeof find !== 'undefined'){
          return true
        }
      }
      return false
    })
  },
  onSetting: function(event) {
    this.tempDatas = this.targetDays
    this.setData({
      editMode: true
    })
  },
  onCancel: function(event) {
    this.tempDatas = []
    this.setData({
      editMode: false
    })
  },
  onConfirm: function(event) {
    this.targetDays = this.tempDatas
    this.setData({
      editMode: false
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