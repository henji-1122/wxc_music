// pages/search/search.js

import request from '../../utils/request'

let isSend = false // 函数节流使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placehoderContent: '', // placehoder内容
    hotList: [], // 热搜榜列表
    searchContent: '', //用户输入内容
    searchList: [], // 莫不匹配的数据
    historyList: [], // 搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
    this.getHotList()
    this.getSearchHistory()  // 获取立即记录
  },

  // 获取初始化数据
  async getInitData(){
    let placehoderData = await request('/search/default')
    this.setData({
      placehoderContent: placehoderData.data.showKeyword
    })
  },

  // 获取本地历史记录
  getSearchHistory(){
    let historyList = wx.getStorageSync('searchHistory')
    if(historyList){
      this.setData({
        historyList
      })
    }
  },

  // 热搜榜列表
  async getHotList(){
    let hotListData = await request('/search/hot/detail')
    this.setData({
      hotList: hotListData.data
    })
  },

  // 输入框内容发生改变的回调
  handleInputChange(event){
    console.log(event)
    this.setData({
      searchContent: event.detail.value.trim()
    })

    if(isSend){
      return
    }
    isSend = true
    this.getSearchList()
    // 函数节流
    setTimeout (() => {
      isSend = false
    },300)
  },

  // 情况输入框内容
  clearSearchContent(){
    this.setData({
      searchContent: '',
      searchList: []
    })
  },

  // 清空搜索历史记录
  deleteSearchHistory(){
    wx.showModal({
      content:"确认删除吗？",
      success:(res)=>{
        if(res.confirm){
          this.setData({
            historyList: []
          })
          wx.removeStorageSync('searchHistory')
        }
      }
    })
  },

  // 获取搜索数据的功能函数
  async getSearchList(){
    // 如果没有输入搜索内容，则不发请求且清空匹配列表
    let {searchContent, historyList} = this.data
    if(!searchContent){
      this.setData({
        searchList:[]
      })
      return
    }
    // 发请求获取输入关键字模糊匹配数据
    let searchListData = await request('/search', {keywords:searchContent, limit:10})
    this.setData({
      searchList: searchListData.result.songs
    })

    // 将搜索关键字添加到搜索历史记录中
    if(historyList.indexOf(searchContent) !== -1){  // 如果存在相同搜索记录则删除
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent)
    this.setData({
      historyList
    })
    wx.setStorageSync('searchHistory', historyList)
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