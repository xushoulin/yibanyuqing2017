<template>
  <section class="page remark">
    <div class="container">
      <div class="main-title">
        <span>{{ mainTitle }}</span>评论数据 <span v-if="pageNum>=200">(只显示200数据)</span>
        <div class="go-back" @click="goBack()">
          <Button-group shape="circle">
          <Button type="primary"><Icon type="chevron-left"></Icon>返回</Button>
        </Button-group>
      </div>
    </div>
    <div class="filter">
      <div class="row">
        <div class="form-group">
          <label class="label">敏感度</label>
          <Radio-group v-model="filter.sensitive" @on-change="onChange">
          <Radio label="neg"><span>仅敏感</span></Radio>
          <Radio label="">全部</Radio>
        </Radio-group>
      </div>
      <div class="form-group">
        <label class="label">排序</label>
        <Radio-group v-model="sort" type="button"  @on-change="onChange">
        <Radio label="timeSort"><span>时间排序<Icon class="arr" type="ios-arrow-thin-down" /></span></Radio>
        <Radio label="heatSort"><span>热度排序<Icon class="arr" type="ios-arrow-thin-down" /></span></Radio>
      </Radio-group>
    </div>
    <div class="txt">
      共<em>{{pageNum}}</em>条记录，当前第<em>{{page}}</em>页
    </div>
    <div class="tabs" :class="">
      <div class="fl" style="margin-left: 20px;">
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
  <table class="remark-table" align="center" v-for="site in searchResult.data">
    <tr class="thead">
      <th width="50px">
       <Checkbox-group v-model="checkAllGroup" @on-change="checkAllGroupChange">
       <Checkbox :label="site.id"><span></span></Checkbox>
     </Checkbox-group>
   </th>
   <th class="textl">发布时间:  {{ site.publishTime }}</th>
   <th class="textr">点赞数( {{site.praiseCount}} )</th>
 </tr>
 <tr class="tbody">
  <td colspan="3" class="textl"><img :src="site.avatar" />
    <div class="detail">
      <div class="name">昵称：{{site.nickName}}</div>
      <div class="content">{{site.content}}</div>
    </div>
  </td>
</tr>
</table>
<div class="page">
  <Page ref="pages" :total="pageNum" show-total show-elevator @on-change="pageChange"></Page>
</div>
</div>
<div v-else>
  <div class="no-data">{{searchResult.data}}</div>
</div>
</div>
</div>
</div>
</section>
</template>
<style type="text/css" scoped>
  .pa.icon{
    top: 0;
    left: -46px;
  }
</style>
<script>
  import {hex_md5} from '../lib/md5'
  import axios from 'axios'
  import jquery from '../tableExport/jquery.min'
  import tableExport from '../tableExport/tableExport'
  import base64 from '../tableExport/jquery.base64'
  export default{
    created(){
      this.pageChange();    
      this.getPageNum();    
    },
    data(){
      return{
        filter:{
          sensitive:'',
        },
        searchResult:{},
        mainTitle:localStorage.siteTitle,
        pageNum:0,
        page:1,
        srcHttp:"http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=",
        sort:'timeSort', 
        checkAll: false,
        selectNum:0,
        checkAllGroup: [],
        checkAllGroups: [],
        isfix:false,
        sendEmail: false,
        inputSites:[''],
        emaliValue:'',
      }
    },
    computed:{
      classObject(){
        return {
          fix: this.isfix
        }
      }
    },
    mounted(){
      window.addEventListener('scroll',this.handleScroll,false);
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
      goBack(){
        this.$router.go(-1)
      // history.go(-1)
     },
     handleScroll(){
      var tabs = document.querySelector('.tabs');
      this.isfix = window.pageYOffset >= tabs.offsetTop;
      if(window.pageYOffset < 240){
        this.isfix = false
      }
    },
    onChange(){
      this.getPageNum();
      this.pageChange(1);
      if(this.searchResult.judgment){
        this.$nextTick(function(){
          this.$refs['pages'].currentPage = 1;
      })
      }
      
    },
    getPageNum(page){
      let time =Date.parse(new Date())/1000
      let md5 = hex_md5('yiban'+time);
      let tid = localStorage.tid;
      let sort = {};
      if(this.sort == 'timeSort'){
        sort={
          date:1,
          hot:''
        }
      }else{
        sort={
          date:'',
          hot:1
        }
      }
      axios.get('/yibanSA/commentCtrl/queryPageCommentByTopicId.do',{
        params:{
          tid:tid,
          page:0,
          neg:this.filter.sensitive,
          date:sort.date,
          hot:sort.hot,
          encrypt:md5,
          time:time
        }

      })
      .then((resp) => {
        this.pageNum = parseInt(resp.data.data);
        this.page = page || 1;
      })
    },
    pageChange(page){
      var that = this;
      let time =Date.parse(new Date())/1000
      let md5 = hex_md5('yiban'+time);
      let tid = localStorage.tid;
      let sort = {};
      if(that.sort == 'timeSort'){
        sort={
          date:1,
          hot:''
        }
      }else{
        sort={
          date:'',
          hot:1
        }
      }
      axios.get('/yibanSA/commentCtrl/queryPageCommentByTopicId.do',{
        params:{
          tid:tid,
          page:page || 1,
          neg:this.filter.sensitive,
          date:sort.date,
          hot:sort.hot,
          encrypt:md5,
          time:time
        }

      })
      .then((resp) => {
        let plans = resp.data;
        let plansList = plans.data;
        let srcHttp = "http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=";
        this.checkAllGroups = [];
        this.checkAllGroup = [];
        this.selectNum = 0;
        this.checkAll = false;
        if(plansList instanceof Array){
         plans.judgment = true;
         for(let i =0; i<plansList.length;i++){
           plansList[i].publishTime = formatDate(plansList[i].publishTime)
           this.checkAllGroups.push(plansList[i].id) 
          if(plansList[i].source == 2){
            plansList[i].avatar = srcHttp + plansList[i].avatar
          }
         }
         
         
         function compare(property){
          return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return  value2 - value1;
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
           }
           this.page = page || 1;
           this.searchResult = plans;
         })
    },
    handleCheckAll () {
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
      if (data.length === this.checkAllGroups.length) {
        this.checkAll = true;
      } else if (data.length > 0) {
        this.checkAll = false;
      } else {
        this.checkAll = false;
      }
      this.selectNum = data.length;
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
             // this.$Message.success(resp.data.data);
             this.sendEmail = false;
           })
            //按照用户选定的评论发送邮件
            axios.get('/yibanSA/commentCtrl/sendMailByCommentIds.do',{
              params:{
                cids:this.checkAllGroup.join(','),
                uid:sessionStorage.yuqingUid,
                receivers:receiver.join(','),
                jobName:yuqingName, 
                title:localStorage.siteTitle,
                mailTitle:this.emaliValue,
                encrypt:md5,
                time:time
              }
            })
            .then((resp) => {
              this.$Message.success(resp.data.data);
              this.sendEmail = false;
            })
          }
          

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
            tbodyHtml +=`<tr><td>${dataArr[i].nickName}</td>
            <td>${dataArr[i].content}</td>
            <td>${dataArr[i].praiseCount}</td>
            <td>${dataArr[i].publishTime}</td></tr>`
          }
        
          let tableHtml =  $(`<table id="out-table"> 
            <thead>
              <tr>
                <th>昵称</th>
                <th>评论内容</th>
                <th>点赞数</th>
                <th>发布时间</th>
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
     //end   
   }
 }
</script>
