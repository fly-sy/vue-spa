<template>
  <div class="roles">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roles" border stripe>
        <!-- 展开列 -->
        <el-table-column label="缩放" type="expand" width="50px">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,index) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom','vcenter',{bdtop: index == 0 }]"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :class="['vcenter',{bdtop: index2 != 0 }]"
                  :key="item2.id"
                >
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" align="center"></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightsDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 
        show-checkbox  复选框
        node-key      唯一标识 string  
        default-expand-all 默认展开 
        default-expanded-keys	默认展开的节点的 key 的数组
      -->
      <el-tree
        :data="rights"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    roles: [],
    rightsDialogVisible: false,
    rights: [],
    defaultProps: {
      children: 'children',
      label: 'authName'
    },
    defKeys: [],
    roleId: 0
  }),
  created() {
    this.getRoles()
    // this.showSetRightDialog([])
  },
  methods: {
    async getRoles() {
      const {
        data: { data, meta }
      } = await this.$http.get('roles')
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.roles = data
    },
    async removeRightById(role, rightId) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const {
          data: { data, meta }
        } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (meta.status !== 200) return this.$message.error(meta.msg)
        // 删除成功提示
        this.$message.success('删除成功')
        console.log(data)
        // // 刷新数据
        // this.getRoles()
        role.children = data
      } catch (err) {
        this.$message.info('已经撤销删除')
      }
    },
    async showSetRightDialog(row) {
      this.roleId = row.id
      const {
        data: { data, meta }
      } = await this.$http.get('rights/tree')
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.rights = data
      // 调用递归的方式给 defKeys 赋值
      this.getLeafKeys(row, this.defKeys)
      this.rightsDialogVisible = true
    },

    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听对话框关闭 后 重置 defKeys
    setRightDialogClosed() {
      this.defKeys = []
    },
    async allotRights() {
      // 获取所有的 节点 id
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const rids = keys.join(',')
      const {
        data: { data, meta }
      } = await this.$http.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status !== 200) return this.$message.error(meta.msg)

      this.$message.success('分配权限成功！')
      this.getRoles()
      this.rightsDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.roles {
  .el-tag {
    margin: 8px;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
}
</style>