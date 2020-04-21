const db = wx.cloud.database()
const App = getApp();
Page({
  data:{
    objective:'',
    keyresults:[{
      title:''
    }]
  },
  handleChangeObjective:function(e){
    let objective = e.detail.value;
    this.setData({objective})
  },
  handleChangeKeyresult:function(e){
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index;
    let keyresults = this.data.keyresults;
    keyresults[index].title = value;
    this.setData({keyresults}) 
  },
  handleAddKeyresult:function(){
    let keyresults = this.data.keyresults;
    keyresults.push({title:''})
    this.setData({keyresults})
  },
  handleDeleteKeyresult:function(e){
    let index = e.currentTarget.dataset.index;
    let keyresults = this.data.keyresults;
    keyresults.splice(index,1);
    this.setData({keyresults})
  },
  handleSubmit:function(){
    const _openid = App.globalData.openid;
    let keyresults = this.data.keyresults;
    let objective = this.data.objective;
    let create_time = db.serverDate();
    let finish_time = '';
    let status = false;
    if(!keyresults || !objective){
      wx.showToast({
        title: '目标和成果为必填项目',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return
    }
    if(!_openid){
      wx.showToast({
        icon: 'none',
        title: '请授权登录后操作',
      })
      return
    }
    db.collection('object').add({
      data:{
       title:objective, create_time, finish_time, status
      },
      success: (res) =>{
        keyresults.forEach(async(data) => {
         await db.collection('keyresult').add({
           data:{
            title:data.title, objective_id:res._id, create_time, status, finish_time
           },
          success:(result) =>{
            wx.showToast({
              icon: 'none',
              title: '添加成功'
            })
            setTimeout(()=>{
              wx.switchTab({url: "/pages/okr/okr"})
            },1000)
           },
          fail: err => {
            console.log(err)
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
          }
          })
        });
       },
       fail: err => {
        console.log(err)
        wx.showToast({
          icon: 'none',
          title: '服务器错误'
        })
      }
    })
  }
})