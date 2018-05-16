/**
 * Created by weijian on 2017/6/23.
 */
function getTime(){
  var dateTime = new Date();
  var year = dateTime.getFullYear(); //年
  var month = dateTime.getMonth()+1;//月
  var date = dateTime.getDate();//日
  var hour = dateTime.getHours(); //时
  var minute = dateTime.getMinutes(); //分
  var second = dateTime.getSeconds(); //秒
  function f(t){
  	return t<10? '0'+t : t;
  }
 return year+"-"+f(month)+"-"+f(date)+" "+f(hour)+":"+f(minute)+":"+f(second); 
}
function getNowTime(timestamp){
  var dateTime = new Date(timestamp);
  var year = dateTime.getFullYear(); //年
  var month = dateTime.getMonth()+1;//月
  var date = dateTime.getDate();//日
  var hour = dateTime.getHours(); //时
  var minute = dateTime.getMinutes(); //分
  var second = dateTime.getSeconds(); //秒
  function f(t){
  	return t<10? '0'+t : t;
  }
 return year+"-"+f(month)+"-"+f(date)+" "+f(hour)+":"+f(minute)+":"+f(second); 
}
export default{
  getTime,
  getNowTime
}
