const App = getApp()
const db = wx.cloud.database()
Page({
  data:{
    okrData:[],
    todoId:'',
  },
  onLoad:function(options){
    console.log(options.id)
    this.setData({todoId:options.id})
  },
  onShow:function(){
    let _openid =  App.globalData.openid;
    let id = this.data.todoId;
    wx.cloud.callFunction({
      name: 'todokeyresult',
      data:{
      action: "getTodokey",
      _openid,
      id
      },
      success: res =>{
        console.log(res.result.okr)
       this.setData({okrData: res.result.okr})
      }
    })
  },
  handleOff:function(e){
    let todo_id = this.data.todoId;
    let keyresult_id = e.currentTarget.dataset.id
    wx.showModal({
      title: '你好',
      content: '确定取消绑定这条成果吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          wx.cloud.callFunction({
            name:'todokeyresult',
            data:{
              keyresult_id,
              todo_id,
              action:'handleOff'
            },
            success: res =>{
             if(res.result.code == 200){
               this.onShow()
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000
              })
             }else{
               console.log(res)
             }
            }
          })
        }
      }
    });
  },
  handleBind:function(e){
    let keyresult_id = e.currentTarget.dataset.id
    let todo_id = this.data.todoId;
    wx.showModal({
      title: '你好',
      content: '确定关联这条成果吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          db.collection('todoKeyresult').add({
            data:{
              todo_id,keyresult_id
            },
            success: res =>{
                this.onShow()
               wx.showToast({
                 title: '关联成功',
                 icon: 'success',
                 duration: 2000
               })
             }
           })
        }
      }
    });

  }
})