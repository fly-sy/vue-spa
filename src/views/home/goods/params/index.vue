<template>
  <div class="params">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            props.expand-trigger="hover"
            :options="cates"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div v-if="scope.row.attr_vals.length > 0">
                  <el-tag
                    v-for="(attr_val,index) in scope.row.attr_vals"
                    :key="index"
                    closable
                  >{{attr_val}}</el-tag>
                  <!-- 输入的文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <!-- 添加按钮 -->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >+ New Tag</el-button>
                </div>
                <el-tag v-else>暂无数据</el-tag>
              </template>
            </el-table-column>
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
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
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
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    cates: [],
    // 级联选择框的配置对象
    cateProps: {
      value: 'cat_id',
      label: 'cat_name',
      children: 'children'
    },
    selectedCateKeys: [],
    activeName: 'many',
    manyTableData: [],
    onlyTableData: [],

    // 控制添加对话框的显示与隐藏
    addDialogVisible: false,
    // 添加参数的表单数据对象
    addForm: {
      attr_name: ''
    },
    // 添加表单的验证规则对象
    addFormRules: {
      attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
    },
    // 控制修改对话框的显示与隐藏
    editDialogVisible: false,
    // 修改的表单数据对象
    editForm: {},
    // 修改表单的验证规则对象
    editFormRules: {
      attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
    },
    inputVisible: false
  }),
  created() {
    this.getCates()
  },
  methods: {
    // 获取级联菜单数据
    async getCates() {
      const {
        data: { data, meta }
      } = await this.$http.get('categories')
      if (meta.status !== 200) return this.$message.error('获取分类数据失败！')
      this.cates = data
    },
    // 选中级联菜单获取数据
    handleChange() {
      this.getParamsData()
    },
    // 动态切换获取不同的数据
    handleTabClick() {
      this.getParamsData()
    },
    // 封装动态参数数据获取
    async getParamsData() {
      // 判断是否选中三级子菜单
      if (this.selectedCateKeys.length !== 3) return (this.selectedCateKeys = [])
      const {
        data: { data, meta }
      } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })

      if (meta.status !== 200) return this.$message.error('获取参数列表失败！')

      // 遍历把字符串分割成数组
      data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 给每一项动态添加属性
        item.inputVisible = false
        item.inputValue = ''
      })

      console.log(data)

      // 判断并给不同的 选择赋值
      if (this.activeName === 'many') {
        this.manyTableData = data
      } else {
        this.onlyTableData = data
      }
    },

    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交表单
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const {
          data: { data, meta }
        } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })

        if (meta.status !== 201) return this.$message.error('添加参数失败！')

        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 点击按钮，展示修改的对话框
    async showEditDialog(attrId) {
      // 查询当前参数的信息
      const {
        data: { data, meta }
      } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
        params: { attr_sel: this.activeName }
      })

      if (meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }

      this.editForm = data
      this.editDialogVisible = true
    },
    // 重置修改的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，修改参数信息
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {
          data: { data, meta }
        } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })

        if (meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }

        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    handleInputConfirm() {},
    showInput(row) {
      row.inputVisible = true
    }
  },
  computed: {
    isBtnDisabled() {
      return this.selectedCateKeys.length !== 3 ? true : false
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.params {
  .el-cascader {
    width: 260px;
  }
  .cat_opt {
    margin: 15px 0;
  }
  .el-tag {
    margin-left: 15px;
  }

  .input-new-tag {
    width: 120px;
  }
}
</style>