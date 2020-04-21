const App = getApp();

Page({
  onLoad:function(){
    App.getUserInfo().then(res => {
      console.log(res)
      let nickName = res.nickName
      if(nickName){
        wx.showToast({
          title: '已授权，正在跳转页面',
          icon: 'none',
          duration: 5000,
          mask: false,
          success: (result)=>{
            setTimeout(() =>{
              wx.switchTab({
                url:"/pages/todos/todos"
              })
            }, 3000);
          }
        });
      }
    })
  },
  login:function(e){
    if(e.detail.userInfo){
      App.globalData.userInfo = e.detail.userInfo
      App.getUserInfo().then(res => {
        console.log(res)
        let nickName = res.nickName
        if(nickName){
          wx.showToast({
            title: '已授权，正在跳转页面',
            icon: 'none',
            duration: 5000,
            mask: false,
            success: (result)=>{
              setTimeout(() =>{
                wx.switchTab({
                  url:"/pages/todos/todos"
                })
              }, 3000);
            }
          });
        }
      })
      // console.log(App.globalData._openid)
      // setTimeout(() =>{
      //   wx.switchTab({
      //     url:"/pages/todos/todos"
      //   })
      // }, 1000);
    }
  }
})