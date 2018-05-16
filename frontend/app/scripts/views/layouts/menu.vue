<template>
  <div class="menu">
    <div class="title">
      舆情方案
    </div>
    <ul id="menu">
      <li @click="routeTo(item,$event)" class="item" v-bind:class="{'active':item.id == yuqingId}" v-for="(item,index) in yuqingPlan">
       <span :title="item.name">{{ item.name }}</span>
       <i class="ivu-icon ivu-icon-android-delete" @click="deleteYuqing($event)"></i>
     </li>
   </ul>
   <Modal class="textc" v-model="deleteModal" title="删除舆情方案">
    <p><span class="blue">【{{yuqingName}}】</span>舆情监控方案删除后,</p>
    <p>与方案关联的舆情预警方案也会删除。</p>
    <div slot="footer" class="textc">
      <Button @click="unregister">我再考虑下</Button>
      <Button type="primary" @click="deleteAjax">确认删除</Button>
    </div>
  </Modal>
  <div @click="addYuqing">
    <a class="btn-addPlan"><em>+</em>添加舆情方案</a></div>
  </div>
</template>
<script>
  import axios from 'axios'
  import {hex_md5} from '../../lib/md5'
  import {mapGetters, mapActions} from 'vuex';
  export default{
    created(){
      var that = this;
      this.getYuqingPlan(that);
     },
     data(){
      return{
        time:Date.parse(new Date())/1000,
        privateUser: this.yuqingPlan,
        yuqingId:sessionStorage.yuqingId,
        deleteModal:false,
        yuqingName:localStorage.yuqingName
      }
    },
    watch:{
      yuqingPlan(newVal){
        if(!newVal){//当舆情方案为空时，跳转到新增舆情页面
         this.$router.push('/yq/addYuqing');
       }
       this.privateUser = newVal;
       this.yuqingId = sessionStorage.yuqingId;
     }
   },
   computed:{
    md5:function(){
      return hex_md5('yiban'+this.time)
    },
    ...mapGetters({
      yuqingPlan: 'getYuqingPlan'
    })
  },
  methods:{
    ...mapActions([
      'getYuqing'
      ]),
    ...mapActions([
      'getYuqingPlan'
      ]),
    ...mapActions([
      'getYuqingNum'
      ]),
    ...mapActions([
      'getDimensions'
      ]),
    //点击添加舆情，调整到新增舆情页面
    addYuqing(){
        let liList = document.getElementById('menu').getElementsByTagName('li');
        if(liList.length >=10){
          this.$Message.warning('每个用户最多添加 10个 舆情方案，您可以将不再需要的删除后添加。');
        } else{
        this.$router.push('/yq/addYuqing');
        sessionStorage.isAddyuqing = false;
        sessionStorage.removeItem('yuqingId')
        this.yuqingId = 99;
        }
      },
      unregister(){
       this.deleteModal = false;
     },
     routeTo(item,event){
      //舆情方案没有改变不做任何操作
      if(sessionStorage.yuqingId == item.id) return;
      sessionStorage.isAddyuqing = true;
       this.yuqingId = sessionStorage.yuqingId=item.id;
       sessionStorage.isWarn = false;
       this.getDimensions(item.id)
       localStorage.yuqingName=item.name;
       localStorage.yuqingWords = item.keyWord;
        //判断是不是选择删除
        if(this.deleteModal == true) return false;
        var  liDom =  event.currentTarget
        var liList = event.currentTarget.parentNode.childNodes;
        for(var i =0;i<liList.length;i++){
         if(!(liList[i].getAttribute("class").indexOf('active') == -1)) {
          liList[i].classList.remove('active');
        }
      }
      if(liDom.getAttribute("class").indexOf('active') == -1){
        liDom.classList.add('active');
      }
      
      this.$router.push('/yq/home');
      localStorage.isWarn = item.isWarn;
      this.getYuqing({sid:item.id,getYuqingNum:this.getYuqingNum})
      this.getYuqingNum({sid:item.id});
    },
    //点击删除按钮,弹出对话框
    deleteYuqing(event){
     this.yuqingName = event.target.parentElement.innerText;
     this.deleteModal = true;
    },
    //确定删除
    deleteAjax(){
      sessionStorage.isAddyuqing = true;
      var that = this;
      axios.get('/yibanSA/schemeCtrl/delSchemaById.do',{
        params:{
          sid:sessionStorage.yuqingId,
          encrypt:this.md5,
          time:this.time
        }
      })
      .then((resp)=>{
        if(resp.data.success){
         sessionStorage.removeItem('yuqingId');
         that.$Message.success(resp.data.data);
         that.deleteModal = false;
         sessionStorage.isWarn = false;
         if(that.privateUser.length == 0){
          that.$router.push('/yq/addYuqing');
        }else{
          that.$router.push('/yq/home');
        }  
        that.getYuqingPlan(that);
      }else{
        that.$Message.error(resp.data.data);
      }
    })
    }
  }


}
</script>
