<template>
  <div>
    <el-card>
      123
    </el-card>
  </div>
</template>
<script>
export default {
  data: () => ({
    roleData: [],
    columns: [
      {
        label: '角色名',
        prop: 'roleName',
        width: '300px',
        children: 'children'
      },
      {
        label: '权限说明',
        prop: 'roleDesc',
        width: '300px'
      }
    ]
  }),
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status === 200) {
        this.roleData = res.data
        console.log(this.roleData)
      }
    }
  }
}
</script>
<style scoped></style>
