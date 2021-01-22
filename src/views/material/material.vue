<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="main">
        <el-radio-group v-model="collect" @change="onCollectChange" size="mini">
          <!-- <el-radio-button
            label="全部"
            @click.native="loadImage(false)"
          ></el-radio-button>
          <el-radio-button
            label="收藏"
            @click.native="loadImage(true)"
          ></el-radio-button> -->
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          size="mini"
          type="success"
          @click="dialogUploadVisible = true"
          >上传素材</el-button
        >
      </div>
      <div class="image">
        <el-row :gutter="10">
          <el-col
            class="image-list"
            :xs="12"
            :sm="8"
            :md="6"
            :lg="4"
            v-for="(item, index) in images"
            :key="index"
            fit="cover"
          >
            <el-image style="height: 100px" :src="item.url"></el-image>
            <div class="image-active">
              <i
                :class="{
                  'el-icon-star-on': images.is_collected,
                  'el-icon-star-off': !images.is_collected,
                }"
                @click="onCollect(images)"
              ></i>
              <!-- <i :class="{ 'el-icon-star-off': !images.is_collected }"></i> -->
              <i class="el-icon-delete"></i>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :current-page.sync="page"
        @current-change="onCurrentChange(page)"
      >
      </el-pagination>
    </el-card>
    <!-- 弹出层 -->
    <el-dialog
      title="上传图片"
      :append-to-body="true"
      :visible.sync="dialogUploadVisible"
    >
      <el-upload
        class="upload-demo"
        action
        drag
        :http-request="upLoadImage()"
        :on-success="onUpLoadSuccess"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getUserImage, upLoadImages } from "@/api/material";
export default {
  name: "Material",
  data() {
    // const user = JSON.parse(window.localStorage.getItem("user"));
    return {
      totalCount: 0,
      page: 1,
      collect: false,
      images: [], // 用户的图片
      dialogUploadVisible: false, //控制弹框是否显示
      // uploadHeaders: {
      //   Authorization: `Bearer ${user.token}`,
      // },
    };
  },
  created() {
    this.loadImage(1, false);
  },
  methods: {
    // 获取素材图片
    loadImage() {
      getUserImage({
        collect: this.collect,
        page: this.page,
        per_page: 10,
      }).then((res) => {
        console.log(res);
        const { results, total_count: totalCount } = res.data.data;
        this.images = results;
        this.totalCount = totalCount;
      });
    },
    // 控制全部 || 收藏 按钮
    onCollectChange(value) {
      this.loadImage(1, value);
    },
    // 上传素材图片
    upLoadImage() {
      const fd = new FormData();
      fd.append("image", "file");
      upLoadImages({
        fd,
      }).then((res) => {
        console.log(res);
      });
    },

    // 上传成功之后 的钩子函数
    onUpLoadSuccess() {
      this.dialogUploadVisible = false;
      this.loadImage(this.page);
    },
    onCurrentChange(page) {
      this.loadImage(page);
    },
    // 收藏点击事件
    onCollect() {},
  },
};
</script>

<style lang="less" scoped>
.container {
  .main {
    display: flex;
    justify-content: space-between;
  }
  .image {
    // margin-top: 20px;
    height: 300px;
    overflow: hidden;
    .image-list {
      position: relative;
      margin-top: 20px;
    }
    .image-active {
      position: absolute;
      bottom: 4px;
      right: 0;
      left: 0;
      background-color: rgba(203, 203, 203, 0.5);
      height: 30px;
      margin-left: 5px;
      margin-right: 5px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
}
</style>
