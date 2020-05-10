// 云函数入口文件
const cloud = require('wx-server-sdk')
const rq = require('request-promise')//通过npm引入request-promise包,可用可不用

cloud.init()
const db = cloud.database();
const appId = 'wx3a01eadf5fd18ed2'
const appSecret = 'f25c6bba9526eca3b821a3e710726e66'
const COLLNAME = 'publicField';//云函数数据库的数据集名
const FIELDNAME = 'ACCESS_TOKEN'//数据type 

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let res = await rq({
      method: 'GET',
      uri: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + appSecret,
    });
    res = JSON.parse(res)//获取AccessToken
    let now = new Date();//当前时间
    let resUpdate = await db.collection(COLLNAME).where({
      type: FIELDNAME
    }).update({//存入云函数数据库
      data: {
        token: res.access_token,
        time: now,
      }
    })
  } catch (e) {
    console.error(e)
  }
}