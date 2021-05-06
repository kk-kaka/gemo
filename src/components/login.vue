<template>
  <div id="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="form"
        :rules="formRules"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      formRules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    reset() {
      this.$refs.loginFormRef.resetFields()
      // console.log(this)
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.form)
        if (res.meta.status === 200) {
          this.$message.success(res.meta.msg)
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        } else {
          this.$message.error(res.meta.msg)
        }
      })
    }
    // axioslanjie () {
    //     this.$http.interceptors.response.use(function (res) {
    //         return res.data.meta
    //     }, function (err) {
    //         console.log(err)
    //     })
    // }
  }
  // mounted () {
  //     this.axioslanjie()
  // }
}
</script>

<style lang="less" scoped>
#login_container {
  color: #fff;
  height: 100%;
  background-color: #2b4b6b;
  .login_box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #fff;
    .avatar_box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      width: 100%;
      padding: 0 20px;
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
