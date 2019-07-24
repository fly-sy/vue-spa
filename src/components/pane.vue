<template>
  <!-- 动态参数表格 -->
  <el-table :data="data" border stripe>
    <!-- 展开行 -->
    <el-table-column type="expand"></el-table-column>
    <!-- 索引列 -->
    <el-table-column type="index"></el-table-column>
    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-edit"
          @click="showEditDialog(scope.row.attr_id)"
        >编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="removeParams(scope.row.attr_id)"
        >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  data: () => ({}),
  props: ['data'],
  created() {},
  methods: {}
}
</script>
<style lang="less" scoped>
</style>