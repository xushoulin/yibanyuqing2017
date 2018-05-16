<template>
  <section class="page">
    <div class="container">
      <div class="main-title">
        <div class="go-back" @click="goBack()">
          <Button-group shape="circle">
          <Button type="primary"><Icon type="chevron-left"></Icon>返回</Button>
        </Button-group>
      </div>
    </div>
    <div class="filter">
      <div class="clearfix title">
        <div class="fl">信息详情</div>
        <div class="fr">
          <a href="javascript:void(0)" @click="copyLink(searchResults.originUrl)">
            <i class="ivu-icon ivu-icon-link"></i>复制原文链接</a> 
          </div>
        </div>
        <div class="center">{{searchResults.title}}</div>
        <table class="datail-table">
          <tr>
            <td>发布网站</td>
            <td>{{searchResults.source}}</td>
            <td>发布时间</td>
            <td>{{searchResults.publishTime}}</td>
          </tr>
          <tr>
            <td>原文链接</td>
            <td colspan="3"><a :href="searchResults.originUrl" target="_blank">{{searchResults.originUrl}}</a></td>
          </tr>
        </table>
        <div class="center">正文</div>
        <div class="detail-content">{{searchResults.content}}</div>
      </div>
      <Alert show-icon>  页面内容来源于网络，请以原网站为准。对传播此页面内容导致的后果，易班舆情概不承担责任。
      </Alert>
    </div>
  </section>
</template>
<script>
 import {mapGetters, mapActions} from 'vuex';
 export default{
  created(){
    this.searchResults = JSON.parse(localStorage.detail);
  //  let searchResult = this.searchResult.data;
  //  let index = localStorage.index;
  //  this.searchResults = searchResult[index];
  //  this.searchResults.publishTime = formatDate(this.searchResults.publishTime);
  //  if(this.searchResults.source = 0){
  //   this.searchResults.source = '腾讯新闻';
  // }
  // if(this.searchResults.source = 2){
  //   this.searchResults.source = '知乎';
  // }
  // if(this.searchResults.source = 3){
  //   this.searchResults.source = '网易新闻';
  // }
  
  
  function formatDate(now) { 
    var newDate = new Date(now)
          var year=newDate.getFullYear(); //年
          var month=newDate.getMonth()+1; //月
          var date=newDate.getDate(); //日
          var hour=newDate.getHours(); 
          var minute=newDate.getMinutes(); 
          var second=newDate.getSeconds(); 
          return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
        }  
      },
      data(){
        return{
          searchResults:''
        }
      },
      computed:{
        ...mapGetters({
          searchResult: 'getYuqing'
        })
      },
      
      methods:{
        goBack(){
         history.go(-1)
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
        }
      }
    }
  </script>
