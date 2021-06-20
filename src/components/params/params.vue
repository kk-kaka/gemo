<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <div>
        <span class="demonstration">选择商品分类</span>
        <el-cascader
          v-model="selectKeys"
          :options="paramsData"
          :props="paramsDataProps"
          @change="changeParams"
          clearable
          @clear="clearCascader"
        ></el-cascader>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many" :disabled="tabPaneDisable">
          <el-button
            type="primary"
            :disabled="tabPaneDisable"
            @click="addParams"
            >添加参数</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only" :disabled="tabPaneDisable">
          <el-button
            type="primary"
            :disabled="tabPaneDisable"
            @click="addParams"
            >添加参数</el-button
          ></el-tab-pane
        >
      </el-tabs>
      <el-table border stripe :data="tableList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag
              :key="i"
              v-for="(item, i) in scope.row.attr_vals"
              closable
              @close="closeTag(scope.row, i)"
            >
              {{ item }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(scope.row)"
              >+ New Tag</el-button
            >
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="putParams(scope.row.attr_id)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteParams(scope.row.attr_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      width="30%"
      :title="'添加参数'"
      :visible.sync="dialogAddParamsVisible"
      @close="clearDialog"
    >
      <el-form :model="add" :rules="addRules" ref="addRefs">
        <el-form-item :label="activeParams + '参数'" prop="addName">
          <el-input v-model="add.addName" autocomplete="off" la></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkAddParams">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="30%"
      :title="'修改参数'"
      :visible.sync="dialogPutParamsVisible"
      @close="clearDialog"
    >
      <el-form :model="add" :rules="addRules" ref="addRefs">
        <el-form-item :label="activeParams + '参数'" prop="addName">
          <el-input v-model="add.addName" autocomplete="off" la></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPutParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkPutParams">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    paramsData: [],
    selectKeys: [],
    manytableList: [],
    onlytableList: [],
    cateID: '',
    dialogPutParamsVisible: false,
    tabPaneDisable: true,
    dialogAddParamsVisible: false,
    activeName: 'many',
    inputValue: '',
    add: {
      addID: '',
      addName: ''
    },
    addID: '',
    addRules: {
      addName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
    },
    paramsDataProps: {
      value: 'cat_id',
      label: 'cat_name',
      children: 'children',
      expandTrigger: 'hover'
    }
  }),
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const { data: res } = await this.$http.get('categories')
      //   console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('请求数据失败')
      }
      this.paramsData = res.data
    },
    changeParams() {
      if (this.selectKeys.length !== 3) {
        this.tabPaneDisable = true
        this.selectKeys = ''
        this.manytableList = []
        this.onlytableList = []
        return
      }
      this.tabPaneDisable = false
      this.cateID = this.selectKeys[2]
      this.getParamsList()
    },
    handleClick() {
      this.getParamsList()
      console.log(this.selectKeys)
      console.log(this.activeName)
    },
    async getParamsList() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表数据失败')
      }
      res.data.forEach(item => {
        item.inputVisible = false
        item.inputValue = ''
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // console.log(item)
      })
      if (this.activeName === 'many') {
        this.manytableList = res.data
      } else {
        this.onlytableList = res.data
      }
      // console.log(this.manytableList)
    },
    clearCascader() {
      this.selectKeys = []
      this.manytableList = []
      this.cateID = ''
    },
    addParams() {
      this.dialogAddParamsVisible = true
    },
    async checkAddParams() {
      await this.$http.post(`categories/${this.cateID}/attributes`, {
        attr_name: this.add.addName,
        attr_sel: this.activeName
      })
      this.dialogAddParamsVisible = false
      this.$refs.addRefs.resetFields()
      this.getParamsList()
    },
    async deleteParams(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          await this.$http.delete(`categories/${this.cateID}/attributes/${id}`)
          this.getParamsList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    clearDialog() {
      this.$refs.addRefs.resetFields()
    },
    async putParams(id) {
      this.dialogPutParamsVisible = true
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      this.add.addID = res.data.attr_id
      this.add.addName = res.data.attr_name
      console.log(res.data)
    },
    async checkPutParams() {
      const data = await this.$http.put(
        `categories/${this.cateID}/attributes/${this.add.addID}`,
        { attr_name: this.add.addName, attr_sel: this.activeName }
      )
      console.log(data)
      this.dialogPutParamsVisible = false
      this.getParamsList()
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim() === '') {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      console.log(row.attr_vals.join(','))
      await this.$http.put(
        `categories/${this.cateID}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )
      row.inputVisible = false
      row.inputValue = ''
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async closeTag(row, index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          row.attr_vals.forEach(item => {
            if (item === row.attr_vals[index]) {
              console.log(row.attr_vals)
              row.attr_vals.splice(index, 1)
            }
          })
          await this.$http.put(
            `categories/${this.cateID}/attributes/${row.attr_id}`,
            {
              attr_name: row.attr_name,
              attr_sel: row.attr_sel,
              attr_vals: row.attr_vals.join(',')
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  computed: {
    tableList() {
      if (this.activeName === 'many') {
        return this.manytableList
      }
      return this.onlytableList
    },
    activeParams() {
      if (this.activeName === 'many') {
        return '动态'
      }
      return '静态'
    }
  }
}
</script>
<style scoped>
.el-alert {
  margin-bottom: 20px;
}
.el-tabs {
  margin-top: 20px;
}
.demonstration {
  margin-right: 10px;
}
.el-cascader {
  width: 30%;
}
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin-left: 30px;
}
.button-new-tag {
  margin-left: 30px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 30px;
  vertical-align: bottom;
}
</style>
