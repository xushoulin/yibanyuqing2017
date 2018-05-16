<template>
  <div>
    <nav>
      <!--<ul>-->
      <!--<li v-for="menu in menus">-->
      <!--<router-link :to="menu.url">{{ menu.name }}</router-link>-->
      <!--</li>-->
      <!--</ul>-->
      <div class="m-logo"><i class="logo"></i><em>舆情</em></div>
      <div class="top-menu">
        <a class="active">舆情监控</a>
        <!--<router-link :to="">舆情监控</router-link>-->
      </div>
      <div class="fr sign-out" v-if="sign"> 
        <a @click="signOut">退出登录</a>
      </div>
    </nav>
    <section v-if="whetherLand">
      <Plan-List></Plan-List>
      <router-view></router-view>
    </section>
    <section v-else>
      <div class="land">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
         <p class="title">登录</p>
         <Form-item label="登录名" prop="name">
         <Input type="text" v-model="formValidate.name" @on-enter ="handleSubmit('formValidate')" placeholder="请输入姓名"></Input>
       </Form-item>
       <Form-item label="密码" prop="password">
       <Input type="password" v-model="formValidate.password" @on-enter ="handleSubmit('formValidate')"  placeholder="请输入密码"></Input>
     </Form-item>
     <Button type="primary" long @click="handleSubmit('formValidate')">确认提交</Button>
   </Form>
 </div>
 
</section>
</div>
</template>
<style type="text/css">
  .ivu-message-notice-content {
  padding: 16px 32px;
  border-radius: 5px;
  color: #fff;
  box-shadow: 0 1px 6px rgba(0,0,0,.2);
  background: #000;
  opacity: 0.6;
}
.ivu-message .ivu-icon {
  margin-right: 10px;
  font-size: 16px;
}
</style>
<script>
  import {mapGetters, mapActions} from 'vuex';
  import PlanList from './menu.vue'
  import axios from 'axios'
  import {hex_md5} from '../../lib/md5'

  export default {
    
    name: 'app',
    data(){
      return{
        logo:'../../../images/logo.png',
        whetherLand : false,
        sign:false,
        formValidate: {
          name: localStorage.landName,
          password: localStorage.landPassword
        },
        ruleValidate: {
          name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      }
      
    },
    mounted(){
      if(sessionStorage.yuqingUid == undefined){
       this.whetherLand = false;
       this.sign = false;
     }else{
      this.whetherLand = true;
      this.sign = true;
     }
     this.$Message.config({
    top: 200
});
  },
  computed:{
    ...mapGetters({
      menus: 'getMenu'
    }),
    // xxx() {
    //   this.$route
    //   returns false;
    // }
  },
  methods: {
    ...mapActions([
      'getMenu'
      ]),
    handleSubmit(name){
      this.$refs[name].validate((valid) => {
        if (valid) {
          let time =Date.parse(new Date())/1000
          let md5 = hex_md5('yiban'+time);
          axios.get('/yibanSA/loginCtrl/login.do',{
            params:{
              uname:this.formValidate.name,
              pwd:this.formValidate.password,
              encrypt:md5,
              time:time
            }

          })
          .then((resp) => {
            if(resp.data.success){
              sessionStorage.yuqingUid = resp.data.data;
              sessionStorage.isWarn = false;
              sessionStorage.isAddyuqing = true;
              localStorage.landName = this.formValidate.name;
              localStorage.landPassword = this.formValidate.password;
              this.whetherLand = true;
              this.sign = true;
              this.$router.push('/yq/home');
            }else{
              if(resp.success){
                 this.$Message.success(resp.data.data);
               }else{
                 this.$Message.success('账号或密码错误');
               }
             
            }
            
          })
        } else {
          //this.$Message.error('表单验证失败!');
        }
      })
      
    },
    signOut(){
      this.whetherLand = false;
      this.sign = false;
      sessionStorage.removeItem('yuqingUid');
      sessionStorage.removeItem('yuqingId');
    }
  },
  components:{
    PlanList
  },
  created(){
    if (!this.menus.length) {
      this.getMenu();
    }
  }
};
</script>
