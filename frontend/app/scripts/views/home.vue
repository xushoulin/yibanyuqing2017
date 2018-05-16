<template>
  <div class="page home">
    <div class="container">
      <ul class="clearfix sub-menu">
        <router-link to="/yq/home" tag="li" class="router-link-exact-active router-link-active">信息列表</router-link>
        <router-link to="/yq/report" tag="li">舆情报告</router-link>
        <router-link to="/yq/addAlert" tag="li">预警通知</router-link>
        <router-link to="/yq/showYuqing" tag="li">舆情方案</router-link>
      </ul>
      <div class="filter">
        <div class="row">
          <div class="form-group">
            <label>监测时间:</label>
            <Radio-group v-model="timeRange" type="button" @on-change="onChange(timeRange)">
            <Radio label="-1"> <span>1天</span></Radio>
            <Radio label="-2"> <span>2天</span></Radio>
            <Radio label="-3"> <span>3天</span></Radio>
            <Radio label="1111"><span @click="chooseTime = true">其他</span></Radio>
          </Radio-group>

          <Modal v-model="chooseTime" class="textc" :closable="false" title="自定义时间"> 
            <Date-picker type="datetimerange" :options="options" v-model ="datetimerange" placeholder="选择日期和时间" style="width: 400px"></Date-picker>
            <div slot="footer" class="textc">
              <Button size="large" @click="cancel()">取消</Button>
              <Button type="primary" id="okBtn" size="large" @click="onChange()">确定</Button>
            </div>
          </Modal>
        </div>
        <div class="form-group">
          <label class="label">敏感度:</label>
          <Radio-group v-model="mingan"  @on-change="onChange(mingan)">
          <Radio label="neg"><span>仅敏感</span></Radio>
          <Radio label=""><span>全部</span></Radio>
        </Radio-group>
      </div>
      <div class="form-group">
       <label class="label">排序:</label>
       <Radio-group v-model="timeSort" type="button"  @on-change="onChange(timeSort)">
       <Radio label="desc"><span>时间降序<Icon class="arr" type="ios-arrow-thin-down" /></span></Radio>
       <Radio label="asc"><span>时间升序<Icon class="arr" type="ios-arrow-thin-up" /></span></Radio>
     </Radio-group>
   </div>
 </div>
 <div class="row">
  <div class="form-group">
    <label>监测范围:</label>
    <Checkbox-group v-model="source"  @on-change="onChange(source)">
    <Checkbox label="0"> <span>腾讯新闻</span></Checkbox>
    <Checkbox label="2"> <span>知乎</span></Checkbox>
    <Checkbox label="3"> <span>网易新闻</span></Checkbox>
  </Checkbox-group>
</div>
</div>
<div class="row center">
  <!-- <div class="btn-save-filter">保存筛选条件</div> -->
  <div class="input-box">
   <Select v-model="matchResult" placeholder="全选"  @on-change="onChangeSelect(matchResult)" style="width:100px">
    <Option  :value="0" :key="0">全选</Option>
    <Option  :value="1" :key="1">标题</Option>
    <Option  :value="2" :key="2">全文</Option>
  </Select>

  <input class="input-search" placeholder="在结果中搜索"  @keyup.13 ="onChange(inputdata)" v-model="inputdata">
  <Button type="primary" icon="ios-search"  @click="onChange(inputdata)">搜索</Button>
</div>
</div>
</div>
<div class="tabs" :class="">
  <div style="margin-left: 30px;float:left;">
    <Checkbox
    :indeterminate="false"
    :value="checkAll"
    @click.prevent.native="handleCheckAll">全选</Checkbox>
  </div>
  <span class="choose">已选信息<em>{{ selectNum }}</em>条</span>
  <div class="box">
    <div class="item" @click="dataOutput">
      <i class="iconfont icon-export"></i>
      <span>数据导出</span>
      <div class="line"></div>
    </div>
    <div class="line"></div>
    <div class="item" @click="displayModel">
      <Icon type="email" />
      <span>邮件发送</span>
      <Modal v-model="sendEmail" title="邮件发送舆情">
        <label>邮件标题:</label>
        <Input v-model="emaliValue" style="width: 300px;margin-bottom:10px;"></Input>
        <div class="clearfix">
          <span class="fl">邮箱列表</span>
          <Button class="fr" type="text" @click="add">增加</Button>
        </div>
        <div id="recipient">
          <div class="pr"  v-for="(site , index) in inputSites">
            <i-input :value.sync="site" @on-blur="onBlur($event)" placeholder="请输入..." style="width: 300px;margin: 10px 0;"></i-input>
            <Button-group  class="pa icon">
            <i-button  @click="deleteInput(index)"> <Icon type="close-circled"></Icon></i-button>
          </Button-group>
        </div>
      </div>

    </Form-item>
    <div slot="footer" class="textc">
      <Button type="primary" size="large" @click="sendOk">确定</Button>
    </div>
  </Modal>
</div>
</div>
</div>
<div v-if="searchResult.judgment">
  <table class="home-table" align="center">
    <thead>
      <tr class="thead">
        <th></th>
        <th>标题</th>
        <th>信息源</th>
        <th>评论数</th>
        <th>时间</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr class="tbody" v-for="(site ,index) in searchResult.data">
        <td> 
          <Checkbox-group v-model="checkAllGroup" @on-change="checkAllGroupChange">
          <Checkbox :label="site.id"><span></span></Checkbox>
        </Checkbox-group>
      </td>
      <td width="480px" class="textl pr">
        <div v-if="site.score < 0" class="pa sensitive">敏</div>
        <a class="home-title" href="javascript:void(0)" @click="toDetail(index,site)">{{site.title}}</a>
        <br>
        <div>{{site.content | filterSplit}}</div>
      </td>
      <td>{{site.source}}</td>
      <td><a @click="toRemark(site.id,site.title)">{{site.cn}}</a></td>
      <td>{{site.publishTime}}</td>
      <!-- {{site.originUrl}} -->
      <td>
       <a href="javascript:void(0)" @click="copyLink(site.originUrl,$event)"><i class="ivu-icon ivu-icon-link"></i>复制链接</a>  
     </td>
   </tr>
 </tbody>
</table>
<div class="page">
  <Page ref="pages" :total="getYuqingpage || getYuqingNum" show-total show-elevator @on-change="pageChange"></Page>
</div>
</div>

<div v-else-if="searchResult.noData">
  <div class="no-data">{{searchResult.data}}<br><img :src="noData"></div>
</div>

<div v-else-if="searchResult.isWarn">
  <div class="no-data">暂时未找到相关数据，若希望对该舆情方案进行持续监测，请开启 <router-link to="/yq/addAlert" tag="a">预警通知</router-link>。</div>
</div>
 
<div v-else>
 <div class="waite">
  <Row>
    <Col class="demo-spin-col">
      <Spin fix size="large"> 
        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
        <div>系统拼命加载中，<br>不要走开，马上呈现</div>
      </Spin>
    </Col>
  </Row> 
</div> 
</div>
</div>

</div>

</template>
<style scoped>
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .waite{
    width: 100%;
    font-size: 18px;
    margin-top: 150px;
  }

  .pa.icon{
    top: 0;
    left: -46px;
  }
</style>
<script>
  import {mapGetters, mapActions} from 'vuex';
  // import {timestampFormat} from '../lib/date';
  import jquery from '../tableExport/jquery.min'
  import tableExport from '../tableExport/tableExport'
  import base64 from '../tableExport/jquery.base64'
  import {hex_md5} from '../lib/md5'
  import noData from '../../images/nodata.png'
  import axios from 'axios'
  export default{
      watch:{
      //当舆情方案发生变化初始化页面
      dimensions(newVal){
        this.timeRange = '';
        this.mingan ='';
        this.timeSort ='desc';
        this.source = ['0','2','3'];
        this.rememberData = '';
        this.inputdata = '';
        this.getYuqingpage = '';
        this.checkAllGroup = [];
        this.selectNum = 0;
        this.checkAll = false;
        if(this.searchResult.judgment){
         this.$nextTick(function(){ 
          this.$refs['pages'].currentPage = 1;
        })
       }
     }
         // searchResult(newVal){
         //  console.log(newVal)
         // }
       },
       data(){
        return {
          noData,
          timeRange:'',
          searchRange:'全文',
          mingan:'',
          timeSort:'desc',
          source:['0','2','3'],
          checkAll: false,
          selectNum:0,
          checkAllGroup: [],
          checkAllGroups: [],
          inputdata:'',
          matchResult:'',
          sendEmail: false,
          chooseTime:false,
          rememberData:'',
          inputSites:[''],
          emaliValue:'',
          datetimerange:'',
          getYuqingpage:this.getYuqingNum,
          options: {
            disabledDate (date) {
              return  date && date.valueOf() < Date.now() - 86400000*30 || Date.now() < date && date.valueOf();
            }
          },
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
              return `<p class="title">${row.title}</p><p class="summary">${row.content}</p>`
            }
          },
          {
            title: '评论数',
            key: 'cn',
            className:'center',
            render(row,column,index){
             return `<p class="remark-txt" @click="toRemark()">${row.cn}</p>`
           }

         },{
          title:'时间',
          key:'publishTime',
          className:'center',
          render(row){
            // return timestampFormat(row.publishTime) // TODO timestampFormat has bug
            return row.publishTime;
          }
        },{
          title:'操作',
          key:'operation',
          className:'center',
          render(row,column,index){
            return `<i class="ivu-icon ivu-icon-link"></i><i class="ivu-icon ivu-icon-android-mail"></i>`
          }
        }
        ],
        searchResults:[
        {
          title: '西南石油大学依托“互联网+”拓展易班育人功能',
          summary:'自2016年4月全面启动建设以来，西南石油大学易班发展中心紧密围绕学校改革第45项网络思想政治改革的工作要求，以“互联网+学生成长”……',
          source:'微信',
          remark: 2,
          time:'2016-01-20'
        },
        {
          title: '西南石油大学依托“互联网+”拓展易班育人功能',
          summary:'自2016年4月全面启动建设以来，西南石油大学易班发展中心紧密围绕学校改革第45项网络思想政治改革的工作要求，以“互联网+学生成长”……',
          source:'微信',
          remark: 3,
          time:'2016-01-20'
        },
        {
          title: '西南石油大学依托“互联网+”拓展易班育人功能',
          summary:'自2016年4月全面启动建设以来，西南石油大学易班发展中心紧密围绕学校改革第45项网络思想政治改革的工作要求，以“互联网+学生成长”……',
          source:'微信',
          remark: 12,
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
        isfix:false

      }
    },
    filters:{
      filterSplit(value){
       return value.replace(/\s/g, "").substring(0,100)+'...';
     }
   },
   computed:{
    classObject(){
      return {
        fix: this.isfix
      }
    },
    ...mapGetters({
      searchResult: 'getYuqing'
    }),
    ...mapGetters({
      getYuqingNum: 'getYuqingNum'
    }),
    ...mapGetters(['dimensions'])
  },

  mounted(){
    window.addEventListener('scroll',this.handleScroll,false);
    sessionStorage.isAddyuqing = true;
    var yuqingId = sessionStorage.yuqingId;
    this.getYuqing({sid:yuqingId,getYuqingNum:this.getYuqingF});
    this.getYuqingF({sid:yuqingId});
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll, false);
  },
  methods:{
    onBlur(event){
      let value =event.target.value;
      var reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if(!!value){
        if(reg.test(value)){
          $(event.target.parentElement).removeClass('ivu-form-item-error');
          $(event.target.parentElement.nextElementSibling).removeClass('ivu-form-item-error');
          $('.ivu-form-item-error-tip').remove();
        }else{
          $(event.target.parentElement).addClass('ivu-form-item-error');
          $(event.target.parentElement.nextElementSibling).addClass('ivu-form-item-error');
          $(event.target.parentElement).append(`<div class="ivu-form-item-error-tip">邮箱格式不正确</div>`)
        }
      }else{
        $(event.target.parentElement).removeClass('ivu-form-item-error');
        $(event.target.parentElement.nextElementSibling).removeClass('ivu-form-item-error');
        $('.ivu-form-item-error-tip').remove();
      }
    },
    getId(){
      var listId = this.searchResult.data;
      this.checkAllGroups =[];
      if(listId instanceof Array){
        for(var i= 0;i<listId.length;i++){
          this.checkAllGroups.push(listId[i].id) 
        }
      }
      
    },
    handleCheckAll () {
      this.getId()
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;
      if (this.checkAll) {
        this.checkAllGroup = this.checkAllGroups;
        this.selectNum = this.checkAllGroups.length;
      } else {
        this.checkAllGroup = [];
        this.selectNum = 0;
      }
    },
    checkAllGroupChange (data) {
      this.getId()
      if (data.length == this.checkAllGroups.length) {
        this.checkAll = true;
      } else if (data.length > 0) {
        this.checkAll = false;
      } else {
        this.checkAll = false;
      }
      this.selectNum = data.length;
    },
    handleScroll(){
      var tabs = document.querySelector('.tabs');
      this.isfix = window.pageYOffset >= tabs.offsetTop;
      if(window.pageYOffset < 350){
        this.isfix = false
      }
    },
    ...mapActions([
      'getYuqing'
      ]),
    ...mapActions({
      getYuqingF:'getYuqingNum'
    }),
        // selectTableItem(selection,row){
        //     this.selectNum = selection.length;
        //   console.log(selection,row)
        // },
        toRemark(index,title){
         this.$router.push('/yq/remark');
         localStorage.tid = index;
         localStorage.siteTitle = title;
       },
       toDetail(index,site){
         this.$router.push('/yq/detail');
         localStorage.index = index;
         localStorage.detail = JSON.stringify(site);

       },
       pageChange(page){
        this.onChange('22222',page);
      },
      cancel(){

        this.chooseTime = false;

        let rememberData = this.rememberData;
        if(rememberData == '-1'||rememberData == '-3'||rememberData == '-2'){
          this.timeRange = rememberData;
        }
      },
      onChangeSelect(change,page){
        if(this.inputdata == ''){
          return false;
        }else{
          this.onChange(change,page)
        }
      },
      onChange(change,page){
        if(change == '1111'){
          return false;
        }
        if(this.source.length == 1){
         sessionStorage.rememberSource = this.source;
       }
       if(this.source.length == 0 || this.source === false){
        this.$Message.error('请至少选择一个监控范围');
        this.source.push(sessionStorage.rememberSource);
        return false;
      }
      let key;
      if(this.inputdata == ''){
        key = ''
      }else if(this.matchResult == ''){
        key = 0 +','+this.inputdata;
      }else{
       key = this.matchResult +','+this.inputdata;
     }
     let timeRange = this.timeRange;
     if(timeRange == '-1'||timeRange == '-3'||timeRange == '-2'){
      this.rememberData = this.timeRange;
      this.datetimerange = '';
    }
    if(this.datetimerange[0] && this.datetimerange[1]){
     var time = {
      startTime:this.getDates(this.datetimerange[0]),
      endTime:this.getDates(this.datetimerange[1])
    }
    this.rememberData = time;
    this.chooseTime = false;
  }else if(timeRange == '1111'){
   this.$Message.warning('请选择日期');
   return false;
 }else if(timeRange == ''){
   var time = {
    startTime:'',
    endTime:''
  }
}else{
  var time = this.getTime(timeRange);
}

let yuqingId = sessionStorage.yuqingId;
let parameter = {
  sid:yuqingId,
  start:time.startTime,
  end:time.endTime,
  sources:this.source.join(','),
  neg: this.mingan,
  key: key,
  sort:this.timeSort,
  page:page
};

this.getYuqingList(parameter);
},
getYuqingList(parameter){
  let time =Date.parse(new Date())/1000
  let md5 = hex_md5('yiban'+time);
  axios.get('/yibanSA/topicCtrl/queryPageTopicByCondition.do',{
    params:{
      sid:parameter.sid,
      page:"0",
      start:parameter.start,
      end:parameter.end,
      sources:parameter.sources,
      neg :parameter.neg,
      key :parameter.key,
      sort:parameter.sort,
      encrypt:md5,
      time:time
    }

  })
  .then((resp) => {
    if(resp.data.data.constructor == Number){
      this.getYuqingpage = this.getYuqingNum = resp.data.data;

    }
  })

  axios.get('/yibanSA/topicCtrl/queryPageTopicByCondition.do',{
    params:{
      sid:parameter.sid,
      page:parameter.page || "1",
      start:parameter.start,
      end:parameter.end,
      sources:parameter.sources,
      neg :parameter.neg,
      key :parameter.key,
      sort:parameter.sort,
      encrypt:md5,
      time:time
    }

  })
  .then((resp) => {
    let plans = resp.data;
    let plansList = plans.data;
    let source;
    if(plansList instanceof Array){
      this.checkAllGroup = [];
      this.selectNum = 0;
      this.checkAll = false;
      plans.judgment = true;
      plans.noData = false; 
      plans.isWarn = false;
      for(let i =0; i<plansList.length;i++){
        // plansList[i].content = plansList[i].content.substring(0,100)+'...';
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
      function formatDate(now) { 
        var newDate = new Date(now)
      var year=newDate.getFullYear(); //年
      var month=newDate.getMonth()+1; //月
      var date=newDate.getDate(); //日
      var hour=newDate.getHours(); 
      var minute=newDate.getMinutes(); 
      var second=newDate.getSeconds(); 
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
  }else{
   plans.judgment = false;
   plans.isWarn = false;
   plans.noData = true; 
      
 }
 this.searchResult.data = plans.data;
 this.searchResult.judgment = plans.judgment;
 this.searchResult.noData = plans.noData;
 if(this.searchResult.judgment && parameter.page == undefined){
   this.$nextTick(function(){ 
    this.$refs['pages'].currentPage = 1;
  })
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
        endTime:currentdate,
        startTime:oldCurrentdate
      };
    },
    displayModel(){
     if(this.selectNum <1){
       this.$Message.error('请选择需要发送的内容');
       return false;
     }
     this.emaliValue = "您有"+this.selectNum+"条来自"+localStorage.yuqingName+"的信息"
     let yuqingId = sessionStorage.yuqingId;
     let time =Date.parse(new Date())/1000
     let md5 = hex_md5('yiban'+time);
  //根据方案ID获取话题邮件接收人列表
  axios.get('/yibanSA/schemeCtrl/queryTopicMailReceiver.do',{
    params:{
      sid:yuqingId,
      encrypt:md5,
      time:time
    }
  })
  .then((resp) => {
    this.sendEmail = true;
    this.inputSites = resp.data.data.split(',');
  })
},
add(){
  if(this.inputSites.length >=10){
   this.$Message.warning('最多只能添加十个');
 }else{
  this.inputSites.push('');
}
},
deleteInput(index){
this.inputSites.splice(index,1);
},
sendOk(){
if(!$('.ivu-input-wrapper').hasClass('ivu-form-item-error')){
  let recipientId = document.getElementById('recipient');
  let inputs = recipientId.getElementsByTagName('input');
  let receiver = [];
  for(let i =0;i<inputs.length;i++){
    if(!inputs[i].value == ''){
      receiver.push(inputs[i].value)
    }

  }
  if(receiver.length == 0) {
   this.$Message.error('邮件接收人列表不能为空');
   return false;
 }
 let yuqingId = sessionStorage.yuqingId;
 let yuqingName = localStorage.yuqingName;
 let time =Date.parse(new Date())/1000
 let md5 = hex_md5('yiban'+time);
  //根据方案ID更新话题邮件接收人列表
  axios.get('/yibanSA/schemeCtrl/updateTopicMailReceiver.do',{
    params:{
      sid:yuqingId,
      receiver:receiver.join(','),
      encrypt:md5,
      time:time
    } 
  })
  .then((resp) => {
        //this.$Message.success(resp.data.data);
        //this.sendEmail = false;
         //按照用户选定的话题发送邮件
         axios.get('/yibanSA/topicCtrl/sendMailByTopicIds.do',{
          params:{
            tids:this.checkAllGroup.join(','),
            uid:sessionStorage.yuqingUid,
            receivers:receiver.join(','),
            jobName:yuqingName, 
            mailTitle:this.emaliValue,
            encrypt:md5,
            time:time
          }
        })
         .then((resp) => {
          this.$Message.success(resp.data.data);
          this.sendEmail = false;
        })
       })

      }
      

    },
    copyLink(url,event){
      var aux = document.createElement("input");
          // 设置元素内容
          aux.setAttribute("value", url);
          // 将元素插入页面进行调用
          document.body.appendChild(aux);    
          // 复制内容
          aux.select();
          // 将内容复制到剪贴板
          document.execCommand("copy");
          // 删除创建元素
          document.body.removeChild(aux);
          this.$Message.success('复制成功!');
        },
        dataOutput(){
         if(!this.searchResult.judgment || this.checkAllGroup.length == 0){
           this.$Message.error('没有数据可下载');
           return false;
         }
         let dataArr = [];
         for(let i=0;i<this.searchResult.data.length;i++){
          for(let j=0;j<this.checkAllGroup.length;j++){
            if(this.searchResult.data[i].id == this.checkAllGroup[j]){
              dataArr.push( this.searchResult.data[i]);
            }
          }
        }

        

        let tbodyHtml ='';
        function p(s) {
          return s < 10 ? '0' + s: s;
        }

        var myDate = new Date();
            //获取当前年
            var year=myDate.getFullYear();
            //获取当前月
            var month=myDate.getMonth()+1;
            //获取当前日
            var date=myDate.getDate(); 
            var h=myDate.getHours();       //获取当前小时数(0-23)
            var m=myDate.getMinutes();     //获取当前分钟数(0-59)
            var s=myDate.getSeconds();  

            var now=year+p(month)+p(date)+p(h)+p(m)+p(s);
            let fileName = localStorage.yuqingName +"_"+ now
            for(let i =0;i<dataArr.length;i++){
              if(dataArr[i].score < 0) dataArr[i].score = '负面'
                if(dataArr[i].score == 0) dataArr[i].score = '中性'
                  if(dataArr[i].score > 0) dataArr[i].score = '正面'
                    dataArr[i].content = dataArr[i].content.replace(/\s/g, "").substring(0,100)+'...';
                  tbodyHtml +=`<tr><td>${dataArr[i].title}</td>
                  <td>${dataArr[i].content}</td>
                  <td>${dataArr[i].source}</td>
                  <td>${dataArr[i].score}</td>
                  <td>${dataArr[i].cn}</td>
                  <td>${dataArr[i].publishTime}</td>
                  <td>${dataArr[i].originUrl}</td></tr>`
                }

                let tableHtml =  $(`<table id="out-table"> 
                  <thead>
                    <tr>
                      <th>标题</th>
                      <th>内容</th>
                      <th>信息源</th>
                      <th>情感属性</th>
                      <th>评论数</th>
                      <th>时间</th>
                      <th>原文链接</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${tbodyHtml}
                  </tbody>
                </table>`)
                $('body').append(tableHtml)
                $('#out-table').tableExport({
                  type: 'excel',
                  escape: 'false',
                  fileName:fileName
                });
                $('#out-table').remove();

              }
// end
}

}
</script>

