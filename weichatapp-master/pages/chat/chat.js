// pages/contact/contact.js
const app = getApp();
var inputVal = '';
var msgList = [];
//var key='4df93a740973db51a50ff9dea1304f80.XwsWdfe2xyxYnvRy'; //存放API秘钥1
var key='6e30fbcc202f5013028d92d7098fef3b.i22ixkhUroSuO6Yv'; //我的API秘钥

var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;

var model="chatglm_lite";   //选择模型 轻量级


//var _url= 'http://47.96.133.86:5000/'; //我的服务器接口
//var _url= 'http://47.115.23.82:5000/'; //服务器接口
var _url='https://ai.stdiet.top'
//var _url='https://open.bigmodel.cn/api/paas/v3/model-api/chatglm_lite/sse_invoke';


/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';
 
  msgList = [{
      speaker: 'server',
      contentType: 'text',
      content: '您好，我是您的个人AI助手！您可以问我问题，问题太复杂我需要时间思考哦，请您耐心等待！'
    },
    {
      speaker: 'customer',
      contentType: 'text',
      content: '好的'
    }
  ]
  that.setData({
    msgList,
    inputVal
  })
 
}

/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//   var query = wx.createSelectorQuery();
//   query.select('.scrollMsg').boundingClientRect(function(rect) {
//   }).exec();
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    initData(this);
    this.setData({
      //cusHeadIcon: app.globalData.userInfo.avatarUrl,
    });
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
   * 获取聚焦
   */
  focus: function(e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);
    this.pageScrollToBottom();
  },

  //失去聚焦(软键盘消失)
  blur: function(e) {
  
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      inputVal:e.detail.value,
      toView: 'msg-' + (msgList.length - 1)
    })
    this.pageScrollToBottom();
  },
  
//页面自动滚动到底部
pageScrollToBottom:function(){
  wx.createSelectorQuery().select('#scrollpage').boundingClientRect(function(rect){
       
      wx.pageScrollTo({
          scrollTop: windowHeight,
          duration: 100
      });
  }).exec()
},

  /**
   * 发送点击监听
   */
  
   
  sendClick: function(e) {
    wx.setNavigationBarTitle({
      title: "胜唐AI输入中"
  })
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: this.data.inputVal
    })
    let that = this;
    inputVal = '';
   
    wx.request({
      url: _url, 
      data:{
          APIModel:model,
          APIkey:key,
          info: this.data.inputVal
      },
      
      //封装返回数据格式
      header: {
          'Content-Type': 'application/json'
      },
      //请求成功的回调
      success: function(res) {
       // console.log(res.data);
        
        let data = res.data;
        //console.log(res.data);
      
        msgList.push({
          speaker:  'server',
          contentType: 'text',
          content: res.data
        })
        //调用set方法，告诉系统数据已经改变   启动循环，循环聊天信息
        that.setData({
          msgList,
          inputVal
        })
        that.pageScrollToBottom();
        wx.setNavigationBarTitle({
          title: "AI小助手"
      })
      }
      
    })
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });
    that.pageScrollToBottom();

  },

  
  /**
   * 退回上一页
   */
  toBackClick: function() {
    wx.navigateBack({})
  }

})
