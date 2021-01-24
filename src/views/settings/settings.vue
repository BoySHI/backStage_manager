<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <el-form
            ref="user-infor-form"
            :model="user"
            :rules="rules"
            label-width="80px"
          >
            <el-form-item label="编号：">{{ user.id }}</el-form-item>
            <el-form-item label="手机：">{{ user.mobile }}</el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍" prop="intro">
              <el-input v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="upDataUserinfor()"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" :offset="3">
          <label for="file">
            <el-avatar
              :span="4"
              shape="circle"
              :size="100"
              fit="cover"
              :src="user.photo"
            >
            </el-avatar>
            <p>点击修改头像</p>
          </label>
          <input
            ref="file"
            type="file"
            id="file"
            hidden
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>
    <!-- 弹出层 -->
    <el-dialog
      width="30%"
      center
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="ondialogOpened"
    >
      <div class="preview-image-wrap">
        <img :src="previewImage" alt="" ref="preview-image" />
      </div>
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="upDataPhoto()" size="small"
        >确 定</el-button
      >
    </el-dialog>
  </div>
</template>

<script>
import globalBus from '@/utils/global-bus'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs' // 裁剪器文件的引入
import { getUserProfile, updataUserPhoto, updataUserProfile } from '@/api/user'
export default {
  name: 'Settings',
  data() {
    return {
      user: {
        id: null,
        name: '',
        intro: '',
        photo: null,
        email: '',
        mobile: ''
      }, // 用户资料
      rules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在 1 到 7个字符', trigger: 'change' }
        ],
        intro: [{ required: true, message: '请输入媒体介绍', trigger: 'blur' }],
        email: [{ required: true, message: '请输入', trigger: 'blur' }]
      }, // 表单验证
      dialogVisible: false, //控制弹框显示和隐藏，默认是false
      previewImage: '', // 预览图片
      cropper: null // 裁剪器实例
    }
  },
  created() {
    this.loadUser()
  },
  methods: {
    // 更新用户信息
    upDataUserinfor() {
      // 表单验证
      this.$refs['user-infor-form'].validate((valid) => {
        if (valid) {
          updataUserProfile(this.user).then((res) => {
            console.log(res)
            // 利用事件总线进行传值
            globalBus.$emit('updataInfor', this.user)
          })
        }
      })
    },
    // 获取用户信息
    loadUser() {
      getUserProfile().then((res) => {
        console.log(res)
        this.user = res.data.data
      })
    },
    // 用户选择图片
    onFileChange() {
      console.log('onFileChange')
      const file = this.$refs.file //拿到input的dom元素
      const blobData = window.URL.createObjectURL(file.files[0]) // 生成预览图片的url
      this.previewImage = blobData
      // 解决用户选择相同图片不触发change 事件问题
      this.$refs.file.value = ''
      // 控制弹框显示
      this.dialogVisible = true
    },
    // 弹窗Dialog 打开动画结束时的回调
    ondialogOpened() {
      // 图片裁截器必须基于img进行初始化，初始化后裁剪器不会自动更新图片，需要自己更新
      // 方法一：裁切器.replace()
      // 方法二：销毁裁剪器，重新初始化
      // 注意：img 必须是可见状态才能正常完成初始化
      // 在弹框组件中利用opened事件完成
      // 获取图片DOM节点
      const image = this.$refs['preview-image']
      // 判断一下，如果有这个实例则替换掉初始化的实例
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      // 初始化裁剪器
      this.cropper = new Cropper(image, {
        //  aspectRatio: 16 / 9, 裁切框中初始化的大小 可以是1 则为正方形
        // viewMode 控制移动范围只能在框内
        // dragMode 值为none则表示不允许移动画布
        dragMode: 'none',
        viewMode: 1,
        aspectRatio: 16 / 9,
        crop(event) {
          console.log(event.detail.x)
          console.log(event.detail.y)
          console.log(event.detail.width)
          console.log(event.detail.height)
          console.log(event.detail.rotate)
          console.log(event.detail.scaleX)
          console.log(event.detail.scaleY)
        }
      })
    },
    // 修改头像
    upDataPhoto() {
      //拿到头像的文件
      this.cropper.getCroppedCanvas().toBlob((file) => {
        const formData = new FormData()
        formData.append('photo', file)
        // 交给后端
        updataUserPhoto(formData).then((res) => {
          console.log(res)
          // 重新渲染视图
          // 方法一
          this.user.photo = window.URL.createObjectURL(file)
          // 方法二
          // this.user.photo = res.data.data.photo
          // 关闭弹框
          this.dialogVisible = false
          globalBus.$emit('updataInfor', this.user)
          // 提示更新头像成功
          this.$message({
            type: 'success',
            message: '更新头像成功'
          })
        })
      })
    }
  }
}
</script>

<style lang = "less" scoped>
.preview-image-wrap {
  margin-bottom: 10px;
  img {
    display: block;
    /* This rule is very important, please don't ignore this */
    max-width: 100%;
    height: 200px;
  }
}
</style>