<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商系统</span>
      </div>
      <el-button type="info" @click="loout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#2C7AD6"
          :unique-opened="true"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in banner"
            :key="item.id"
          >
            <template slot="title">
              <i :class="icon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <el-menu-item
              :index="'/' + i.path"
              v-for="i in item.children"
              :key="i.id"
              @click="saveNavState('/' + i.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ i.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      banner: [],
      icon: {
        125: 'iconfont icon-user',
        103: 'iconfont el-icon-s-tools',
        101: 'iconfont el-icon-phone',
        102: 'iconfont icon-baobiao',
        145: 'iconfont icon-showpassword'
      },
      activePath: ''
    }
  },
  created() {
    this.getBannerData()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    loout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getBannerData() {
      const { data: res } = await this.$http.get('/menus')
      this.banner = res.data
      // console.log(res)
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less">
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    height: 50px;
    vertical-align: middle;
  }
  span {
    margin-left: 15px;
    color: #fff;
  }
}
.el-aside {
  background-color: #333744;
  span {
    margin-left: 10px;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
