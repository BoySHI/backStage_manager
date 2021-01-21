<template>
  <div class="publish-container">
    <!-- 面包屑路径导航 -->
    <el-card class="box-card">
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? "修改文章" : "内容管理"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        ref="publish-btn"
        :model="article"
        label-width="60px"
        :rules="formRules"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            height="300px"
            placeholder="请输入文章内容"
          />
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择">
            <el-option
              v-for="(channel, index) in channels"
              :key="index"
              :label="channel.name"
              :value="channel.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">{{
            $route.query.id ? "修改" : "发布"
          }}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image,
  CodeView,
} from "element-tiptap";
import {
  getArticleChannels,
  publishArticles,
  updataArticle,
  getArticles,
} from "@/api/article";
export default {
  name: "PublishedArticles",
  components: {
    "el-tiptap": ElementTiptap,
  },
  data() {
    return {
      article: {
        title: "", // 发表文章标题
        content: "", // 发表文章内容
        cover: {
          // 封面
          // type: 0,
          images: [],
        },
        channel_id: null, // 频道的id
      },
      channels: [], // 频道数据
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }),
        new Underline({ bubble: true, menubar: false }),
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Image(),
        new CodeView(),
      ],
      formRules: {
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          {
            min: 5,
            max: 30,
            message: "长度在 5 到 30 个字符",
            trigger: "blur",
          },
        ],
        content: [
          {
            validator(rule, value, callback) {
              if (value === "<p></p>") {
                return callback(new Error("请输入文章内容"));
              } else {
                callback();
              }
            },
          },
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
        channel_id: [{ required: true, message: "请选择频道类别" }],
      },
    }
  },
  created() {
    this.loadArticleChannels()
    this.loadArticle()
  },
  methods: {
    // 发表文章
    onPublish(draft) {
      // 表单验证
      this.$refs["publish-btn"].validate((valid) => {
        if (valid) {
          const articleId = this.$route.query.id;
          if (articleId) {
            // 执行修改操作
            updataArticle(articleId, this.article, draft).then((res) => {
              console.log(res);
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.$router.push("/article");
            });
          } else {
            publishArticles(this.article, draft).then((res) => {
              console.log(res);
              this.$message({
                message: "发表成功",
                type: "success",
              });
              this.$router.push("/article");
            });
          }
        } else {
          return false;
        }
      });
    },
    // 获取频道列表请求
    loadArticleChannels() {
      getArticleChannels().then((res) => {
        // console.log(res);
        this.channels = res.data.data.channels;
      });
    },
    // 获取指定修改的文章内容
    loadArticle() {
      getArticles(this.$route.query.id).then((res) => {
        // console.log(res);
        this.article = res.data.data;
      });
    },
  },
};
</script>

<style>
</style>
