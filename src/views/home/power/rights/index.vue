<template>
  <div class="rights">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rights" border stripe>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
        <el-table-column label="路径" prop="path" align="center"></el-table-column>
        <el-table-column label="权限等级" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data: () => ({
    rights: []
  }),
  created() {
    this.getRights()
  },
  methods: {
    async getRights() {
      const {
        data: { data, meta }
      } = await this.$http.get('rights/list')
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.rights = data
    }
  }
}
</script>
<style lang="less" scoped>
</style>