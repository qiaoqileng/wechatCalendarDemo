// miniprogram/pages/calendar/calendar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:new Date(),
    year: 0,
    month: 0,
    dayInMonth: 0,
    days:0,
    week: ['日', '一', '二', '三', '四', '五', '六'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // TODO 设置默认今天
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

  refreshDays:function(year,month,dayInMonth){
    let tempDate = new Date(year, month, 0)
    let dayCount = tempDate.getDate()
    tempDate.setDate(1)
    let firstDayInWeek = tempDate.getDay()
    let days = new Array(dayCount + firstDayInWeek).fill('').map((item, index) => {
      let title = index - firstDayInWeek + 1
      let select = dayInMonth === title
      return { title, select }
    })
    return days
  },

  onDayClick :function(event){
    console.log(event)
    let {day} = event.currentTarget.dataset
    let days = this.refreshDays(this.data.year, this.data.month, day)
    this.setData({days,dayInMonth:day})
  },
  onDaySelected:function(event){
    console.log(event)
    let { day } = event.currentTarget.dataset

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})