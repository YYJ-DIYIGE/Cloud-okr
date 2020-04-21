const App = getApp();
const db = wx.cloud.database() 
Page({
  data:{
    objTxet:'',
    keyresults:[],
    id:'',
    deleID:[]
  },
  onLoad:function(options){
    this.setData({id:options.id})
    this.getOkrEdit()
  },
 getOkrEdit:function(){
   let _id = this.data.id
   db.collection('object').doc(_id).get({
     success: res =>{
      this.setData({objTxet:res.data.title})
     }
   })
   db.collection('keyresult').where({objective_id:_id}).get({
    success:result =>{
      this.setData({keyresults:result.data})
    }
  })
 },
 handleChangeObjective:function(e){
   let vaule = e.detail.value
   this.setData({objTxet:vaule})
 },
 handleChangeKeyresult:function(e){
   let index = e.target.dataset.index;
   let value = e.detail.value
   let keyresults = this.data.keyresults;
   keyresults[index].title = value
   this.setData({keyresults})
   console.log(this.data.keyresults)
 },
 handleAddKeyresult:function(){
   let keyresults = this.data.keyresults;
   keyresults.push({title:''})
   this.setData({keyresults})
 },
 handleDeleteKeyresult:function(e){
  let index = e.target.dataset.index;
  let keyresults = this.data.keyresults;
  let id = e.currentTarget.dataset.id;
  let deleID = this.data.deleID;
  id ? deleID.push(id) : false;
  keyresults.splice(index,1)
  this.setData({keyresults,deleID})
  console.log(keyresults,deleID)
 },
 handleSubmit:function(){
  const _openid = App.globalData.openid;
  let _id = this.data.id;
  let objTxet = this.data.objTxet;
  let keyresults = this.data.keyresults;
  let deleID = this.data.deleID;
  let create_time = db.serverDate();
  let status = false;
  let finish_time = ''
  if(!objTxet || !keyresults){
    wx.showToast({
      title: '目标和成果为必填项目',
      icon: 'none',
      duration: 2000,
      mask: true,
    })
    return
  }
  let tmp = keyresults.every( data => data.title);
  if(!tmp){
    wx.showToast({
      title: '所添加成果为必填',
      icon: 'none',
      mask: true,
      duration: 2000
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
  db.collection('object').doc(_id).update({
    data:{
      title:objTxet,create_time:create_time
    },
    success: res =>{
      keyresults.forEach(async (data) => {
        if(data._id){
          await db.collection('keyresult').where({_id:data._id}).update({
           data:{
            title:data.title,create_time:create_time
           }
          })
        }else{
          await db.collection("keyresult").add({
            data:{
              title:data.title, objective_id:_id, create_time, status, finish_time
            }
          })
        }
      })
      deleID.forEach(async (data) =>{
          let _id = data
          await db.collection('keyresult').doc(_id).remove({
            success:res =>{
              wx.showToast({
                title: '添加成功',
                icon: 'none',
                duration: 1000,
                mask: true,
              })
              setTimeout(()=>{
                wx.switchTab({url: "/pages/okr/okr"})
              },1000)
            }
          })
        })
        wx.showToast({
          title: '添加成功',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
        setTimeout(()=>{
          wx.switchTab({url: "/pages/okr/okr"})
        },1000)
    },fail: err =>{
      console.log(err)
      wx.showToast({
        icon: 'none',
        title: '服务器错误'
      })
    }
  })
  
  // wx.cloud.callFunction({
  //   name:"okr",
  //   data:{
  //     action: "updateEdit",
  //     id,
  //     objTxet,
  //     keyresults,
  //     deleID
  //   },
  //   success:res =>{
  //     if(res.result.code === 200){
  //       this.getOkrEdit()
  //       wx.showToast({
  //         title: '修改成功',
  //         icon: 'success',
  //         duration: 2000
  //       })     
  //     }else{
  //       wx.showToast({
  //         icon: 'none',
  //         title: '修改失败'
  //       })
  //     }
  //   },
  //   fail: err => {
  //     console.log(err)
  //     wx.showToast({
  //       icon: 'none',
  //       title: '服务器错误'
  //     })
  //   }
  // })
 }
})