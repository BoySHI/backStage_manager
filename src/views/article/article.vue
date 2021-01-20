<template>
  <div class="artic-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
       <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status" size="medium">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" placeholder="请选择">
          <el-select v-model="channelId" placeholder="请选择">
            <el-option 
            :label="channel.name" 
            :value="channel.id" 
            v-for="(channel,index) in articleChannels" 
            :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" @click="loadArticle(1)" :disabled="loading">查询</el-button>
        </el-form-item>
      </el-form>
      </el-card>

      <el-card class="filter-card">
        <div slot="header" class="clearfix">
          根据筛选条件共查询到 {{totalCount}} 条结果：
        </div>
        <!-- 数据列表 -->
        <el-table
          v-loading="loading"
          :data="articles"
          style="width: 100%"
          size="mini">
          <el-table-column
            label="封面"
           >
            <template slot-scope="scope">
              <img 
                class="article-cover"
                v-if="scope.row.cover.images[0]"
                :src="scope.row.cover.images[0]" alt="">
              <img 
                class="article-cover"
                v-else
                src="static/img/nocover.gif" alt="">
            </template>  
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
           >
          </el-table-column>
          <el-table-column
            label="状态">
             <template slot-scope="scope">
            <el-tag 
            :type="articleStatus[scope.row.status].type">
            {{articleStatus[scope.row.status].text }}
            </el-tag>
             </template>
          </el-table-column>
            <el-table-column
            prop="pubdate"
            label="发布时间">
          </el-table-column>
            <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                circle
              >
               <i class="el-icon-edit"  @click="$router.push('/publish?id='+ scope.row.id)"></i>
              </el-button>
              <el-button
                size="mini"
                type="danger"
                circle
              >
              <i class="el-icon-delete" @click="onDeleteArticle(scope.row.id)"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @current-change="onCurrentChange(page)"
          :disabled="loading"
          :current-page.sync="page"
          background
          layout="prev, pager, next"
          :total="totalCount">
        </el-pagination> 
      </el-card>
    </div>
</template>

<script>
import {getArticle,getArticleChannels,deleteArticle} from '@/api/article'
export default {
  name:'Article',
  data() {
  return {
    form: {
        name: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [], //文章列表数据
      articleStatus: [
        {status: 0, text: '草稿', type: ''},
        {status: 1, text: '待审核', type: 'info'},
        {status: 2, text: '审核通过', type: 'success'},
        {status: 3, text: '审核失败', type: 'warning'},
        {status: 4, text: '已删除', type: 'danger'}
      ],
      totalCount: 0, // 记录查询的结果
      status: null, // 查询文章的状态，不传默认为为全部
      articleChannels: [], // 文章频道列表
      channelId: null, // 查询文章的频道
      rangeDate: null,  // 查询的时间范围
      loading: true,  // 请求数据加载中
      page: 1,
    }
  },
  created() {
    this.loadArticle()
    this.loadChannels()
  },
  methods: {
    loadArticle(page=1) {
      this.loading = true
      getArticle({
        page,
        per_page:10,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate:  this.rangeDate ? this.rangeDate[1] :null
        }).then(res=>{
        // console.log(res);
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        // 关闭loading
        this.loading = false
      })
    },
    onCurrentChange(page) {
      // console.log(page);
      this.loadArticle(page)
    },
    loadChannels() {
      getArticleChannels().then(res=>{
        // console.log(res);
        this.articleChannels = res.data.data.channels
      })
    },
    // 删除列表数据
    onDeleteArticle(articleId) {
      this.$confirm('此操作将会删除此数据, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteArticle(articleId.toString()).then(res=>{
        console.log(res);
        this.loadArticle(this.page)
         this.$message({
          message: '删除成功',
          type: 'success'
      })
      })
    }).catch(() => {
      // this.$message({
      //   type: 'info',
      //   message: '已取消退出'
      //   })        
      })
     
    }
  }
}
</script>

<style lang="less" scoped>
  .artic-container{
    .filter-card{
      margin-top: 10px;
    }
    .article-cover{
      width: 60px;
      background-size: cover;
    }
  }
</style>
