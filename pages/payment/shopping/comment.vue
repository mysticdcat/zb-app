<template>
    <div class="comment">
        <Headertitle :title="title"></Headertitle>
        <div class="bg">
            <div class="main">
                <div class="score">
                    <ul>
                        <li>总体</li>
                        <li>
                            <el-rate v-model="level" change="change">
                            </el-rate>
                        </li>
                        <li class="how">超赞</li>
                    </ul>
                    <ul>
                        <li>口味</li>
                        <li>
                            <el-rate v-model="mlevel">
                            </el-rate>
                        </li>
                        <li class="how">美味</li>
                    </ul>
                    <ul>
                        <li>环境</li>
                        <li>
                            <el-rate v-model="slevel">
                            </el-rate>
                        </li>
                        <li class="how">舒适</li>
                    </ul>
                    <ul>
                        <li>服务</li>
                        <li>
                            <el-rate v-model="rlevel">
                            </el-rate>
                        </li>
                        <li class="how">热情</li>
                    </ul>
                </div>
                <textarea name="" id="" cols="30" rows="10" placeholder="说点什么吧..." v-model="content">
                </textarea>
                <div class="upload">
                    <ul>
                        <li ref="add">
                            <van-uploader ref="fileInput" :after-read="onRead" accept="image/gif, image/jpeg" multiple max-num=6 :max-size='maxSize' result-type='text'>
                                <img src="~/assets/images/add.png" alt="">
                            </van-uploader>
                        </li>
                    </ul>
                    <p>图片上传</p>
                </div>
            </div>
            <footer>
                <p>餐厅印象</p>
                <span>有儿童椅</span>
                <span>景色壮观</span>
                <span>景色壮观</span>
            </footer>
            <div class="price">
                <div>用户消费</div>
                <div><input type="number" v-model="percapita"></div>
                <div>元</div>
            </div>
        </div>
        <div class="submit">
            <button @click="onSubmit">评价</button>
        </div>
    </div>
</template>
<script>
import { Uploader } from "vant";
import { Toast } from "vant";
import ts from "coordtransform";
import api from "~/api/index.js";
import Headertitle from "~/components/header/title.vue";
// import img from "~/api/img.js";
export default {
  head() {
    return {
      title: "评论"
    };
  },
  components: {
    Headertitle
  },
  data() {
    return {
      title: "评论",
      imgurlObj: [],
      maxSize: 1048576,
      imgData: {
        accept: "image/gif, image/jpeg, image/png, image/jpg"
      },
      //总体
      level: null,
      //口味
      mlevel: null,
      //环境
      slevel: null,
      //服务
      rlevel: null,
      //评论的内容
      content: "",
      //图片
      image: "",
      //餐厅印象
      impressions: "",
      //人均消费
      percapita: ""
    };
  },
  methods: {
    add_img(event) {
      let reader = new FileReader();
      let img1 = event.target.files[0];
      let type = img1.type; //文件的类型，判断是否是图片
      let size = img1.size; //文件的大小，判断图片的大小
      if (this.imgData.accept.indexOf(type) == -1) {
        alert("请选择我们支持的图片格式！");
        return false;
      }
      if (size > 3145728) {
        alert("请选择3M以内的图片！");
        return false;
      }
      var uri = "";
      let form = new FormData();
      form.append("myfile", img1, img1.name);

      api.uploadImg(form).then(res => {});
      // this.$http.post('/file/upload',form,{
      //     headers:{'Content-Type':'multipart/form-data'}
      // }).then(response => {
      //     console.log(response.data)
      //     uri = response.data.url
      //     reader.readAsDataURL(img1);
      //     var that=this;
      //     reader.onloadend=function(){
      //         that.imgs.push(uri);
      //     }
      // }).catch(error => {
      //     alert('上传图片出错！');
      // })
    },

    onSubmit() {
      // const fd = new FormData();
      // fd.append("myfile", this.imgurlObj);
      // console.log(fd);
      // api.uploadImg(fd).then(res => {
      //     console.log(res);
      // });
      // console.log(this.image);
      if (!this.level && !this.mlevel && !this.slevel && !this.rlevel) {
        Toast({
          mask: false,
          message: "请选择您的满意度",
          duration: 800
        });
        return;
      }
      if (!this.content) {
        Toast({
          mask: false,
          message: "说点什么吧...",
          duration: 800
        });
        return;
      }
      if (!this.image) {
        this.image = null;
      }
      if (!this.percapita) {
        Toast({
          mask: false,
          message: "请输入你认为的人均消费情况",
          duration: 800
        });
        return;
      }
      var CommentUntll = {
        //总体
        level: this.level,
        //口味
        mlevel: this.mlevel,
        //环境
        slevel: this.slevel,
        //服务
        rlevel: this.rlevel,
        //评论的内容
        content: this.content,
        //图片
        image: this.image,
        //餐厅印象
        impressions: "有儿童椅",
        //人均消费
        percapita: this.percapita,
        shopId: localStorage.getItem("shopId")
      };
      console.log(CommentUntll);
      api.uploadComment(CommentUntll).then(res => {
        if (res.code == 200 && res.msg == "添加成功！") {
          Toast({
            mask: false,
            message: "评价成功",
            duration: 800
          });
          this.$router.push({
            path: "/payment/food"
          });
        }
      });
    },
    onRead(file) {
      var obj = file.file;
      let reader = new FileReader();
      //  let img1= this.$refs.fileInput.queerySelector('input').files[0];
      // let img1= this.$refs.fileInput.queerySelector('input')
      var img1 = document.querySelector(".van-uploader__input").files[0];
      //   console.log(img1.files);
      //  let type=img1.type;//文件的类型，判断是否是图片
      // let size=img1.size;//文件的大小，判断图片的大小
      let type = img1.type; //文件的类型，判断是否是图片
      let size = img1.size; //文件的大小，判断图片的大小
      if (this.imgData.accept.indexOf(type) == -1) {
        alert("请选择我们支持的图片格式！");
        return false;
      }
      if (size > 3145728) {
        alert("请选择3M以内的图片！");
        return false;
      }
      var uri = "";

      let form = new FormData();
      form.append("myfile", img1, img1.name);
      console.log(form);
      api.uploadImg(form).then(res => {
        if (res.code == 200 && res.data) {
          this.image += res.data[0] + ",";
          var add = this.$refs.add;
          var li = document.createElement("li");
          li.style.float = "left";
          var img = document.createElement("img");
          img.src = res.data[0];
          var width = parseInt(add.offsetWidth);
          var height = parseInt(add.offsetHeight);
          img.style.width = width + "px";
          img.style.height = height + "px";
          img.style.marginRight = 5 + "px";
          img.style.marginBottom = 5 + "px";
          li.appendChild(img);
          var parent = add.parentNode;
          parent.insertBefore(li, add);
        }
      });

      // this.imgurlObj.push(obj);

      if (this.imgurlObj.length > 5) {
        this.$refs.add.style.display = "none";
        Toast({
          mask: false,
          message: "最多只可添加6张了",
          duration: 800
        });
        return;
      }
    },
    change(params) {
      console.log(params);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/style/px-to-rem";
#wait {
  background-color: #fff !important;
}

.comment {
  position: relative;
  height: 100%;
  background-color: #fff;
  width: 100%;
  padding-bottom: tr(40px);
  .bg {
    width: 100%;
    background-color: #f7f7f7;
  }
  .main {
    //   margin-top: tr(20px);
    width: 100%;
    padding: tr(40px) tr(40px) 0 tr(40px);
    background-color: #fff;
    margin-bottom: tr(20px);
    .score {
      border-bottom: 1px solid #ededed;
      width: 100%;
      ul {
        width: 100%;
        overflow: hidden;
        padding-bottom: tr(30px);
        li {
          float: left;
          height: tr(32px);
          font-family: "PingFangSC-Regular";
          font-size: tr(28px);
          line-height: tr(32px);
        }
        li:nth-child(1) {
          padding-right: tr(40px);
          color: #666;
        }
        li:nth-child(2) {
          > div {
            height: 100% !important;
          }
        }
        .how {
          float: right;
          color: #999;
          font-size: tr(24px);
        }
      }
      ul:nth-child(1) {
        li:nth-child(1) {
          color: #1a1a1a;
        }
      }
    }
    textarea {
      margin-top: tr(30px);
      height: tr(140px);
      width: 100%;
    }
    .upload {
      padding-bottom: tr(30px);
      border-bottom: 1px solid #ededed;
      ul {
        width: 100%;
        overflow: hidden;
        li {
          float: left;
          width: 22.8%;
          img {
            width: 100%;
            // height: tr(140px);
          }
        }
      }
      p {
        display: inline-block;
        width: 22.8%;
        text-align: center;
        color: #999;
        margin-top: tr(20px);
      }
    }
  }
  footer {
    background-color: #fff;
    width: 100%;
    padding: tr(30px);
    margin-bottom: tr(30px);
    p {
      font-family: "PingFangSC-Regular";
      font-size: tr(28px);
      font-style: oblique;
      font-weight: bold;
      margin-bottom: tr(30px);
    }
    span {
      display: inline-block;
      padding: tr(10px) tr(20px);
      color: #999;
      border: 1px solid #ccc;
      border-radius: 10px;
      margin-right: tr(20px);
    }
  }
  .price {
    background-color: #fff;
    padding: tr(30px);
    width: 100%;
    height: tr(120px);

    div {
      float: left;
    }
    div:nth-child(1) {
      line-height: tr(60px);
      font-family: "PingFangSC-Regular";
      font-style: oblique;
      font-weight: bold;
    }
    div:nth-child(2) {
      width: 50%;
      margin: 0 tr(30px);
      border: 1px solid #ccc;
      border-radius: tr(8px);
      overflow: hidden;

      input {
        border: none;
        width: 100%;
        height: tr(60px);
        padding-left: tr(20px);
      }
    }
    div:nth-child(3) {
      line-height: tr(60px);
      color: #8346fd;
    }
  }
  .submit {
    position: fixed;
    bottom: tr(20px);
    left: 10%;
    text-align: center;
    margin: 0 auto;
    height: tr(90px);
    width: 80%;
    button {
      width: 100%;
      height: 100%;
      background-color: #fff;
      border: none;
      border: 1px solid #ccc;
      border-radius: 30px;
      font-size: tr(28px);
      font-weight: bold;
      font-style: oblique;
      background: linear-gradient(270deg, rgb(233, 68, 180), rgb(79, 72, 179));
      color: #fff;
    }
  }
}
</style>

