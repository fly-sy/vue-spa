<template>
  <div class="login">
    <div class="login-box">
      <div class="avatar-box">
        <img src="./fly.jpg" alt />
      </div>

      <el-form :model="login" ref="loginRef" class="login-form" :rules="loginRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="login.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="login.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="isLogin">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    login: {
      name: 'admin',
      password: '123456'
    },
    loginRules: {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }]
    }
  }),
  methods: {
    /**
     * 重置登录表单
     */
    resetLogin() {
      this.$refs.loginRef.resetFields()
      this.login.username = this.login.password = ''
    },

    /**
     * 登录
     */
    isLogin() {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return
        const {
          data: { data, meta } // 解构出 data 中的 data 和 meta 属性
        } = await this.$http.post('login', this.login)
        if (meta.status !== 200) return this.$message.success('登录失败!')
        this.$message.success('登录成功!')
        // 把 token保存到本地存储中
        sessionStorage.setItem('token', data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  height: 100%;
  background: #2b4b6b;
  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar-box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login-form {
      position: absolute;
      bottom: 10px;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }
    }
  }
}
</style>