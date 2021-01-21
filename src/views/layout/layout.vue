<template>
  <el-container class="layout-container">
    <el-aside width="auto" class="aside">
      <asides :is-collapse="isCollapse"></asides>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-l">
          <span
            ><i class="iconfont icon-fold" @click="isCollapse = !isCollapse"></i
            >今日头条后台管理系统</span
          >
        </div>
        <div class="header-r">
          <div class="avatar">
            <img :src="user.photo" alt="" />
            <el-dropdown>
              <span>
                {{ user.name }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人设置</el-dropdown-item>
                <el-dropdown-item @click.native="onLogout"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main class="main"><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import asides from "./coms/asides";
import { getUserProfile } from "../../api/user";
export default {
  name: "Layout",
  components: {
    asides,
  },
  data() {
    return {
      user: {}, // 当前用户登录信息
      isCollapse: false, // 控制隐藏显示侧边栏
    };
  },
  created() {
    this.loadUserProfile();
  },
  methods: {
    loadUserProfile() {
      getUserProfile().then((res) => {
        // console.log(res);
        this.user = res.data.data;
      });
    },
    // 用户退出，弹出提示弹窗
    onLogout() {
      //提示弹窗
      this.$confirm("此操作将会退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 完成退出操作
          window.localStorage.removeItem("user");
          this.$router.push("/login");
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消退出'
          //   })
        });
    },
  },
};
</script>
  
<style lang="less" scoped>
.layout-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .aside {
    background: #d3dce6;
  }
  .header {
    // background: #4b4b4b;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    .header-r {
      .avatar {
        display: flex;
        align-items: center;
      }
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  // .main{
  //   background: #e9eef3;
  // }
}
</style>
