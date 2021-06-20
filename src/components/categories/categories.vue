<template>
  <div>
    <el-dialog
      title="添加分类"
      :visible.sync="dialogFormVisible"
      width="30%"
      @close="clearDialog"
    >
      <el-form :model="form" :rules="rules" ref="addCateRef">
        <el-form-item label="分类名称" label-width="80px" prop="cat_name">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="80px" width="100%">
          <el-cascader
            v-model="selectKeys"
            :options="addCategoriesData"
            :props="categoriesDataProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkAddCate">确 定</el-button>
      </div>
    </el-dialog>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="methods">
        <el-button type="primary" size="medium" @click="addCate"
          >添加分类</el-button
        >
      </div>
      <tableTree
        :data="categoriesData"
        :columns="columns"
        :expand-type="false"
        show-index
        index-text="#"
        :selection-type="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color:lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="info" v-if="scope.row.cat_level === 2">三级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level === 3">四级</el-tag>
        </template>
        <template slot="button">
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </tableTree>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="categoriesStatus.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data: () => ({
    categoriesData: [],
    addCategoriesData: [],
    categoriesDataProps: {
      value: 'cat_id',
      label: 'cat_name',
      children: 'children',
      expandTrigger: 'hover',
      checkStrictly: 'true'
    },
    dialogFormVisible: false,
    form: {
      cat_pid: 0,
      cat_name: '',
      cat_level: 0
    },
    selectKeys: [],
    categoriesStatus: {
      type: 3,
      pagenum: 1,
      pagesize: 5
    },
    total: 0,
    columns: [
      {
        label: '类名',
        prop: 'cat_name',
        width: '300px'
      },
      {
        label: '是否有效',
        width: '300px',
        type: 'template',
        template: 'isok'
      },
      {
        label: '当前层级',
        width: '300px',
        type: 'template',
        template: 'level'
      },
      {
        label: '操作',
        width: '300px',
        type: 'template',
        template: 'button'
      }
    ],
    rules: {
      cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
    }
  }),
  methods: {
    async getData() {
      const { data: res } = await this.$http.get('categories', {
        params: this.categoriesStatus
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取分类数据失败')
      }
      this.categoriesData = res.data.result
      this.total = res.data.total
      // console.log(this.categoriesData)
    },
    async getAddCateData() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取分类数据失败')
      }
      this.addCategoriesData = res.data
    },
    handleSizeChange(val) {
      this.categoriesStatus.pagesize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.categoriesStatus.pagenum = val
      this.getData()
    },
    addCate() {
      this.getAddCateData()
      this.dialogFormVisible = true
    },
    handleChange() {
      console.log(this.selectKeys)
      this.$refs.addCateRef.validate(valid => {
        if (!valid) return
        if (this.selectKeys.length > 0) {
          this.form.cat_pid = this.selectKeys[this.selectKeys.length - 1]
          this.form.cat_level = this.selectKeys.length
        } else {
          this.form.cat_pid = 0
          this.form.cat_level = 0
        }
      })
    },
    async checkAddCate() {
      const { data: res } = await this.$http.post('categories', this.form)
      // if (res.meta.status !== 200) {
      //   return this.$message.error('添加分类是失败')
      // }
      console.log(res)
      this.dialogFormVisible = false
      this.getData()
    },
    clearDialog() {
      this.selectKeys = []
      this.form = {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      }
    }
  },
  created() {
    this.getData()
  }
}
</script>
<style>
.el-breadcrumb {
  margin-bottom: 20px;
}
.methods {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.el-cascader {
  width: 100%;
}
.el-pagination {
  margin-top: 10px;
}
</style>
