<template>
  <div class="container">
    <div class="cover-wrap" @click="coverShow()">
      <img class="cover-img" ref="cover-img" alt="" />
    </div>
    <!-- 弹出框 -->
    <el-dialog
      class="cover-dialog"
      append-to-body
      title="选择封面素材"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first"></el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input ref="file" type="file" @change="onFileChange()" />
          <img ref="perview-img" width="100" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { upLoadImages } from '@/api/material'
export default {
  name: 'articleCover',
  props: ['value'],
  data() {
    return {
      dialogVisible: false,
      activeName: 'first'
    }
  },
  methods: {
    // 控制弹框显示
    coverShow() {
      this.dialogVisible = true
    },
    onFileChange() {
      // input 本身有一个change事件，@change
      // 拿到input这个操作节点$refs
      // 获取将要预览的图片 ==> const file = this.$refs.files[0]
      const file = this.$refs.file.files[0]
      // 生成预览图片链接 ==> window.URL.createObjectURL(file)
      const blobData = window.URL.createObjectURL(file)
      // 操作图片DOM节点
      this.$refs['perview-img'].src = blobData
      // 为了防止用户选择同一张图片不触发change事件 ==> this.$refs.file.value = ''
      // this.$refs.file.value = ''
    },
    // 提交操作
    onCoverConfirm() {
      const file = this.$refs.file.files[0]
      if (this.activeName === 'second' && !file) {
        this.$message({
          type: 'success',
          message: '请选择上传图片'
        })
        return
      }
      // 执行上传文件大的操作
      const fd = new FormData()
      fd.append('image', file)
      upLoadImages(fd).then((res) => {
        console.log(res)
        this.$refs['cover-img'].src = res.data.data.url
        this.dialogVisible = false
        // 把后端返回来的地址传给父组件
        this.$emit('input', res.data.data.url) // 优化写法 在子组件里发布了一个input事件
        // this.$emit('updata-cover', res.data.data.url)
      })
    }
  }
}
</script>

<style lang="less">
.container {
  .cover-wrap {
    height: 100px;
    width: 100px;
    border: 1px solid #000;
    .cover-img {
      height: 100px;
      max-width: 100px;
    }
  }
}
</style>
