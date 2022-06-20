// pages/takephoto/takephoto.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null
    complete: false
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
    if (wx.createCameraContext()) {
      this.cameraContext = wx.createCameraContext('myCamera')
      this.drawProgressbg();
      // this.drawCircle();
      this.countInterval();
    } else {
     
    }
    // this.bindChooiceProduct()
  },
  takePhoto(){
    wx.showLoading({
      title: '人脸识别中',
      mask: true
    })
    var that=this
    const ctx=wx.createCameraContext()
    ctx.takePhoto({
      quality:'high',
      success: (res) =>{
        var imgbase64Url = wx.getFileSystemManager().readFileSync(res.tempImagePath, "base64");
        that.setData({
          imgbase64Url:imgbase64Url
        })
        this.uploadImg()
      },
      fail: () => {
      },
      complete: () => {

      }
    })
  
  },
  error(e) {
    console.log(e.detail)
  },
  startdrawCanvas(){
    console.log('相机初始化成功')
  },
  //进行人脸识别
  uploadImg(){
    let that=this
   wx.request({
    url: 'https://aip.baidubce.com/oauth/2.0/token', //真实的接口地址
    data: {
     grant_type: 'client_credentials',
     client_id: 'Op7c9oaeCA3iobVU1WQlmWqs',//用你创建的应用的API Key
     client_secret: 'NhS6Rz4Pge6z7dz0xhHcHT0nt75IAPXm'//用你创建的应用的Secret Key
    },
    header: {
     'Content-Type': 'application/json' // 默认值
    },
    success(res) {
      that.setData({
       token: res.data.access_token//获取到token
      })
      //上传人脸进行比对
       wx.request({
        url: 'https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=' + that.data.token,
        method: 'POST',
        data: {
         image: that.data.imgbase64Url,
         image_type: 'BASE64',
         group_id_list: 'test2'//自己建的用户组id
        },
        header: {
         'Content-Type': 'application/json' // 默认值
        },
        
        success: res=>{
          wx.hideLoading()
          if(res.data.error_msg=='pic not has face'){
            that.goBack('未捕捉到人脸，请重新录入')
          }else{
            if(res.data.result.user_list[0].score>90){
              that.goBack('验证成功')
              //验证通过，跳转至管理页面
              setTimeout(function(){
                wx.navigateTo({
                  url: '../index2/index2',
              })
              },2)
              
            }else{
              that.goBack('人脸匹配失败，请重新录入')
            }

          }



          
        }
       })



    }

   })
  },
   
   //添加Banner  
   bindChooiceProduct: function () {
    var that = this;
   
  },
  goBack(info){
    wx.showToast({
      title: info,
      icon: 'success',
      duration: 1000
     })
    // setTimeout(function(){
    //   wx.navigateBack();
    // },2000)
  },

  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(5); // 设置圆环的宽度
    ctx.setStrokeStyle('#a9a9a9'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    //设置一个原点(100,100)，半径为90的圆的路径到当前路径
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#2661DD");
    gradient.addColorStop("0.5", "#2661DD");
    gradient.addColorStop("1.0", "#2661DD");
    context.setLineWidth(5);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(110, 110, 100, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  countInterval: function () {
    // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈
    this.countTimer = setInterval(() => {
      if (this.data.count <= 10) {
        /* 绘制彩色圆环进度条
        注意此处 传参 step 取值范围是0到2，
        所以 计数器 最大值 60 对应 2 做处理，计数器count=60的时候step=2
        */
        this.drawCircle(this.data.count / (10 / 2))
        this.data.count++;
      } else {
        this.setData({
          complete: true
        });
        clearInterval(this.countTimer);
      }
    }, 10)
  },
  complateDis(){
    this.takePhoto()
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
