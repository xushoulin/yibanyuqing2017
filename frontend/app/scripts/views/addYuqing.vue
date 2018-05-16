<template>
  <section class="page addYuqing">
    <div class="container">
      <ul class="clearfix sub-menu">
        <router-link to="/yq/addYuqing" tag="li">新建舆情方案</router-link>
      </ul>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <div class="add-box">
          <div class="m-title">
            舆情监控方案
          </div>
          <div class="first-form">
            <Form-item label="方案名称" prop = "planName">
            <Input v-model="formValidate.planName"  placeholder="请输入舆情方案名称"></Input>
          </Form-item>
        </div>
        <Form-item label="监测内容" prop = "words">
        <p>监测内容中含有</p>
        <Input v-model="formValidate.words" placeholder="请输入舆情关键词，用空格分开，最多可输入5个关键字"></Input>
      </Form-item>
    </div>
    <div class="btn-group">
      <Form-item>
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
      <Button type="ghost" @click="handleReset('formValidate')">重置</Button>
    </Form-item>
  </div>
</Form>

</div>
</section>
</template>
<script>
  import axios from 'axios'
  import {mapGetters, mapActions} from 'vuex'
  import {hex_md5} from '../lib/md5'
  import qs from 'qs'

  export default{
    created(){
      let time =Date.parse(new Date())/1000
      let md5 = hex_md5('yiban'+time)
      sessionStorage.isAddyuqing = false;
    },
    data(){
      const validatePass = (rule, value, callback) => {
        let array = value.split(' ');
        for(var i = 0 ;i<array.length;i++){  
         if(array[i] == "" || typeof(array[i]) == "undefined"){  
          array.splice(i,1);  
          i= i-1;  
        }    
      } 
      
      if (array.length >5) {
        callback(new Error('最多支持5个关键字'));
      } else {
        let keyString = array.join(" ");
        this.formValidate.words = keyString;
        callback();
      }
    };
    return{
      formValidate:{
        planName:'',
        words:''
      },
      ruleValidate:{
        planName:[
        { required: true, message: '方案名称不能为空', trigger: 'blur' },
        { type: 'string', max: 50, message: '方案名称最多不能超过50个字符', trigger: 'blur' }
        ],
        words:[
        { required: true, message: '检测内容不能为空', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    ...mapActions([
      'getYuqingPlan'
      ]),
     ...mapActions([
      'getYuqing'
      ]),
    ...mapActions([
      'getYuqingNum'
      ]),
    ...mapActions([
      'getDimensions'
      ]),
    handleSubmit (name) {
      if(document.getElementById('menu').children.length > 9){
       this.$Message.warning('每个用户最多添加 10个 舆情方案，您可以将不再需要的删除后添加。');
       return false;
     }
     let that = this;
     let time =Date.parse(new Date())/1000
     let md5 = hex_md5('yiban'+time)
     this.$refs[name].validate((valid) => {
      if (valid) {
        axios.post('/yibanSA/schemeCtrl/addSchema.do',qs.stringify({
          uid:sessionStorage.yuqingUid,
          sn:this.formValidate.planName,
          kw:this.formValidate.words,
          encrypt:md5,
          time:time
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then(function(res){
          sessionStorage.isAddyuqing = true;
          that.getYuqingPlan(that);
          that.$refs[name].resetFields();
          that.$router.push('/yq/home');
          sessionStorage.removeItem('yuqingId');
          sessionStorage.isWarn = 'true';
          that.$Message.success('提交成功!');

        })
        
        
      } else {
       // this.$Message.error('方案名称和监测内容不能为空!');
      }
    })
   },
   handleReset (name) {
    this.$refs[name].resetFields();
  },
}
}
</script>
