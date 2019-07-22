<template>
  <div class="users">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="users" border stripe>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="姓名" prop="username" align="center"></el-table-column>
        <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
        <el-table-column label="电话" prop="mobile" align="center"></el-table-column>
        <el-table-column label="角色" prop="role_name" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <!-- 使用作用域插槽的方式传递数据给父组件，然后可以通过父组件控制子组件的状态 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
              :disabled="scope.row.id == 500"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="173px" align="center">
          <!-- 为什么这里使用作用域插槽? 子组件只做布局上的渲染，所有的数据的操作都由父组件控制-->
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              :disabled="scope.row.id == 500"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
              :disabled="scope.row.id == 500"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
                :disabled="scope.row.id == 500"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 
          分页功能 
          handleSizeChange      改变总条数 
          handleCurrentChange   前往某一页
          current-page          当前页码
      -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          当前角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱的规则
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    const checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      users: [],
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 修改表单的验证规则对象
      editFormRules: {
        email: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入用户手机', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }]
      },
      setRoleDialogVisible: false,
      userInfo: {},
      selectedRoleId: '',
      roles: []
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    // 获取用户列表
    async getUsers() {
      const {
        data: { data, meta }
      } = await this.$http.get('users', { params: this.queryInfo })
      if (meta.status !== 200) return this.$message.error(meta.msg)
      console.log(data)
      this.users = data.users
      this.total = data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUsers()
    },
    // 前往某一页
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUsers()
    },
    // 修改状态
    async userStateChanged(userinfo) {
      const {
        data: { data, meta }
      } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (meta.status !== 200) {
        // 防止更新失败页面数据和后台数据不同步
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error(meta.msg)
      }
      this.$message.success(meta.msg)
    },
    // 关闭添加对话框并重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const {
          data: { data, meta }
        } = await this.$http.post('users', this.addForm)
        if (meta.status !== 201) return this.$message.error(meta.msg)
        // 添加成功提示
        this.$message.success(meta.msg)
        // 关闭对话框
        this.addDialogVisible = false
        // 刷新数据
        this.getUsers()
      })
    },
    // 显示编辑对话框
    async showEditDialog(id) {
      this.editDialogVisible = true
      const {
        data: { data, meta }
      } = await this.$http.get('users/' + id)
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.editForm = data
    },
    // 关闭编辑对话框并重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑用户
    async editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {
          data: { data, meta }
        } = await this.$http.put('users/' + this.editForm.id, this.editForm)
        if (meta.status !== 200) return this.$message.error(meta.msg)
        // 添加成功提示
        this.$message.success(meta.msg)
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据
        this.getUsers()
      })
    },
    // 通过id删除用户
    async removeUserById(id) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const {
          data: { data, meta }
        } = await this.$http.delete('users/' + id)
        if (meta.status !== 200) return this.$message.error(meta.msg)
        // 删除成功提示
        this.$message.success(meta.msg)
        // 刷新数据
        this.getUsers()
      } catch (err) {
        this.$message.info('已经撤销删除')
      }
    },
    async setRole(row) {
      this.userInfo = row
      const {
        data: { data, meta }
      } = await this.$http.get('roles')
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.roles = data
      this.setRoleDialogVisible = true
    },
    // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }

      const {
        data: { data, meta }
      } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })

      if (meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }

      this.$message.success('更新角色成功！')
      this.getUsers()
      this.setRoleDialogVisible = false
    },

    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style lang="less" scoped>
</style>