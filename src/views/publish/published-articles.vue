<template>
  <div class="publish-container">
    <!-- 面包屑路径导航 -->
    <el-card class="box-card">
      <div slot="header" >
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>发布文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="form" :model="article" label-width="40px">
        <el-form-item label="标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="article.content"></el-input>
        </el-form-item>
      <el-form-item label="封面">
        <el-radio-group v-model="article.cover.type">
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道">
        <el-select v-model="article.channel_id" placeholder="请选择">
          <el-option 
            v-for="(channel,index) in channels"
            :key="index" 
            :label="channel.name" 
            :value="channel.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish(false)">发表</el-button>
        <el-button  @click="onPublish(true)">存入草稿</el-button>
      </el-form-item>
    </el-form>
    </el-card>
  </div>
</template>

<script>
import {getArticleChannels,publishArticles} from '@/api/article'
export default {
  name:'PublishedArticles',
  data() {
    return {
      article: {
        title: '', // 发表文章标题
        content: '',// 发表文章内容
        cover: { // 封面
          type: 0,
          images: []
        },
        channel_id: null // 频道的id
      },
      channels: [] // 频道数据
    }
  },
  created() {
    this.loadArticleChannels()
  },
  methods: {
    // 发表文章
    onPublish(draft) {
     publishArticles(this.article, draft).then(res=>{
       console.log(res);
        this.$message({
          message: '发表成功',
          type: 'success'
      })
     })
    },
    // 获取频道列表请求
    loadArticleChannels() {
      getArticleChannels().then(res=>{
        // console.log(res);
        this.channels = res.data.data.channels
      })
    }
  }
}
</script>

<style>

</style>
