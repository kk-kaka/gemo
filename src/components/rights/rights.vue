<template>
  <div>
    <el-card>
      <el-table :data="roleData" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbot', i1 == 0 ? '' : 'bdtop', 'center']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag
                  type="success"
                  closable
                  @close="deleteTag(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="['bdbot', i2 == 0 ? '' : 'bdtop', 'center']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="7">
                    <el-tag
                      type="warning"
                      closable
                      @close="deleteTag(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="17">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="deleteTag(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <div>{{ scope.row.children }}</div> -->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名"></el-table-column>
        <el-table-column prop="roleDesc" label="角色职责"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="small"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="changeRightsList(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="dialogListVisible">
      <el-tree
        :data="ListData"
        :props="defaultProps"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defaultsKeys"
        ref="changeListRef"
      ></el-tree>
      <el-button type="primary" @click="postList">确定</el-button>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    roleData: [],
    dialogListVisible: false,
    ListData: [],
    defaultsKeys: [],
    selectKeys: [],
    roleID: '',
    defaultProps: {
      value: 'id',
      label: 'authName',
      children: 'children'
    }
  }),
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status === 200) {
        this.roleData = res.data
      }
    },
    deleteTag(row, id) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const { data: res } = await this.$http.delete(
            `roles/${row.id}/rights/${id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('请求失败')
          }
          row.children = res.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async changeRightsList(role) {
      this.dialogListVisible = true
      const { data: res } = await this.$http.get('rights/tree')
      this.ListData = res.data
      // console.log(role.children)
      this.getDefaultsKey(role)
      console.log(role.id)
      this.roleID = role.id
    },
    getDefaultsKey(role) {
      // console.log(role.children)
      if (!role.children) {
        return this.defaultsKeys.push(role.id)
      }
      role.children.forEach(item => {
        this.getDefaultsKey(item)
        // console.log(item)
      })
    },
    async postList() {
      const checkedKeys = this.$refs.changeListRef.getCheckedKeys()
      const halfCheckedKeys = this.$refs.changeListRef.getHalfCheckedKeys()
      // console.log(this.checkedNodes)
      let rids = [...checkedKeys, ...halfCheckedKeys]
      rids = rids.join(',')
      await this.$http.post(`roles/${this.roleID}/rights`, {
        rids: rids
      })
      this.getData()
      this.dialogListVisible = false
    }
  }
}
</script>
<style scoped>
.el-tag {
  margin: 7px;
}
.bdbot {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
</style>
