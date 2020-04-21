// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env:"test-5qtqr"
})
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'handleState': {
      return handleState(event)
    }
    case 'handleDelete': {
      return handleDelete(event)
    }
    default: {
      return
    }
  }
}

async function handleState(event){
 try{
  let _id = event._id;
  let status = event.status;
  let finish_time = db.serverDate();
  if(!_id || !finish_time){
    return{
      code:0,
      mesagess:"缺少参数"
    }
  }
  await db.collection('todos').doc(_id).update({
   data:{
    status:!status, 
    finish_time
   }
  })
  return{
    code: 200
  }
 }catch(err){
   return{
     code:0,
     mesagess:"服务器错误"
   }
 }
}
async function handleDelete(event){
  try{
   let _id = event._id;
   if(!_id){
     return{
       code:0,
       mesagess:"缺少参数"
     }
   }
   await db.collection('todos').doc(_id).remove({
    success:function(res){
      console.log(res)
    }
   })
   await db.collection("todoKeyresult").where({
    todo_id:_id
   }).remove()
   return{
    code: 200,
    mesagess:"删除成功"
  }
  }catch(err){
    return{
      code:0,
      mesagess:"服务器错误"
    }
  }
 }