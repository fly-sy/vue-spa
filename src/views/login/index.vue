<template>
  <div class="login">
    <div class="login-box"></div>
  </div>
</template>
<script>
export default {};
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
  }
}
</style>