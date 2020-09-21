<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt srcset />
        <span>电商管理后台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px': '200px'">
        <div class="toggle-buton" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#56A1EF" 
        :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" router
        :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path " v-for="subItem in item.children" :key="subItem.id" 
            @click="saveNavClick('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList:[],
      iconObj:{
        '101' :'iconfont icon-folder-fill',
        '102' :'iconfont icon-management-',
        '103' :'iconfont icon-eye-fill',
        '125' :'iconfont icon-user-group-fill',
        '145' :'iconfont icon-databaseset-fill',
      },
      isCollapse: false,
      activePath:''
    }
  },
  created () {
    this.getMenuList(),
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear() // 清空token
      this.$router.push('/logout') // 跳转到登录页
    },
    //获取所有的菜单
    async getMenuList() {
      const {data : res } =  await this.$http.get('menus');
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data;
      // console.log(res);
    },
    toggleCollapse(){
      //收缩菜单栏
      this.isCollapse = !this.isCollapse;
    },
    //保存链接的激活状态
    saveNavClick(activePath){
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;//被点击的菜单保持高亮状态
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #56a1ef; //#373d41
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      height: 60px;
      width: 100px;
      border-radius: 50%;
    }
  }
}

.el-aside {
  background-color: #303133; //#333744
}

.el-main {
  background-color: #eaedf1;
}

.el-menu{
  border-right:0;
}
.iconfont{
   padding-right: 10px;
}
.toggle-buton{
   background-color: #4a5064;
   font-size: 10px;
   line-height: 26px;
   color: #fff;
   text-align: center;
   letter-spacing: 0.3em;
   cursor: pointer;
}
</style>
