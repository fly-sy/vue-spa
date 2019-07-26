<template>
  <div class="add">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                props.expand-trigger="hover"
                :options="catelist"
                :props="cateProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传到的后台API地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data: () => ({
    activeIndex: 0,
    // 添加商品的表单数据对象
    addForm: {
      goods_name: '',
      goods_price: '',
      goods_weight: '',
      goods_number: '',
      // 商品所属的分类数组
      goods_cat: [],
      // 图片的数组
      pics: [],
      // 商品的详情描述
      goods_introduce: '',
      attrs: []
    },
    addFormRules: {
      goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
      goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
      goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
      goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
      goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
    },
    catelist: [],
    cateProps: {
      label: 'cat_name',
      value: 'cat_id',
      children: 'children'
    },
    manyTableData: [],
    onlyTableData: [],
    uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
    // 图片上传组件的headers请求头对象
    headerObj: {
      Authorization: sessionStorage.getItem('token')
    },
    previewPath: '',
    previewVisible: false
  }),
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }

      this.catelist = res.data
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave(newActive, oldActive) {
      if (oldActive === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    tabClicked() {
      // 证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        this.getParamsData('many')
      } else if (this.activeIndex === '2') {
        this.getParamsData('only')
      }
    },
    async getParamsData(sel) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: sel }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取动态参数列表失败！')
      }

      if (sel === 'many') {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    handlePreview(file) {
      // 获取服务器图片的地址
      this.previewPath = file.response.data.url
      // 显示对话框
      this.previewVisible = true
    },
    handleRemove(file) {
      // 获取到删除的临时路径
      const filePath = file.response.data.tmp_path
      // 通过临时路径查找在数组中的索引
      const index = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 删除当前的临时路径
      this.addForm.pics.splice(index, 1)
    },
    handleSuccess(res) {
      // 把要上传的图片路径维护到表单属性上
      this.addForm.pics.push({ pic: res.data.tmp_path })
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 执行添加的业务逻辑
        // lodash   cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.add {
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }
  .btnAdd {
    margin-top: 15px;
  }
}
</style>
