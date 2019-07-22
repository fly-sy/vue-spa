<template>
  <div class="cate">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 树状表格渲染 -->
      <!-- 
        表格 
        
        data 数据源
        columns 设置每一列的属性
        :selection-type="false" 关闭复选框
        :expand-type="false"    关闭缩放效果
        show-index 设置索引   
        index-text="#"  自定义索引列的名称
        border       边框 
        :show-row-hover="false"   选中高亮
      -->
      <tree-table
        class="tree-table"
        :data="cates"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="true"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加分类的对话框 -->
      <!-- @close="addCateDialogClosed" -->
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
        <!-- 添加分类的表单 -->
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- options 用来指定数据源 -->
            <!-- props 用来指定配置对象 -->
            <el-cascader
              expand-trigger="hover"
              :options="parentCateList"
              :props="cascaderProps"
              v-model="selectedKeys"
              @change="parentCateChanged"
              clearable
              change-on-select
            ></el-cascader>

            <!-- <el-cascader expand-trigger="hover" :options="parentCateList"></el-cascader> -->
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <!-- @click="addCate" -->
          <el-button type="primary">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data: () => ({
    // 查询条件
    querInfo: {
      type: 3,
      pagenum: 1,
      pagesize: 5
    },
    // 商品分类的数据列表，默认为空
    cates: [],
    // 总数据条数
    total: 0,
    // 为table指定列的定义
    columns: [
      {
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        // 表示，将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'isok'
      },
      {
        label: '排序',
        // 表示，将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'order'
      },
      {
        label: '操作',
        // 表示，将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'opt',
        align: 'center'
      }
    ],
    addCateDialogVisible: false,
    addCateForm: {
      // 将要添加的分类的名称
      cat_name: '',
      // 父级分类的Id
      cat_pid: 0,
      // 分类的等级，默认要添加的是1级分类
      cat_level: 0
    },
    // 添加分类表单的验证规则对象
    addCateFormRules: {
      cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
    },
    parentCateList: [],
    // 指定级联选择器的配置对象
    cascaderProps: {
      value: 'cat_id',
      label: 'cat_name',
      children: 'children'
    },
    // 选中的父级分类的Id数组
    selectedKeys: []
  }),
  created() {
    this.getCates()
  },
  methods: {
    // 获取商品分类数据
    async getCates() {
      const {
        data: { data, meta }
      } = await this.$http.get('categories', {
        params: this.querInfo
      })

      if (meta.status !== 200) return this.$message.error('获取商品分类失败！')

      // console.log(data)
      // 把数据列表，赋值给 cates
      this.cates = data.result
      // 为总数据条数赋值
      this.total = data.total
    },

    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCates()
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCates()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },

    // 获取父级分类的数据列表
    async getParentCateList() {
      const {
        data: { data, meta }
      } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (meta.status !== 200) return this.$message.error('获取父级分类数据失败！')

      console.log(data)
      this.parentCateList = data
    },
    parentCateChanged() {
      console.log(this.selectedKeys)
    }
  }
}
</script>
<style lang="less" scoped>
.cate {
  .tree-table {
    margin: 15px 0;
  }
  .el-cascader {
    width: 100%;
  }
}
</style>