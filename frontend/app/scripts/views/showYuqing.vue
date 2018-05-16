<template>
  <section class="page addYuqing">
    <div class="container">
      <ul class="clearfix sub-menu">
        <router-link to="/yq/home" tag="li">信息列表</router-link>
        <router-link to="/yq/report" tag="li">舆情报告</router-link>
        <router-link to="/yq/addAlert" tag="li">预警通知</router-link>
        <router-link to="/yq/showYuqing" tag="li">舆情方案</router-link>
      </ul>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <div class="add-box">
          <div class="m-title">
            【易班舆情】舆情监控方案
          </div>
          <div class="first-form">
            <Form-item label="方案名称" prop = "planName">
            <Input v-model="formValidate.planName" disabled  placeholder="请输入舆情方案名称"></Input>
          </Form-item>
        </div>
        <Form-item label="监测内容" prop = "words">
        <p>监测内容中含有</p>
        <Input v-model="formValidate.words" disabled  placeholder="请输入舆情关键词，用逗号分开"></Input>
      </Form-item>
    </div>
  </Form>

</div>
</section>
</template>
<script>
 

  export default{
    created(){
     
    },
    data(){
      return{
        formValidate:{
          planName:localStorage.yuqingName + "的舆情监控方案",
          words:localStorage.yuqingWords
        },
        ruleValidate:{
          planName:[
          { required: true, message: '方案名称不能为空', trigger: 'blur' },
          ],
          words:[
          { required: true, message: '检测内容不能为空', trigger: 'blur' },

          ]
        }
      }
    },
    methods:{
    }
  }
</script>
