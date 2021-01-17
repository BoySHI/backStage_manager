<template>
  <div class="login-container">
    <el-form class="login-form" ref="login-form" :model="user">
      <el-form-item>
        <el-input v-model="user.mobile" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked">我已阅读并同意用户协议</el-checkbox>
      <el-form-item>
        <el-button type="primary" :loading="loginLoading" @click="onLogin" class="login-btn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import request from '../../utils/request'
import { login } from '../../api/user'
export default {
data() {
  return {
    user: {
      mobile: '',
      code: ''
    },
    checked: false,
    loginLoading: false
  }
},
methods: {
  onLogin() {
    // const user = this.user
    this.loginLoading = true
    login(this.user).then(res=>{
      console.log(res);
      this.loginLoading = false
      this.$message({
      message: '恭喜你，登录成功',
      type: 'success'
      })
      this.$router.push('/')
    }).catch(err=> {
      this.loginLoading = false
      console.log(err);
      this.$message({
        message: '登录失败，用户名或验证码失败',
        type: 'warning'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(../../../public/static/img/login_bg.jpg) no-repeat;
    background-size: cover;
    .login-form{
      background: #fff;
      padding: 50px;
      min-width: 300px;
    }
    .login-btn{
      width: 100%;
      margin-top: 30px;
    }
  }
</style>
