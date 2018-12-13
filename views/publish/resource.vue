<template>
    <div>
        <div class="f-header">
            <el-row>
                <el-col :span="6">
                <label>资源名称：</label>
                <el-input clearable placeholder="请输入查询内容" size="small" v-model="resourceName"></el-input>
                </el-col>
                <el-col :span="6">
                <label>资源类型：</label>
                <el-select clearable v-model="selectResourceValue" placeholder="请选择资源类型" size="small" @change="selectFunc">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                </el-col>
                <el-col :span="8">
                <label>创建时间：</label>
                <el-date-picker v-model="createTimeValue" type="daterange" range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" value-format="yyyy-MM-dd" size="small">
                </el-date-picker>
                </el-col>
                <el-col :span="4">
                <el-button type="primary" round size="small" @click="queryResourseFunc()">查询</el-button>
                <el-button round size="small" @click="resetFunc">重置</el-button>
                </el-col>
            </el-row>
            <el-row class="btnBox">
                <el-col :span="4">
                <!-- <div class=""> -->
                <el-button type="primary" round size="small" @click="addFunc()">添加</el-button>
                <el-button type="danger" round size="small" @click="batchRemoveFunc()">批量删除</el-button>
                <!-- </div> -->
                </el-col>
            </el-row>
        </div>
        <div class="f-contain">
            <el-table ref="multipleTable" :data="tableData_resource" tooltip-effect="dark" style="width: 100%" stripe border
                size="mini" highlight-current-row @selection-change="selectionChangeFunc">
                <el-table-column type="selection" width="35">
                </el-table-column>
                <el-table-column label="序号" type="index" width="50">
                </el-table-column>
                <el-table-column label="资源编号" prop="resourceId">
                </el-table-column>
                <el-table-column label="资源名称" prop="resourceName" width="150">
                </el-table-column>
                <el-table-column label="资源类型" prop="resourceType" :formatter="format_resourceType" width="80">
                </el-table-column>
                <el-table-column prop="duration" label="视频时长" :formatter="format_duration" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="creatorName" label="创建人" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="address" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="reviseRowFunc(scope.$index, scope)" type="text" size="small">
                    修改
                    </el-button>
                    <el-button @click.native.prevent="deleteRowFunc(scope.$index, scope)" type="text" size="small" class="btnDel">
                    删除
                    </el-button>
                </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px">
            <div class="block">
            <el-pagination @size-change="pageSizeChangeFunc" @current-change="pageChangeFunc" :current-page="page.current"
                :page-sizes="[20, 50, 100, 200]" :page-size="page.size" layout="total, sizes, prev, pager, next, jumper"
                :total="page.total">
            </el-pagination>
            </div>
        </div>
        </div>

        <el-dialog :title=" dialog_isAdd ? '新增资源信息' : '修改资源信息' " :visible.sync="dialogFormVisible" @close="dialogFormVisibleClose"
        width="620px">
            <div class="m_dialogHead">
                <ul class="m_tabBox" v-show="dialog_isAdd">
                <li @click="tagFunc(1)" :class="{cur:tagNumber==1}">公告</li>
                <li @click="tagFunc(2)" :class="{cur:tagNumber==2}">图片</li>
                <li @click="tagFunc(3)" :class="{cur:tagNumber==3}">视频</li>
                </ul>
                <div v-show="!dialog_isAdd" class="headBox">
                <label>资源类型:</label>
                <span v-show="tagNumber==1">公告</span>
                <span v-show="tagNumber==2">图片</span>
                <span v-show="tagNumber==3">视频</span>
                </div>
            </div>

            <div class="m_dialogMain">
                <div class="box" v-show="tagNumber==1">
                <el-form :model="formData_notice" :rules="rules" size="small" ref="ref_form1">
                    <el-form-item label="公告标题:" prop="title" :label-width="formLabelWidth">
                    <el-input @blur="if_liandong_title_blur" maxlength="20" v-model="formData_notice.title" placeholder="请输入公告标题"></el-input>
                    <span class="m_form_rightInfo">{{formData_notice.title.trim().length}}/20</span>
                    </el-form-item>
                    <el-form-item label="资源名称:" prop="name" :label-width="formLabelWidth">
                    <el-input @focus="if_liandong_name_blur" maxlength="20" v-model="formData_notice.name" placeholder="请输入资源名称"></el-input>
                    <span class="m_form_rightInfo">{{formData_notice.name.trim().length}}/20</span>
                    </el-form-item>
                    <el-form-item label="公告内容:" prop="textarea" :label-width="formLabelWidth">
                    <el-input maxlength="1000" type="textarea" v-model="formData_notice.textarea" placeholder="请在此输入公告内容"></el-input>
                    <span class="m_form_rightInfo">{{formData_notice.textarea.trim().length}}/1000</span>
                    </el-form-item>
                    <el-form-item label="公告署名:" prop="writer" :label-width="formLabelWidth">
                    <el-input maxlength="20" v-model="formData_notice.writer" placeholder="请署名"></el-input>
                    <span class="m_form_rightInfo">{{formData_notice.writer.trim().length}}/20</span>
                    </el-form-item>
                    <el-form-item label="发布日期:" prop="date" :label-width="formLabelWidth">
                    <!-- <el-input v-model="formData_notice.date" placeholder="请填写发布日期"></el-input> -->
                    <el-date-picker v-model="formData_notice.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                    </el-form-item>
                </el-form>
                </div>

                <div class="box" v-show="tagNumber==2 && dialog_isAdd">
                <h4>
                    图片内容：
                </h4>
                <ul class="m_listBox">
                    <li v-for="(item,$index) in fileList_pic" :key="item.name" @mouseover="show_delete=$index" @mouseout="show_delete=null">
                    <dl>
                        <dt>
                        <img class="media" :src="item.url" alt="">
                        </dt>
                        <dd>
                        资源名称：
                        </dd>
                        <dd>
                        <el-input maxlength="20" class="pic_name" size="small" style="width:280px;" placeholder="请输入资源名称"
                            :value="item.name.split('.')[0]"></el-input>
                        </dd>
                        <dd>
                        <span>分辨率：<em class="fbl_pic"></em></span>
                        </dd>
                        <dd v-if="show_delete==$index" class="delete" @click="deletePicFunc($index)">删除</dd>
                    </dl>
                    </li>
                    <li>
                    <dl>
                        <el-upload class="avatar-uploader" action="" ref="ref_uploadPic" :show-file-list="false" :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload" :on-change="uploadChange_picFunc" :on-remove="remove_uploadChange_picFunc"
                        :auto-upload="false">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </dl>
                    </li>
                </ul>
                </div>
                <div class="box" v-show="tagNumber==3 && dialog_isAdd">
                <h4>
                    视频内容：
                </h4>
                <ul class="m_listBox">
                    <li v-for="(item,$index) in fileList_video" :key="item.name" @mouseover="show_delete=$index" @mouseout="show_delete=null">
                    <dl>
                        <dt>
                        <video class="media" :src="item.url"></video>
                        </dt>
                        <dd>
                        资源名称：
                        </dd>
                        <dd>
                        <el-input maxlength="20" class="video_name" size="small" style="width:280px;" placeholder="请输入资源名称"
                            :value="item.name.split('.')[0].substr(0,20)"></el-input>
                        </dd>
                        <dd>
                        <span>视频时长：<em>{{item.durationText}}</em></span>
                        <span>分辨率：<em>{{item.width}}</em>X<em>{{item.height}}</em></span>
                        </dd>
                        <dd v-if="show_delete==$index" class="delete" @click="deleteVideoFunc($index)">删除</dd>
                    </dl>
                    </li>

                    <li>
                    <dl>
                        <el-upload class="avatar-uploader" action="" ref="ref_uploadVideo" :show-file-list="false" :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUploadVideo" :on-change="uploadChange_videoFunc" :auto-upload="false">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </dl>
                    </li>
                </ul>
                </div>
                <div class="box" v-show="tagNumber==2 && !dialog_isAdd">
                <el-form :model="formData_pic" ref="ref_pic" :rules="rules_revise" size="small">
                    <el-form-item label="资源名称:" prop="name" :label-width="formLabelWidth">
                    <el-input maxlength="20" v-model="formData_pic.name" placeholder="请输入资源名称"></el-input>
                    </el-form-item>
                    <div class="headBox">
                    <label><i class="i_star">*</i> 资源内容:</label>
                    <span><img class="revise_pic_class" :src="formData_pic.url" width="200" height="150" /></span>
                    <el-upload action="" ref="upload" :show-file-list="false" :on-change="uploadChange_revise_picFunc"
                        :auto-upload="false" style="display:inline-block;float: right;margin-top: 60px;">
                        <el-button slot="trigger" size="small">更改图片</el-button>
                    </el-upload>
                    </div>
                    <div class="headBox">
                    <label>分辨率:</label>
                    <span><em class="revise_pic_widthClass" v-text="formData_pic.width"></em>x<em class="revise_pic_heightClass"
                        v-text="formData_pic.height"></em></span>
                    </div>
                </el-form>
                </div>
                <div class="box" v-show="tagNumber==3 && !dialog_isAdd">
                <el-form :model="formData_video" ref="ref_video" :rules="rules_revise" size="small">
                    <el-form-item label="资源名称:" prop="name" :label-width="formLabelWidth">
                    <el-input maxlength="20" v-model="formData_video.name" placeholder="请输入资源名称"></el-input>
                    </el-form-item>
                    <div class="headBox" style="line-height:150px;">
                    <label style="vertical-align:middle;"><i class="i_star">*</i> 资源内容:</label>
                    <span style="vertical-align:middle;"><video style="vertical-align:middle;" controls="controls" :src="formData_video.url"
                        width="200" height="150" /></span>
                    <el-upload action="" ref="upload" :show-file-list="false" :on-change="uploadChange_revise_videoFunc"
                        :auto-upload="false" style="display:inline-block;float:right;">
                        <el-button slot="trigger" size="small">更改视频</el-button>
                    </el-upload>
                    </div>
                    <div class="headBox">
                    <label>视频时长:</label>
                    <span v-text="formData_video.durationText"></span>
                    </div>
                    <div class="headBox">
                    <label>分辨率:</label>
                    <span><em v-text="formData_video.width"></em>x<em v-text="formData_video.height"></em></span>
                    </div>
                </el-form>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div v-show="tagNumber==1 && dialog_isAdd">
                <el-button round size="small" @click="previewFunc()">预览</el-button>
                <el-button type="primary" round size="small" :disabled="saveBtn_disabled" @click="add_saveFunc(type=3,true)">保存并继续</el-button>
                <el-button type="primary" round size="small" :disabled="saveBtn_disabled" @click="add_saveFunc(type=3,false)">保存并退出</el-button>
                <el-button type="danger" round size="small" @click="clearFunc('ref_form1')">清空</el-button>
                </div>
                <div v-show="tagNumber==1 && !dialog_isAdd">
                <el-button round size="small" @click="previewFunc()">预览</el-button>
                <el-button type="primary" round size="small" @click="revise_saveFunc(type=3)">保存</el-button>
                <el-button type="danger" round size="small" @click="closeFunc">关闭</el-button>
                </div>
                <div v-show="tagNumber==2&& dialog_isAdd">
                <el-button type="primary" round size="small" :disabled="saveBtn_disabled" @click="add_saveFunc(type=2,false)">保存</el-button>
                <el-button type="danger" round size="small" @click="closeFunc">关闭</el-button>
                </div>
                <div v-show="tagNumber==2 && !dialog_isAdd">
                <el-button type="primary" round size="small" @click="revise_saveFunc(type=2)">保存</el-button>
                <el-button type="danger" round size="small" @click="closeFunc">关闭</el-button>
                </div>
                <div v-show="tagNumber==3 && dialog_isAdd">
                <el-button type="primary" round size="small" :disabled="saveBtn_disabled" @click="add_saveFunc(type=1,false)">保存</el-button>
                <el-button type="danger" round size="small" @click="closeFunc">关闭</el-button>
                </div>
                <div v-show="tagNumber==3 && !dialog_isAdd">
                <el-button type="primary" round size="small" @click="revise_saveFunc(type=1)">保存</el-button>
                <el-button type="danger" round size="small" @click="closeFunc">关闭</el-button>
                </div>

            </div>

            <el-dialog width="620px" title="公告详情" :visible.sync="innerVisible" append-to-body>
                <div class="m_dialogDetail">
                <h3>{{formData_notice.title}}</h3>
                <div>
                    <p>
                    {{formData_notice.textarea}}
                    </p>
                </div>
                <div class="writer">署名：<span>{{formData_notice.writer}}</span></div>
                <div class="date">发布日期：<span>{{formData_notice.date}}</span></div>
                </div>
                <div slot="footer" class="dialog-footer">
                </div>
            </el-dialog>
        </el-dialog>

    </div>
</template>
<style lang="scss" scoped>
  .m_dialogHead {
    ul {
      margin: 20px;
    }
  }

  .fbl_pic {
    font-style: normal;
  }

  .headBox {
    margin: 20px 0px 20px 39px;

    label {
      margin-right: 10px;
      width: 100px;
      display: inline-block;
      text-align: right;
    }
  }

  .box .headBox {
    margin: 20px 0px 20px -14px;
  }

  .m_dialogMain {
    max-height: 500px;
    overflow-y: auto;

    .el-form {
      margin: 20px 70px 30px 40px;
    }

    .box {
      margin: 10px;
        img{
            transition: all .3s;
        }
        img:hover{
            filter: contrast(110%);
            transform: scale(1.1);
        }
      dl {
        overflow: hidden;
        margin: 9px 10px;
        position: relative;
      }

      dt {
        margin-right: 10px;
        float: left;
      }

      dt .media {
        width: 150px;
        height: 112px;
        display: inline-block;
        background: #ccc;
        transition: all 0.3s;
        -webkit-transition: all 0.3s;
      }

      // dt .media:hover{
      //   transform: scale(1.1);
      //   filter: contrast(130%);
      // }
      dd {
        height: 40px;
        line-height: 40px;

        span {
          width: 150px;
          display: inline-block;
        }
      }

      dd.delete {
        position: absolute;
        right: 0;
        top: 50%;
        color: #e44343;
        transform: translateY(-20px);
        cursor: pointer;
      }
    }

    h4 {
      font-size: 18px;
      line-height: 25px;
      margin-bottom: 10px;
    }

    .m_listBox {
      li {
        height: 130px;
        border: 1px dotted #ccc;
        margin-bottom: 20px;
      }
    }
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 112px;
    line-height: 112px;
    text-align: center;
    cursor: pointer;
  }

  .avatar {
    width: 150px;
    height: 112px;
    display: block;
  }

  .m_dialogDetail {
    padding: 10px 50px;

    h3 {
      line-height: 60px;
      text-align: center;
      height: 60px;
      border-bottom: 1px solid #ccc;
      font-size: 22px;
      margin-bottom: 30px;
    }

    p {
      line-height: 30px;
      text-indent: 2em;
      margin: 10px auto;
      word-break: break-all;
    }

    span {
      width: 120px;
      display: inline-block;
      text-align: left;
    }

    .writer {
      text-align: right;
      margin: 50px 0 0 0;
    }

    .date {
      text-align: right;
      margin: 10px 0 50px 0;
    }
  }

  .el-dialog__body {
    max-height: 900px;
  }

  .m_form_rightInfo {
    left: 320px;
    right: auto;
  }

</style>

<script>
  // window.win_oncanplaythroughGetTimeFunc=function (ele) {
  //   var hour = parseInt((ele.duration) / 3600);
  //   var minute = parseInt((ele.duration % 3600) / 60);
  //   var second = Math.ceil(ele.duration % 60);
  //   document.getElementById("getDuration").innerHTML = "这段视频的时长为：" + hour + "小时，" + minute + "分，" + second + "秒";
  //   console.log('shijian');
  // }
  import axios from "axios";
  export default {
    data() {
      return {
        fileList: [{
            name: "food.jpeg",
            url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
          },
          {
            name: "food2.jpeg",
            url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
          }
        ],
        options: [{
            value: "3",
            label: "公告"
          },
          {
            value: "2",
            label: "图片"
          },
          {
            value: "1",
            label: "视频"
          }
        ],
        selectResourceValue: "",
        createTimeValue: "",
        tableData_resource: [],
        multipleSelection: [],
        page: {
          current: 1,
          size: 20,
          total: 0
        },
        dialogFormVisible: false,
        innerVisible: false,
        form: {
          name: "",
          region: "",
          date1: "",
          date2: "",
          delivery: false,
          type: [],
          resource: "",
          desc: ""
        },
        formLabelWidth: "100px",
        activeName: "second",
        tagNumber: 1,
        formData_notice: {
          name: "",
          title: "",
          textarea: "",
          writer: "",
          date: ""
        },
        formData_pic: {
          name: "",
          url: "",
          width: "",
          height: "",
          file: null,
          format: null,
          size: null
        },
        formData_video: {
          name: "",
          url: "",
          width: "",
          height: "",
          duration: ""
        },
        rules: {
          name: [{
            required: true,
            message: "请输入资源名称",
            trigger: "blur"
          }],
          title: [{
            required: true,
            message: "请输入公告标题",
            trigger: "blur"
          }],
          textarea: [{
            required: true,
            message: "请输入公告内容",
            trigger: "blur"
          }],
          writer: [{
            required: true,
            message: "请输入公告署名",
            trigger: "blur"
          }],
          date: [{
            required: true,
            message: "请选择日期时间",
            trigger: "blur"
          }]
        },
        rules_revise: {
          name: [{
            required: true,
            message: "请输入资源名称",
            trigger: "blur"
          }]
        },
        imageUrl: "",
        dialog_isAdd: null,
        fileList_pic: [],
        filesData_video: [],
        filesData_pic: [],
        fileList_video: [],
        resourceType: "",
        resourceName: "",
        revise_data: null,
        show_delete: null,
        saveBtn_disabled: false,

        if_liandong_biaoti_mingcheng: true //公告标题录入成功，资源名称自动获取。
      };
    },
    methods: {
      format_resourceType(row, column, cellValue, index) {
        if (cellValue == 1) {
          //
          return "视频";
        } else if (cellValue == 2) {
          return "图片";
        } else {
          return "公告";
        }
      },
      format_duration(row, column, cellValue, index) {
        // debugger;
        if (row.resourceType == 1) {
          return Math.floor(cellValue / 60) + "分" + (cellValue % 60) + "秒";
        } else {
          return "-";
        }
      },
      dialogFormVisibleClose() {
        console.log("dialogFormVisibleClose");
        this.$refs.ref_form1.resetFields();
        this.$refs.ref_pic.resetFields();
        this.$refs.ref_video.resetFields();
      },
      deletePicFunc(index) {
        console.log(index);
        this.fileList_pic.splice(index, 1);
        this.filesData_pic.splice(index, 1);
        this.remove_uploadChange_picFunc();
      },
      deleteVideoFunc(index) {
        console.log(index);
        this.fileList_video.splice(index, 1);
        this.filesData_video.splice(index, 1);
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      resetFunc() {
        this.resourceName = "";
        this.selectResourceValue = "";
        this.resourceType = "";
        this.createTimeValue = "";
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      selectionChangeFunc(val) {
        this.multipleSelection = val;
      },
      reviseRowFunc(index, data) {
        this.formData_pic.url = "";
        this.if_liandong_biaoti_mingcheng = false;
        console.log(index);
        console.log(data);
        var id = data.row.resourceId;
        this.revise_data = data;
        var type = data.row.resourceType;
        type == "3" ?
          (this.tagNumber = 1) :
          type == "2" ?
          (this.tagNumber = 2) :
          (this.tagNumber = 3);

        this.dialog_isAdd = false;
        this.dialogFormVisible = true;
        var data = {
          id: id
        };
        this.http_reviseRowFunc(data, type);
      },
      http_reviseRowFunc(data, type) {
        var _this = this;
        this.$get("/app/content-aggr/content/queryResourceById", data)
          .then(function (response) {
            if (response.data.code == 0) {
              console.log(response);

              var data = response.data.data;
              var resource = data.resource;
              var resourceAnnouncement = data.resourceAnnouncement;
              var resourceImage = data.resourceImage;
              var resourceVideo = data.resourceVideo;
              if (resourceAnnouncement) {
                // debugger;
                _this.formData_notice.title = resourceAnnouncement.title;
                _this.formData_notice.name = resource.resourceName;
                _this.formData_notice.textarea = resourceAnnouncement.content;
                _this.formData_notice.writer = resourceAnnouncement.sign;
                _this.formData_notice.date = resourceAnnouncement.releaseDate;
                _this.formData_notice.resourceId =
                  resourceAnnouncement.resourceId;
                _this.formData_notice.resourceObjectId = resourceAnnouncement.id;
              }

              if (resourceImage) {
                // debugger;
                _this.formData_pic.name = resource.resourceName;
                _this.formData_pic.url =
                  _this.$store.getters.getFilePath + resource.resourcePath;
                _this.formData_pic.width = resourceImage.imageWidth;
                _this.formData_pic.height = resourceImage.imageHeight;
                _this.formData_pic.resourceId = resourceImage.resourceId;
                _this.formData_pic.resourceObjectId = resourceImage.id;
                _this.formData_pic.creatorId = resource.creatorId;
                _this.formData_pic.orgId = resource.orgId;
                _this.formData_pic.creatorName = resource.creatorName;
                _this.formData_pic.orgName = resource.orgName;
              }
              if (resourceVideo) {
                // debugger;
                _this.formData_video.name = resource.resourceName;
                // _this.formData_video.url=_this.$store.getters.getFilePath+resource.resourcePath;
                _this.formData_video.width = resourceVideo.videoWidth;
                _this.formData_video.height = resourceVideo.videoHeight;
                _this.formData_video.duration = resourceVideo.duration;
                _this.formData_video.durationText =
                  Math.floor(resourceVideo.duration / 60) +
                  "分" +
                  (resourceVideo.duration % 60) +
                  "秒";
                _this.formData_video.resourceId = resourceVideo.resourceId;
                _this.formData_video.resourceObjectId = resourceVideo.id;
                var ddd = {
                  fileId: resource.resourcePath
                };
                _this.http_queryVideoPath(ddd); //返回视频URL；
              }
            } else {
              _this.$message({
                type: "info",
                message: response.data.msg
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      http_queryVideoPath(data) {
        var _this = this;
        this.$get("/file/queryVideoPath", data).then(response => {
          debugger;
          if (response.data.code == 0) {
            _this.formData_video.url = response.data.data;
          } else {
            _this.$message({
              type: "info",
              message: response.data.msg
            });
          }
        });
      },
      deleteRowFunc(index, data) {
        var id = data.row.resourceId,
          ids = [];
        ids.push(id);
        this.http_deleteResourceFunc(ids);
        // this.tableData_resource.splice(index,1);
      },
      addFunc() {
        console.log("addFunc");
        var _this = this;
        this.dialog_isAdd = true;
        this.dialogFormVisible = true;
        this.tagNumber = 1;
        this.if_liandong_biaoti_mingcheng = true;
        debugger;
        setTimeout(() => {
          //延迟处理，等弹窗渲染完成；
          debugger;
          _this.$refs["ref_form1"].resetFields();
          _this.fileList_pic = [];
          _this.fileList_video = [];
          _this.filesData_pic = [];
          _this.filesData_video = [];
          _this.$refs.ref_uploadPic.clearFiles();
          _this.$refs.ref_uploadVideo.clearFiles();
        }, 100);
      },
      closeFunc() {
        console.log("closeFunc");
        this.dialogFormVisible = false;
      },
      batchRemoveFunc() {
        console.log(this.multipleSelection);
        var ids = [],
          select = this.multipleSelection;
        for (let i = 0; i < select.length; i++) {
          ids.push(this.multipleSelection[i].resourceId);
        }
        this.http_deleteResourceFunc(ids);
      },
      pageSizeChangeFunc(val) {
        console.log(`每页 ${val} 条`);
        this.page.size = val;
        var createTime = this.createTimeValue,
          data = {
            pageNum: this.page.current,
            pageSize: this.page.size,
            resourceType: this.resourceType,
            resourceName: this.resourceName,
            startTime: createTime ? createTime[0] : null,
            endTime: createTime ? createTime[1] : null
          };
        this.http_resourceTableFunc(data);
      },
      pageChangeFunc(val) {
        console.log(`当前页: ${val}`);
        this.page.current = val;
        var createTime = this.createTimeValue,
          data = {
            pageNum: this.page.current,
            pageSize: this.page.size,
            resourceType: this.resourceType,
            resourceName: this.resourceName,
            startTime: createTime ? createTime[0] : null,
            endTime: createTime ? createTime[1] : null
          };
        this.http_resourceTableFunc(data);
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      tagFunc(number) {
        this.tagNumber = number;
        console.log(number);
      },
      if_liandong_title_blur() {
        this.if_liandong_Func();
      },
      if_liandong_name_blur() {
        this.if_liandong_biaoti_mingcheng = false;
      },
      if_liandong_Func() {
        console.log(1221);
        if (this.if_liandong_biaoti_mingcheng) {
          this.formData_notice.name = this.formData_notice.title;
        }
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        console.log(file);
      },
      beforeAvatarUpload(file) {
        console.log("beforeAvatarUpload");
        const isJPG = file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isJPG && isLt2M;
      },
      beforeAvatarUploadVideo(file) {
        console.log(file);
        return file;
      },
      clearFunc(refName) {
        console.log(refName);
        this.$refs[refName].resetFields();
        this.if_liandong_biaoti_mingcheng = true;
      },
      add_saveFunc(type, bool) {
        this.saveBtn_disabled = true;
        debugger;
        console.log(this.formData_notice.date);
        console.log(this.$refs["ref_form1"]);

        var formData = new FormData();
        if (type == 3) {
          var txtObj = this.formData_notice;
          // var data={
          //   content: txtObj.textarea,
          //   creatorId: sessionStorage.getItem('session_userId'),
          //   orgId: sessionStorage.getItem('session_userId'),
          //   creatorName: sessionStorage.getItem('session_username'),
          //   orgName: sessionStorage.getItem('session_username'),
          //   releaseDate: txtObj.date,
          //   resourceName: txtObj.name,
          //   resourceType: type,
          //   sign: txtObj.writer,
          //   title: txtObj.title
          // }
          formData.append("content", txtObj.textarea);
          formData.append("releaseDate", txtObj.date);
          formData.append("resourceName", txtObj.name);
          formData.append("sign", txtObj.writer);
          formData.append("title", txtObj.title);
        }
        if (type == 2) {
          // var W=document.querySelectorAll('.fbl_pic')[0].innerHTML.split('X')[0].trim();
          // var H=document.querySelectorAll('.fbl_pic')[0].innerHTML.split('X')[1].trim();
          // var data={
          //   files: files,
          //   ivFormat: files[0].type,
          //   ivHeight: H,
          //   ivName: files[0].name,
          //   ivSize: files[0].size,
          //   ivWidth: W,
          // }

          var dom_pic = document.querySelectorAll(".fbl_pic");
          var pic_name = document.querySelectorAll(".pic_name");
          for (let i = 0, len = dom_pic.length; i < len; i++) {
            var validName = pic_name[i].children[0].value.trim();
            if (validName.length < 1) {
              this.$message({
                type: "info",
                message: "资源名称不可为空"
              });
              return fasle;
            }
            var W = dom_pic[i].innerHTML.split("X")[0].trim();
            var H = dom_pic[i].innerHTML.split("X")[1].trim();
            var name = pic_name[i].children[0].value;
            formData.append("ivHeight", H);
            formData.append("ivWidth", W);
            formData.append("ivName", name);
          }

          var files = this.filesData_pic;
          for (let j = 0; j < files.length; j++) {
            formData.append("files", files[j]);
            formData.append("ivSize", files[j].size);
            if (files[j].type.indexOf("image/") >= 0) {
              formData.append("ivFormat", files[j].type.split("image/")[1]);
            } else {
              formData.append("ivFormat", files[j].type);
            }
          }
        }
        if (type == 1) {
          debugger;
          var video_name = document.querySelectorAll(".video_name");

          var filesData = this.fileList_video;

          for (let k = 0; k < video_name.length; k++) {
            var name = video_name[k].children[0].value.trim();
            if (name.length < 1) {
              this.$message({
                type: "info",
                message: "资源名称不能为空"
              });
              return fasle;
            }
            formData.append("ivName", name);
          }

          for (let t = 0; t < filesData.length; t++) {
            formData.append("files", this.filesData_video[t].raw);
            formData.append("ivSize", filesData[t].size);
            formData.append("ivFormat", filesData[t].format);
            formData.append("ivWidth", filesData[t].width);
            formData.append("ivHeight", filesData[t].height);
            formData.append("duration", filesData[t].duration);
          }
        }

        formData.append("resourceType", type);
        formData.append("creatorId", sessionStorage.getItem("session_userId"));
        formData.append("orgId", sessionStorage.getItem("session_userId"));
        formData.append(
          "creatorName",
          sessionStorage.getItem("session_username")
        );
        formData.append("orgName", sessionStorage.getItem("session_username"));

        var data = formData;

        this.http_add_saveFunc(data, bool);
      },
      previewFunc() {
        this.innerVisible = true;
      },
      remove_uploadChange_picFunc(file, fileList) {
        debugger;
      },
      uploadChange_picFunc(file, fileList) {
        console.log(file);
        file.name = file.name.substr(0, 20); //字数不超过20；
        var obj = {
          name: file.name,
          url: file.url
        };
        this.fileList_pic.push(obj);
        // var aa = fileList.slice(-3);
        debugger;
        this.filesData_pic.push(file.raw);
      },
      uploadChange_videoFunc(file, fileList) {
        console.log(file);
        debugger;
        this.filesData_video = fileList;
        this.http_getVideoParamFunc(fileList);
      },
      // clearUploadedImage () {
      //   this.$refs.ref_uploadPic.clearFiles();
      // },
      uploadChange_revise_picFunc(file, fileList) {
        //更改图片
        var _this = this;
        console.log(file);

        this.formData_pic.file = file.raw;
        this.formData_pic.url = file.url;
        // this.formData_pic.name=file.name.split('.')[0];
        if (file.raw.type.indexOf("image/") >= 0) {
          debugger;
          this.formData_pic.format = file.raw.type.split("image/")[1];
        } else {
          this.formData_pic.format = file.raw.type;
        }

        this.formData_pic.size = file.raw.size;
        setTimeout(() => {
          //渲染完成，获取图片分辨率
          // debugger;
          var _obj = document.querySelector(".revise_pic_class");
          _this.formData_pic.width = _obj.naturalWidth;
          _this.formData_pic.height = _obj.naturalHeight;
        }, 200);
      },
      uploadChange_revise_videoFunc(file, fileList) {
        //更改视频
        console.log(file);
        this.formData_video.file = file.raw;
        this.formData_video.url = file.url;
        debugger;
        var files = [],
          file = file;
        file.name = this.formData_video.name;
        files.push(file);
        this.http_getVideoParamFunc(files);
      },

      http_getVideoParamFunc(fileList) {
        var len = fileList.length - 1;
        var file = fileList[len];
        var formdata = new FormData();
        formdata.append("file", file.raw);
        var _this = this;
        var obj = {
          name: file.name,
          url: file.url
        };

        this.$post("/app/content-aggr/content/getVideoParam", formdata)
          .then(function (response) {
            console.log(response);
            debugger;
            if (response.data.code === 0) {
              var duration = response.data.data.duration;
              if (_this.dialog_isAdd) {
                obj.duration = duration;
                obj.durationText =
                  Math.floor(duration / 60) + "分" + (duration % 60) + "秒";
                obj.width = response.data.data.videoWidth;
                obj.height = response.data.data.videoHeight;
                obj.size = response.data.data.videoSize;
                obj.format = response.data.data.videoFormat;

                _this.fileList_video.push(obj);
              } else {
                _this.formData_video.duration = duration;
                _this.formData_video.width = response.data.data.videoWidth;
                _this.formData_video.height = response.data.data.videoHeight;
                _this.formData_video.size = response.data.data.videoSize;
                _this.formData_video.format = response.data.data.videoFormat;
              }
            } else {
              _this.$message({
                type: "info",
                message: response.data.msg
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      selectFunc(val) {
        console.log(val);
        this.resourceType = val;
      },
      queryResourseFunc() {
        debugger;
        var createTime = this.createTimeValue,
          data = {
            pageNum: this.page.current,
            pageSize: this.page.size,
            resourceType: this.resourceType,
            resourceName: this.resourceName,
            startTime: createTime ? createTime[0] : null,
            endTime: createTime ? createTime[1] : null
          };
        this.http_resourceTableFunc(data);
      },
      revise_saveFunc(type) {
        debugger;
        var formdata = new FormData();
        if (type == 3) {
          this.$refs.ref_form1.validate(valid => {
            debugger;
            if (valid) {
              var data3 = this.formData_notice;

              formdata.append("content", data3.textarea);
              formdata.append("releaseDate", data3.date);
              formdata.append("resourceName", data3.name);
              formdata.append("sign", data3.writer);
              formdata.append("title", data3.title);

              formdata.append("resourceId", data3.resourceId);
              formdata.append("resourceObjectId", data3.resourceObjectId);
              formdata.append("resourceType", type);
              this.http_revise_saveFunc(formdata);
            } else {
              return false;
            }
          });
        }
        if (type == 2) {
          var data2 = this.formData_pic;

          formdata.append("resourceName", data2.name);
          if (data2.file) {
            formdata.append("files", data2.file);
            formdata.append("ivName", data2.name);
            formdata.append("ivWidth", data2.width);
            formdata.append("ivHeight", data2.height);
            formdata.append("ivFormat", data2.format);
            formdata.append("ivSize", data2.size);
            formdata.append("deleteFileIds", data2.resourceId);
          }

          formdata.append("resourceId", data2.resourceId);
          formdata.append("resourceObjectId", data2.resourceObjectId);

          formdata.append("creatorId", data2.creatorId);
          formdata.append("orgId", data2.orgId);
          formdata.append("creatorName", data2.creatorName);
          formdata.append("orgName", data2.orgName);

          formdata.append("resourceType", type);
          this.http_revise_saveFunc(formdata);
        }
        if (type == 1) {
          debugger;
          var data1 = this.formData_video;

          formdata.append("resourceName", data1.name);

          if (data1.file) {
            formdata.append("files", data1.file);
            formdata.append("ivName", data1.name);
            formdata.append("ivWidth", data1.width);
            formdata.append("ivHeight", data1.height);
            formdata.append("ivFormat", data1.format);
            formdata.append("ivSize", data1.size);
            formdata.append("duration", data1.duration);
            formdata.append("deleteFileIds", data1.resourceId);
          }

          formdata.append("resourceId", data1.resourceId);
          formdata.append("resourceObjectId", data1.resourceObjectId);

          formdata.append("creatorId", sessionStorage.getItem("session_userId"));
          formdata.append("orgId", sessionStorage.getItem("session_userId"));
          formdata.append(
            "creatorName",
            sessionStorage.getItem("session_username")
          );
          formdata.append("orgName", sessionStorage.getItem("session_username"));

          formdata.append("resourceType", type);
          this.http_revise_saveFunc(formdata);
        }
      },
      http_resourceTableFunc(data) {
        var _this = this;
        this.$get("/app/content-aggr/content/showResourcePage", data)
          .then(function (response) {
            console.log(response);
            if (response.data.code == 0) {
              _this.tableData_resource = response.data.data.records;
              _this.page.total = response.data.data.total;
            } else {
              _this.$message({
                type: "info",
                message: response.data.msg
              });
            }
            // debugger
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      http_getTypeChooseFunc() {
        var _this = this;
        this.$get("/app/content-aggr/content/getResourceTypeChooses", {})
          .then(function (response) {
            console.log(response);
            // debugger
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      http_deleteResourceFunc(ids) {
        var _this = this;
        // debugger;
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            this.$post("/app/content-aggr/content/deleteResources", {
                ids: ids
              })
              .then(function (response) {
                console.log(response);
                _this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                var createTime = _this.createTimeValue,
                  data = {
                    pageNum: _this.page.current,
                    pageSize: _this.page.size,
                    resourceType: _this.resourceType,
                    resourceName: _this.resourceName,
                    startTime: createTime ? createTime[0] : null,
                    endTime: createTime ? createTime[1] : null
                  };
                _this.http_resourceTableFunc(data);
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });

        // this.$post('/app/content-aggr/content/deleteResources',{
        //   ids:ids
        // })
        // .then(function (response) {
        //   console.log(response);
        //   var data={
        //     pageNum: 1,
        //     pageSize: 20
        //   }
        //   _this.http_resourceTableFunc(data);
        // })
        // .catch(function (error) {
        //   console.log(error);
        // });
      },
      http_add_saveFunc(data, bool) {
        var _this = this;
        debugger;
        this.$post("/app/content-aggr/content/saveOrUpdateResource", data)
          .then(function (response) {
            console.log(response);
            _this.saveBtn_disabled = false;
            if (response.data.code == 0) {
              if (bool) {
                //保存并继续
                // this.$refs['ref_form1'].resetFields();
              } else {
                //保存并关闭
                _this.dialogFormVisible = false;
              }
              _this.$message({
                message: "新增资源成功",
                type: "success"
              });
              _this.clearFunc("ref_form1");
              var createTime = _this.createTimeValue,
                data = {
                  pageNum: _this.page.current,
                  pageSize: _this.page.size,
                  resourceType: _this.resourceType,
                  resourceName: _this.resourceName,
                  startTime: createTime ? createTime[0] : null,
                  endTime: createTime ? createTime[1] : null
                };
              _this.http_resourceTableFunc(data);
            } else {
              _this.$message({
                message: response.data.msg,
                type: "info"
              });
            }
          })
          .catch(function (error) {
            _this.saveBtn_disabled = false;
            console.log(error);
          });
      },
      http_revise_saveFunc(data) {
        var _this = this;
        this.$post("/app/content-aggr/content/saveOrUpdateResource", data)
          .then(function (response) {
            if (response.data.code == 0) {
              console.log(response);
              _this.$message({
                message: "修改成功",
                type: "success"
              });
              _this.dialogFormVisible = false;
              var createTime = _this.createTimeValue,
                data = {
                  pageNum: _this.page.current,
                  pageSize: _this.page.size,
                  resourceType: _this.resourceType,
                  resourceName: _this.resourceName,
                  startTime: createTime ? createTime[0] : null,
                  endTime: createTime ? createTime[1] : null
                };
              _this.http_resourceTableFunc(data);
            } else {
              _this.$message({
                type: "info",
                message: response.data.msg
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    watch: {
      fileList_pic(val, oldVal) {
        var _val = val;
        setTimeout(() => {
          //渲染完成，获取图片分辨率
          debugger;
          if (_val.length > 0) {
            var _obj = document.querySelectorAll(".media")[_val.length - 1];
            var _fbl = document.querySelectorAll(".fbl_pic")[_val.length - 1];
            var W = _obj.naturalWidth;
            var H = _obj.naturalHeight;
            _fbl.innerHTML = W + " X " + H;
          }
        }, 200);
      }
    },

    created() {
      // debugger;
      var data = {
        pageNum: this.page.current,
        pageSize: this.page.size
      };
      this.http_resourceTableFunc(data);
      this.http_getTypeChooseFunc();
      if (this.$store.state.user_module.switchTo_resource_dialogOpen_notice) {
        //其它地方路由切换过来，记录打开弹窗；
        debugger;
        this.addFunc();
        this.$store.state.user_module.switchTo_resource_dialogOpen_notice = false;
      }
      if (this.$store.state.user_module.switchTo_resource_dialogOpen_media) {
        debugger;
        this.addFunc();
        this.tagFunc(2);

        this.$store.state.user_module.switchTo_resource_dialogOpen_media = false;
      }
    },
    updated() {}
  };

</script>
