<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryinfo.query"
            clearable
            @clear="getuserItem"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table border :data="userItem" style="width: 100%">
        <el-table-column type="index" label="#" width="35"> </el-table-column>
        <!-- <el-table-column prop="id" label="id" width="50"> </el-table-column> -->
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="changeStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope>
            <el-button
              type="primary"
              class="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              class="el-icon-delete"
              size="mini"
            ></el-button>
            <el-button
              type="warning"
              class="el-icon-setting"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryinfo.pagenum"
          :page-sizes="[1, 2, 4]"
          :page-size="queryinfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userItem: [],
      total: 0
    }
  },
  created() {
    this.getuserItem()
  },
  methods: {
    async getuserItem() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryinfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userItem = res.data.users
      this.total = res.data.total
      // console.log(this.total)
      // return this.$message.success(res.meta.msg)
    },
    async changeStatus(obj) {
      // console.log(obj)
      const { data: res } = await this.$http.put(
        `/users/${obj.id}/state/${obj.mg_state}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getuserItem()
      // console.log(res)
      return this.$message.success(res.meta.msg)
    },
    async search() {
      this.getuserItem()
    },
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryinfo.pagesize = newSize
      this.getuserItem()
    },
    handleCurrentChange(newCurrent) {
      console.log(newCurrent)
      this.queryinfo.pagenum = newCurrent
      this.getuserItem()
    }
  }
}
</script>
<style lang="less">
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  margin-top: 20px;
}
</style>
