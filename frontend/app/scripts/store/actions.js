import * as types from './mutation-types';
import axios from 'axios';
import api from '../config/api';
import {hex_md5} from '../lib/md5'


const actions = {
  getDimensions({ commit },dimensions){
    
    commit(types.GET_DIMENSIONS, { dimensions });
  },
  async getMenu({ commit ,state}) {
  //  let response = await axios.get(api.global.getMenu);
    //let menus = response.data;
    //commit(types.MENUS, { menus });
  },
  //获取舆情方案列表
  async getYuqingPlan({ commit },that){
    let time =Date.parse(new Date())/1000
    let md5 = hex_md5('yiban'+time);
    axios.get(api.menu.getYuqingPlan,{
      params:{
        page:"1",
        uid:sessionStorage.yuqingUid,
        encrypt:md5,
        time:time
      }

    })
    .then((resp) => {
      var dataArr = resp.data.data;
      if(dataArr instanceof Array){
        var yuqingPlan = [];
        for(var index in dataArr){
          let tmp = {};
          tmp.id = dataArr[index].id;
          tmp.name = dataArr[index].jobName;
          tmp.keyWord = dataArr[index].keyWord;
          tmp.isWarn = dataArr[index].isWarn;
          yuqingPlan.push(tmp)
        }
        commit(types.GET_YUQING,{yuqingPlan})
        if(sessionStorage.yuqingId == undefined && sessionStorage.isAddyuqing == 'true'){
          sessionStorage.yuqingId=yuqingPlan[0].id;;
          localStorage.yuqingName=yuqingPlan[0].name;
          localStorage.yuqingWords = yuqingPlan[0].keyWord;
          localStorage.isWarn = yuqingPlan[0].isWarn
        }
        if(that){
          let yuqingId = sessionStorage.yuqingId;
          that.getYuqing({sid:yuqingId,getYuqingNum:that.getYuqingNum});
          that.getYuqingNum();
          that.getDimensions({sid:yuqingId})
        }
      }else{
        commit(types.GET_YUQING,{dataArr})
      }
    })

  },
  //获取信息列表
  async getYuqing({ commit },obj){ 
    if(sessionStorage.yuqingId == undefined){
         return false;
    }
    let time =Date.parse(new Date())/1000;
    let md5 = hex_md5('yiban'+time);
    let response = await axios.get(api.menu.getYuqing,{
      params:{
        page:obj.page||1,
        sid:sessionStorage.yuqingId,
        sort:'desc',
        encrypt:md5,
        time:time
      }
    })
    let plans = response.data;
    let plansList = plans.data;
    let source;
    if(plansList instanceof Array){
     plans.judgment = true;
     plans.noData = false;
     for(let i =0; i<plansList.length;i++){
       plansList[i].publishTime = formatDate(plansList[i].publishTime);
       if(plansList[i].source == 0){
        source = '腾讯新闻';
      }
      if(plansList[i].source == 2){
        source = '知乎';
      }
      if(plansList[i].source == 3){
        source = '网易新闻';
      }
      plansList[i].source = source;
      if(plansList[i].cn>=200){
        plansList[i].cn = '200以上'
      }
    }

    
  }else{
    plans.judgment = false;
    plans.noData = false;
    plans.isWarn = true;
    if(localStorage.isWarn == 1 || sessionStorage.isWarn == 'true'){
    plans.isWarn = false;
    var startTime = new Date().getTime();
    var timer = window.setInterval(function(){
            //两分钟后停止定时器
            if(new Date().getTime() - startTime > 120000){ //120000 2分钟
              window.clearInterval(timer);
              plans.isWarn = true;
              sessionStorage.isWarn = false
            }   
            
            axios.get(api.menu.getYuqing,{
             params:{
              page:obj.page||1,
              sid:sessionStorage.yuqingId,
              sort:'desc',
              encrypt:md5,
              time:time
            }
          })
            .then((resp) => {
              let plans = resp.data;
              let plansList = plans.data;
              let source;
              if(plansList instanceof Array){
                obj.getYuqingNum && obj.getYuqingNum()
                window.clearInterval(timer);
                plans.judgment = true;
                for(let i =0; i<plansList.length;i++){
                 plansList[i].publishTime = formatDate(plansList[i].publishTime);
                 if(plansList[i].source == 0){
                  source = '腾讯新闻';
                }
                if(plansList[i].source == 2){
                  source = '知乎';
                }
                if(plansList[i].source == 3){
                  source = '网易新闻';
                }
                plansList[i].source = source;
                if(plansList[i].cn>=200){
                  plansList[i].cn = '200以上'
                }
              }
              commit(types.GET_PLANS,{plans});
            }
          })
          },5000);
        }
  }
  
  commit(types.GET_PLANS,{plans});
  function formatDate(now) { 
    var newDate = new Date(now)
          var year=newDate.getFullYear(); //年
          var month=newDate.getMonth()+1; //月
          var date=newDate.getDate(); //日
          var hour=newDate.getHours(); //时
          var minute=newDate.getMinutes(); //分
          var second=newDate.getSeconds(); //秒
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (date >= 0 && date <= 9) {
            date = "0" + date;
          }
          if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
          }
          if (minute >= 0 && minute <= 9) {
            minute = "0" + minute;
          }
          if (second >= 0 && second <= 9) {
            second = "0" + second;
          }
          return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
        } 
      },
      async getYuqingNum({ commit },obj){ 
        if(sessionStorage.yuqingId == undefined){
         return false;
        }
        let time =Date.parse(new Date())/1000;
        let md5 = hex_md5('yiban'+time);
        let response = await axios.get(api.menu.getYuqing,{
          params:{
            page:0,
            sid:sessionStorage.yuqingId,
            sort:'desc',
            encrypt:md5,
            time:time
          }
        })
        let plansPage = parseInt(response.data.data);
            
        commit(types.GET_PAGE,{plansPage})
      }
      
    };

    export default actions;
