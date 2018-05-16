<template>
  <div class="page report" >
    <!-- <Plan-List></Plan-List> -->
    
    
    <div class="container">
      <ul class="clearfix sub-menu">
        <router-link to="/yq/home" tag="li">信息列表</router-link>
        <router-link to="/yq/report" tag="li">舆情报告</router-link>
        <router-link to="/yq/addAlert" tag="li">预警通知</router-link>
        <router-link to="/yq/showYuqing" tag="li">舆情方案</router-link>
      </ul>
      <div >
        <div class="filter"  id="content">
          <div class="row">
            <div class="form-group">
              <label>监测时间:</label>
              <Radio-group v-model="timeRange" type="button"  @on-change="yuqingReport(timeRange)">
              <Radio label="-1"> <span>1天</span></Radio>
              <Radio label="-2"> <span>2天</span></Radio>
              <Radio label="-3"> <span>3天</span></Radio>
              <Radio label="1"> <span @click="chooseTime = true">其他</span></Radio>
              
            </Radio-group>
            <Modal v-model="chooseTime" class="textc" :closable="false" title="自定义时间">
              <Date-picker type="datetimerange" :options="options" v-model ="datetimerange" placeholder="选择日期和时间" style="width: 400px"></Date-picker>
              <div slot="footer" class="textc">
                <Button size="large" @click="cancel()">取消</Button>
                <Button type="primary" id="okBtn" size="large" @click="yuqingReport">确定</Button>
              </div>
            </Modal>
          </div>
          <div class="form-group">
            <label>信息：</label>
            <span>{{topicCn}}条</span>
          </div>
          <div class="form-group">
            <label>评论：</label>
            <span>{{commentCn}}条</span>
          </div>
          <div class="form-group">
            <label>情感：</label>
            <span>{{degree}}正面</span>
          </div>
        </div>

      </div>
      <div class="s-title">信息走势</div>
      <div class="cont">
        <div id="line-chart"></div>
      </div>
      <div class="clearfix">
        <div class="half">
          <div class="s-title">词云</div>
          <div v-show = "!yunChart">
          <div id="yun-chart"></div></div>
          <div v-if="yunChart" class="yun-chart pa"><div class="title">监测时间内未发现相关联词</div><img :src="noData"></div>
        </div>
        <div class="half">
          <div class="s-title">情感度</div>
          <div id="pie-chart"></div>
        </div>
      </div>
      <div class="s-title">热门观点</div>
      <div class="comment" >
        <div v-if="whether">
         <template v-for="(item,index) in comments" >
          <div class="comment-item clearfix">
            <div class="cont">
              <img :src="item.avatar" />
              <div class="detail">
                <div class="name">昵称：{{item.nickname}}</div>
                <div class="content">{{item.content | filterSplit}}</div>
              </div>
            </div>
            <div class="zan">点赞数:<em>( {{ item.zan }} )</em></div>
          </div>
        </template>
      </div>
      <div v-else class="no-content"><div>{{comments}}</div><img :src="noData"></div>
      <ul class="right-fixed">
        <li class="top" @click="renderPDF">下载报告</li>
        <li>
         <Back-top :height="100" :bottom="200" style="position:static">
         <div class="top">返回顶端</div>
       </Back-top>
     </li>
   </ul>
 </div>
</div>
</div>
</div>
</template>
<style type="text/css" scoped>
  .right-fixed{
    position: fixed;
    bottom: 256px;
    left: 1400px;
    cursor: pointer;
  }
  .top{
    width: 50px;
    padding: 10px;
    background: rgba(0, 153, 229, .7);
    color: #fff;
    text-align: center;
  }
  .top:hover{
   background: rgba(0, 153, 229, 0.86);
 }
 .textc{
   text-align: center; 
 }
</style>
<script>
  //只打包需要的echarts模块
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/line'
  import 'echarts/theme/macarons'
  import 'echarts-wordcloud'
  //import PlanList from './layouts/menu.vue'
  import {hex_md5} from '../lib/md5'
  import noData from '../../images/nodata.png'
  import axios from 'axios'
  export default {
    components:{
        //  PlanList
      },
      data(){
        return{ 
            noData,
            yunChart:false,
            trendOption:'',//信息走势
            cloudOption:'',//词云
            pieOption:'',//情感度
            cloudOptions:[],
            pieOptions:[],
            legendData:[],
            comments:[],
            xAxisData:[],
            qqData:[],
            zhihuData:[],
            wangyiData:[],
            seriesData:[],
            chooseTime:false,
            topicCn:0,
            commentCn:0,
            degree:'',
            whether:true,
            datetimerange:'',
            options: {
              disabledDate (date) {
                return  date && date.valueOf() < Date.now() - 86400000*30 || Date.now() < date && date.valueOf();
              }
            },
            comment:[
            {
              avatar:require('../../images/niko.jpeg'),
              zan:999,
              nickname:'巴啦啦',
              content:'哈哈哈哈带我去不带我去的期望带我去记得你我去你家动hah啊哈哈哈哈哈哈脑筋我请你2321321321321321321321321321321点进去我'
            },{
              avatar:require('../../images/niko.jpeg'),
              zan:991,
              nickname:'巴kdk啦啦',
              content:'哈哈哈哈带我去不带我去的期望带我去记得你我去你家动脑筋我请你点进去我'
            }
            ],
            yuqingPlan:['易班舆情','高校思政','大学生在校监控'],
            timeRange:-1,
            searchRange:'全文',
            mingan:'仅敏感',
            source:['微信公众号'],
            columns:[
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '标题',
              key: 'title',
              className:'w-title',
              render(row,column,index){
                return `<p class="title">${row.title}</p><p class="summary">${row.summary}</p>`
              }
            },
            {
              title: '信息源',
              key: 'source',
              className:'center'
            },
            {
              title: '评论数',
              key: 'remark',
              className:'center'

            },{
              title:'时间',
              key:'time',
              className:'center'

            },{
              title:'操作',
              key:'operation',
              className:'center',
              render(row,column,index){
                return `<i class="ivu-icon ivu-icon-link"></i><i class="ivu-icon ivu-icon-android-mail"></i>`
              }
            }
            ],
            searchResult:[
            {
              title: '西南石油大学依托“互联网+”拓展易班育人功能',
              summary:'自2016年4月全面启动建设以来，西南石油大学易班发展中心紧密围绕学校改革第45项网络思想政治改革的工作要求，以“互联网+学生成长”……',
              source:'微信',
              remark: 0,
              time:'2016-01-20'
            },
            {
              title: '西南石油大学依托“互联网+”拓展易班育人功能',
              summary:'自2016年4月全面启动建设以来，西南石油大学易班发展中心紧密围绕学校改革第45项网络思想政治改革的工作要求，以“互联网+学生成长”……',
              source:'微信',
              remark: 0,
              time:'2016-01-20'
            },
            {
              title: '西南石油大学依托“互联网+”拓展易班育人功能',
              summary:'自2016年4月全面启动建设以来，西南石油大学易班发展中心紧密围绕学校改革第45项网络思想政治改革的工作要求，以“互联网+学生成长”……',
              source:'微信',
              remark: 0,
              time:'2016-01-20'
            },
            {
              title: '西南石油大学依托“互联网+”拓展易班育人功能',
              summary:'自2016年4月全面启动建设以来，西南石油大学易班发展中心紧密围绕学校改革第45项网络思想政治改革的工作要求，以“互联网+学生成长”……',
              source:'微信',
              remark: 0,
              time:'2016-01-20'
            }
            ],
            selectNum:0,
            isfix:false
          }
        },
        filters:{
          filterSplit(value){
           // console.log(value,11)
           return value
         }
       },

       mounted(){
        this.yuqingReport(-1);
      },
      methods:{
        renderChart(chartOption,elId){
          let Chart = echarts.init(document.getElementById(elId),'macarons');
          Chart.setOption(chartOption);
        },
        cancel(){
          this.chooseTime = false;

          let rememberData = this.rememberData;
          if(rememberData == '-1'||rememberData == '-3'||rememberData == '-2'){
            this.timeRange = rememberData;
          }
        },
        yuqingReport(oldDate){
          if(oldDate == '1'){
            return false;
          }
          let yuqingId = sessionStorage.yuqingId;
          let time =Date.parse(new Date())/1000;
          let md5 = hex_md5('yiban'+time);

          
          if(this.timeRange == '-1'||this.timeRange == '-3'||this.timeRange == '-2'){
            this.rememberData = this.timeRange;
            this.datetimerange = '';
          }
          if(this.datetimerange[0] && this.datetimerange[1]){
           var times = {
            startTime:this.getDates(this.datetimerange[0]),
            endTime:this.getDates(this.datetimerange[1])
          }
          this.rememberData = times;
          this.chooseTime = false;
        }else if(this.timeRange == '1'){
          this.$Message.warning('请选择日期');
          return false;
        }else{
          var times = this.getTime(oldDate);
        }
              //信息走势
              axios.get('/yibanSA/commentCtrl/queryTrendBySchemaId.do',{
                params:{
                  sid:yuqingId,
                  start:times.startTime,
                  end:times.endTime,
                  encrypt:md5,
                  time:time
                }
              })
              .then((resp) => {
               let dataArr = resp.data.data;
               let xAxisData = [];
               let qqData = [];
               let zhihuData = [];
               let wangyiData = [];
               //h获取开始时间和结束时间
               let startTime = new Date(times.startTime).getTime();
               let endtTime = new Date(times.endTime).getTime();

                //获取时间
                function formatDate(now) { 
                  var newDate = new Date(now)
                  var year=newDate.getFullYear(); //年
                  var month=newDate.getMonth()+1; //月
                  var date=newDate.getDate(); //日
                  var hour=newDate.getHours(); //时
                  if (month >= 1 && month <= 9) {
                    month = "0" + month;
                  }
                  if (date >= 0 && date <= 9) {
                    date = "0" + date;
                  }
                  if (hour >= 0 && hour <= 9) {
                    hour = "0" + hour;
                  }
                  return year+"-"+month+"-"+date+" "+hour; 
                } 
                if(endtTime - startTime < 259200000){
                  //以小时为单位
                  for(let i =startTime;i<=endtTime;i=i+3600000){
                    xAxisData.push(formatDate(i))
                  }
                }else{
                  //以天为单位
                  for(let i =startTime;i<=endtTime;i=i+86400000){
                    xAxisData.push(formatDate(i).substring(0,10))
                  }
                }
              //腾讯、知乎、网易时间初始化
              for(let i=0;i<xAxisData.length;i++){ 
               qqData.push(0) 
               zhihuData.push(0) 
               wangyiData.push(0) 
             }
             if(dataArr.constructor == Array){ 
               for(let i =0;i<xAxisData.length;i++){
                 for(let j =0;j<dataArr.length;j++){
                    //腾讯
                     if(xAxisData[i] == dataArr[j].date &&  dataArr[j].source == 0){
                      qqData[i] = dataArr[j].cn
                    }
                    //知乎
                    if(xAxisData[i] == dataArr[j].date &&  dataArr[j].source == 2){
                      zhihuData[i] = dataArr[j].cn
                    }
                     //网易
                     if(xAxisData[i] == dataArr[j].date &&  dataArr[j].source == 3){
                      wangyiData[i] = dataArr[j].cn
                    }
                  }
                }  
              }
              let trendOption = {
                tooltip : {
                  trigger: 'axis'
                },
                legend: {
                  data:['腾讯新闻','知乎','网易新闻']
                },
                toolbox: {
                  show : true,
                  feature : {
                  }
                },
                calculable : true,
                xAxis : [
                {
                  type : 'category',
                  boundaryGap : false,
                  data : xAxisData
                }
                ],
                yAxis : [
                {
                  type : 'value'
                }
                ],
                series : [
                {
                  name:'腾讯新闻',
                  type:'line',
                  smooth:true,
                  itemStyle: {normal: {areaStyle: {type: 'default'}}},
                  data:qqData
                },
                {
                  name:'知乎',
                  type:'line',
                  smooth:true,
                  itemStyle: {normal: {areaStyle: {type: 'default'}}},
                  data:zhihuData
                },
                {
                  name:'网易新闻',
                  type:'line',
                  smooth:true,
                  itemStyle: {normal: {areaStyle: {type: 'default'}}},
                  data:wangyiData
                }
                ]
              };


              this.renderChart(trendOption,'line-chart');
            })

               //词云
               axios.get('/yibanSA/commentCtrl/queryWordCloudBySchemaId.do',{
                params:{
                  sid:yuqingId,
                  start:times.startTime,
                  end:times.endTime,
                  encrypt:md5,
                  time:time
                }

              })
               .then((resp) => {
                var dataArr = resp.data.data;
                this.cloudOptions = [];
                if(dataArr.constructor == Array){
                  this.yunChart = false;  
                  for(var index in dataArr){
                   this.cloudOptions.push({
                    name: dataArr[index].word,
                    value: dataArr[index].cn
                  })        
                 }  
               }else{
                this.yunChart = true;
               }
               let  cloudOption = {
                tooltip: {},
                series: [ {
                  type: 'wordCloud',
                  gridSize: 2,
                  sizeRange: [12, 50],
                  rotationRange: [-90, 90],
                  shape: 'pentagon',
                  width: 600,
                  height: 400,
                  textStyle: {
                    normal: {
                      color: function () {
                        return 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                        ].join(',') + ')';
                      }
                    },
                    emphasis: {
                      shadowBlur: 10,
                      shadowColor: '#333'
                    }
                  },
                  data:this.cloudOptions,
                } ]
              };
              this.renderChart(cloudOption,'yun-chart');
              
            })
                  //情感度
                  axios.get('/yibanSA/commentCtrl/querySentimentDegreeBySchemaId.do',{
                    params:{
                      sid:yuqingId,
                      start:times.startTime,
                      end:times.endTime,
                      encrypt:md5,
                      time:time
                    }

                  })
                  .then((resp) => {
                    this.topicCn = resp.data.data.topicCn;
                    this.commentCn = resp.data.data.commentCn;
                    var dataArr = resp.data.data['3'];
                    this.pieOptions = [];
                    for(var index in dataArr){
                      if(dataArr[index].degree == 'pos') var  degree = '正面'
                        if(dataArr[index].degree == 'middle') var  degree = '中'
                          if(dataArr[index].degree == 'neg') var  degree = '负面'
                           this.pieOptions.push({
                            value: dataArr[index].cn,
                            name: degree+","+dataArr[index].percent
                          })                
                       }   
                       this.degree = (parseFloat(dataArr[0].percent) + parseFloat(dataArr[1].percent)).toFixed(2) +'%'
                       let pieOption ={
                        tooltip : {
                          trigger: 'item',
                          formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                          orient: 'vertical',
                          left: 'left',
                          data: ["正面","中","负面"]
                        },
                        series : [
                        {
                          name: '访问来源',
                          type: 'pie',
                          radius :['50%', '70%'],
                          center: ['50%', '60%'],
                          data:this.pieOptions,
                          datas:[
                          {value:335, name:'正面'},
                          {value:310, name:'中'},
                          {value:234, name:'负面'},
                          ],
                          itemStyle: {
                            emphasis: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                          }
                        }
                        ]
                      };
                      this.renderChart(pieOption,'pie-chart');
                    })

                   //热门观点
                   axios.get('/yibanSA/commentCtrl/queryPageHotCommentBySchemaId.do',{
                    params:{
                      sid:yuqingId,
                      start:times.startTime,
                      end:times.endTime,
                      encrypt:md5,
                      time:time
                    }

                  })
                   .then((resp) => {
                    let arrData = resp.data.data;
                    let srcHttp = "http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=";
                    this.comments = [];
                    if(arrData.constructor == Array){
                      this.whether = true;
                      for(var index in arrData){
                        if(this.comments.length<8){
                          if(arrData[index].source == 2){
                            arrData[index]['avatar'] = srcHttp + arrData[index]['avatar'];
                          }
                          this.comments.push({
                            avatar:arrData[index]['avatar'],
                            nickname:arrData[index]['nickName'],
                            content:arrData[index]['content'],
                            zan:arrData[index]['praiseCount'],
                          })
                        }
                      }
                    }else{
                     this.whether = false;
                     this.comments = arrData;
                   }
                   
                 })
                 },
                 getDates(date){
                  var newDate = new Date(date)
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
          },
          //获取当前时间
          getTime(oldTime){
            let seperator1 = "-";
            let seperator2 = ":";
            let dataZero = "00";

            let date = new Date();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            let strHours = date.getHours();
            if (month >= 1 && month <= 9) {
              month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
            }
            if (strHours >= 0 && strHours <= 9) {
              strHours = "0" + strHours;
            }
            let oldDate =new Date( date.setDate(date.getDate() + parseInt(oldTime)));
            let oldmonth = oldDate.getMonth() + 1;
            let oldstrDate = oldDate.getDate();
            let oldstrHours = oldDate.getHours();
            if (oldmonth >= 1 && oldmonth <= 9) {
              oldmonth = "0" + oldmonth;
            }
            if (oldstrDate >= 0 && oldstrDate <= 9) {
              oldstrDate = "0" + oldstrDate;
            }
            if (oldstrHours >= 0 && oldstrHours <= 9) {
              oldstrHours = "0" + oldstrHours;
            }
            let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + strHours + seperator2 + dataZero+ seperator2 + dataZero;
            let oldCurrentdate = oldDate.getFullYear() + seperator1 + oldmonth + seperator1 + oldstrDate
            + " " + oldstrHours + seperator2 + dataZero+ seperator2 + dataZero;
            return  {
              startTime:oldCurrentdate,
              endTime:currentdate
            };
          },
          renderPDF(){  
            window.print(); 
            

          }
//end
}
}
</script>

