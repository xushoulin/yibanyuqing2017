<template>
  <section class="page addAlert">
    <div class="container">
      <ul class="clearfix sub-menu">
        <router-link to="/yq/home" tag="li">信息列表</router-link>
        <router-link to="/yq/report" tag="li">舆情报告</router-link>
        <router-link to="/yq/addAlert" tag="li">预警通知</router-link>
        <router-link to="/yq/showYuqing" tag="li">舆情方案</router-link>
      </ul>
      <div class="clearfix">
        <div class="s-title fl">易班舆情-预警方案（设置预警条件和预警接收邮箱，每天早上9:00将收到舆情预警邮件。）</div>
        <div class="s-switch fr">
         <i-switch v-model="formValidate.switchInfo" @on-change="change">
         <span slot="open">开</span>
         <span slot="close">关</span>
       </i-switch>
     </div>
   </div>
   <Form v-if="formValidate.switchInfo">
    <Form-item label="">
    <label class="form-title"><span class="red">*</span>媒体类型:</label>
    <Checkbox-group v-model="formValidate.interest" @on-change="onChange">
    <Checkbox label="0"><span>腾讯新闻</span></Checkbox>
    <Checkbox label="2"><span>知乎</span></Checkbox>
    <Checkbox label="3"><span>网易新闻</span></Checkbox>
  </Checkbox-group>
</Form-item>
<Form-item label="">
<label class="form-title"><span class="red">*</span>是否敏感:</label>
<Radio-group v-model="formValidate.gender" @on-change="onChange">
<Radio label="0">全部</Radio>
<Radio label="1">仅敏感</Radio>
</Radio-group>
</Form-item>
<Form-item label="">
<div><span class="red">*</span>预警接收人</div>
<div class="receive-member">
  <Form-item label="" prop="name">
  <Button type="text" @click="add"><a href="javascript:void(0);">增加联系人</a></Button>
</Form-item>
<dir id="inputBox">
  <div class="pr" v-for="(site , index) in formValidate.inputSites">
    <i-input :value.sync="site" @on-change="onChange" @on-blur="onBlur($event)" @on-focus="
      formValidate.btnBox = true;" placeholder="请输入预警接收人邮箱..." style="width: 400px;margin: 10px 0;"></i-input>
    <Button-group  class="pa addicon">
    <i-button  @click="deleteInput(index)"> <Icon type="close-circled"></Icon></i-button>
  </Button-group>
</div>
</dir>

</div>
</Form-item>
<div class="btnBox" v-if="formValidate.btnBox">
 <i-button type="primary" @click="save">保存</i-button>
 <i-button  @click="getAlert">取消</i-button>
</div>
</Form>
</div>

</section>
</template>
<script>
 import {hex_md5} from '../lib/md5'
 import axios from 'axios'
 import {mapGetters, mapActions} from 'vuex';
 export default{
  created(){
    this.getAlert()
    
  },
  data(){
    return{
      formValidate: {
        name: '',
        mail: '',
        city: '',
        gender: '0',
        interest: ['0','2','3'],
        date: '',
        time: '',
        desc: '',
        inputSites:[''],
        switchInfo:false,
        btnBox:false
      }
      
    }  
  },
  methods:{
     ...mapActions([
      'getYuqingPlan'
      ]),
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
    add(){
      let inputList = document.getElementById('inputBox').getElementsByTagName("input");
      if(inputList.length >=10){
       this.$Message.warning('最多只能添加十个');
     }else{
      this.formValidate.inputSites.push('');
      this.formValidate.btnBox = true;
    }
    
    
  },
  deleteInput(index){
    this.formValidate.inputSites.splice(index,1);
    this.formValidate.btnBox = true;
  },
  save(){
  if($('.ivu-input-wrapper').hasClass('ivu-form-item-error')) return false;
   let time =Date.parse(new Date())/1000
   let md5 = hex_md5('yiban'+time);
   let sid = sessionStorage.yuqingId;
   let inputArr = [];
   let inputList = document.getElementById('inputBox').getElementsByTagName("input");
   for(let i=0;i<inputList.length; i++){
    inputArr.push(inputList[i].value)
  }
  
  for(var i = 0;i<inputArr.length;i++){
    if(inputArr[i]==''||inputArr[i]==null||typeof(inputArr[i])==undefined){
      inputArr.splice(i,1);
      i=i-1;
    }
  }
  if(inputArr.length == 0){
   this.$Message.success('请添加预警接收人');
   return false;
 } 
 if(this.formValidate.interest.length == 0){
   this.$Message.success('请选择媒体类型');
   return false;
 } 
 this.formValidate.inputSites
 axios.get('/yibanSA/schemeCtrl/modWarnNoticeBySchemaId.do',{
  params:{
    sid:sid,
    source:this.formValidate.interest.join(','),
    isNeg:this.formValidate.gender,
    receiver:inputArr.join(','),
    encrypt:md5,
    time:time
  }

})
 .then((resp) => {
  this.$Message.success(resp.data.data);
                    //去掉没有收件人的空输入框
                    for(var i = 0;i<inputArr.length;i++){
                      if(inputArr[i]==''||inputArr[i]==null||typeof(inputArr[i])==undefined){
                        inputList[i].parentNode.parentNode.remove();
                        i=i-1;
                      }
                    }

                    axios.get('/yibanSA/schemeCtrl/modWarnNoticeByStatus.do',{
                      params:{
                        sid:sid,
                        isWarn:1,
                        encrypt:md5,
                        time:time
                      }

                    })
                    .then((resp) => {
                      if(resp.data.success){
                        this.getYuqingPlan()
                        localStorage.isWarn = 1
                      }
                      
                    })

                  })
},
change(status){
 if(status){
   let time =Date.parse(new Date())/1000
   let md5 = hex_md5('yiban'+time);
   let sid = sessionStorage.yuqingId;
   axios.get('/yibanSA/schemeCtrl/queryWarnNoticeBySchemaId.do',{
    params:{
      sid:sid,
      encrypt:md5,
      time:time
    }

  })
   .then((resp) => {
    let respData =  resp.data.data;
     if(respData.isNeg){
      this.formValidate.gender = '1'
    }else{
      this.formValidate.gender = '0'
    }
    //收件人
    this.formValidate.inputSites = respData.warnReceiver.split(',');
    //媒体类型
    if(respData.source == ''){
      this.formValidate.interest = ['0','2','3']
    }else{
      this.formValidate.interest = respData.source.split(',')
    }

  })
   return false
}else{
 var isWarn = 0;
}
let time =Date.parse(new Date())/1000
let md5 = hex_md5('yiban'+time);
let sid = sessionStorage.yuqingId;
axios.get('/yibanSA/schemeCtrl/modWarnNoticeByStatus.do',{
  params:{
    sid:sid,
    isWarn:isWarn,//0关闭，1开启
    encrypt:md5,
    time:time
  }

})
.then((resp) => {
  if(resp.data.success){
     this.getYuqingPlan()
     localStorage.isWarn = 0
    if(isWarn){
      this.$Message.info('预警开启');
    }else{
      this.$Message.info('预警关闭');
    }
  }else{
    this.$Message.info(resp.data.data);
      this.formValidate.switchInfo = true;
  }
  
})

},
onChange(){
  this.formValidate.btnBox = true;
},
getAlert(){
 let time =Date.parse(new Date())/1000
 let md5 = hex_md5('yiban'+time);
 let sid = sessionStorage.yuqingId;
 axios.get('/yibanSA/schemeCtrl/queryWarnNoticeBySchemaId.do',{
  params:{
    sid:sid,
    encrypt:md5,
    time:time
  }

})
 .then((resp) => {
  let respData =  resp.data.data;
  if(respData.isWarn == false){
    this.formValidate.switchInfo = false;
  }else{
   this.formValidate.switchInfo = true;
   //是否敏感
   if(respData.isNeg){
    this.formValidate.gender = '1'
  }else{
    this.formValidate.gender = '0'
  }
  //媒体类型
  if(respData.source == ''){
    this.formValidate.interest = ['0','2','3']
  }else{
    this.formValidate.interest = respData.source.split(',')
  }
  //收件人列表
  this.formValidate.inputSites = respData.warnReceiver.split(',');
}

})
}

      //end
    }
  }
</script>
