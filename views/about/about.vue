<template>
  <div>
      关于页面
      <div @click="getAge">
        age:{{vuexStore}}
      </div>
      <div>
        doubleAge:{{doubleAge}}
      </div>
      <div>
        appName:{{appName}}
      </div>
      <div>
        adminName:{{adminName}}
      </div>
      <!-- <div>
        <h3>自定义组件</h3>
        <div>
          <p>left:{{message.left}}</p> 
          <p>top:{{message.top}}</p>
        </div>
         <div v-drag="message" class="abc">我可以拖拽</div>
      </div>
      <div class="kongjian">
        <ul>
          <li>
            <div v-drag="message" class="abc">我可以拖拽</div>
          </li>>
        </ul>
      </div> -->
      <!-- <div class="jiemian">

      </div> -->
      <div>
        <el-upload
          class="upload-demo"
          ref="upload"
          action="http://192.168.11.51:6001/gateway/app/content-aggr/content/addResource"
          :on-change="onchangeFunc"
          :before-upload="beforeUploadFunc"
          :multiple="bool"
          :headers="header"
          :data="datas"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </div>
      <div>
        <form action="http://192.168.11.51:6001/gateway/app/content-aggr/content/addResource" method="post" enctype="multipart/form-data">
          <input name="file" type="file" value="111">
          <!-- <input name="file" type="file" value="222"> -->
          <button type="submit">提交按钮</button>
        </form>
      </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      vuexStore: this.$store.state.user_module.age,
      doubleAge: this.$store.getters.doubleAge,
      appName: this.$store.getters.getName,
      adminName: this.$store.getters.getAdmin,
      bool:true,
      message: {
        left: 25,
        top: 22
      },
      header:{
        'Authorization': 'Bearer ' + sessionStorage.getItem('session_accessToken'),
        'userId': sessionStorage.getItem('session_userId')
      },
      datas:{
        // files: files,
        ivFormat: 'image/jpeg',
        ivHeight: '1000',
        ivName: '1111',
        ivSize: '11111',
        ivWidth: '2222',
      },
      fileList: []
      // [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
    }
  },
  methods:{
    getAge(){
      console.log(this.$store.getters.doubleAge);
    },
    submitUpload() {
      console.log('submitUpload');
        this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    onchangeFunc(file, fileList){
      console.log('filelist');
      // var ff=[]
      // for(var i=0,len=fileList.length;i<len;i++){
      //   fileList[i].data={ivSize:i}
      //   ff.push(fileList[i])
      // }
      this.fileList=fileList;
    },
    beforeUploadFunc(file){
      console.log('beforeUploadFunc')
    },
  }
}
</script>
<style scoped>
.abc{
  border: 2px solid #ccc;
  position: absolute;
}
.kongjian{
  width: 100px;
  height: 600px;
  float: left;
  margin: 10px;
   border: 1px solid #f00;
}
.jiemian{
  width: 500px;
  height: 600px;
  border: 1px solid #f00;
  position: relative;
  float: left;
}
</style>

