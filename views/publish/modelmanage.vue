<template>
    <div>
        <div class="f-aside">
            <h2 class="header">
                模板列表
            </h2>
            <div class="box" v-for="object in data_all" :key="object.equipmentSize">
                <h3 class="header">
                    {{object.equipmentSize}}寸模版
                </h3>
                <ul v-for="equipmentsObj in object.equipments" :key="equipmentsObj.createTime">
                    <li @click="selectModelFunc(equipmentsObj.equipmentType.id , items ,object,equipmentsObj)" v-for="items in equipmentsObj.templates" :key="items.templateId" :class="{'cur': items.applyFlag, 'select':(curModelData.templateId==items.templateId)}">
                        <div class="bg">
                            <img :src="filePath+items.thumbImagePath[0]" alt="">
                        </div>
                        <p v-text="items.templateName"></p>
                        <p class="prompt">模版已应用</p>
                        <p class="prompt_bg"></p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="f-content">
            <h2 class="header">
                {{curModelData.templateName}}
            </h2>
            <div class="content">
                <h3>{{curModelData.titleInfo}}</h3>
                <div class="picBox">
                    <img :src="curModelData.templateImgPath[curImgIndex]" alt="">
                    <div v-show="curModelData.templateImgPath.length>1" class="toggleBtn" @click="toggleFunc(curImgIndex)">公告预览&gt;</div>
                </div>
            </div>
            <div class="foot">
                <el-button type="primary" round size="small" @click="applicationFunc" :disabled="curModelData.applyFlag==1">应用</el-button>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
h2.header{
    font-size: 20px;
    color: #333;
    line-height: 40px;
    height: 40px;
}
.f-aside{
    float: left;
    margin-right: 20px;
    .box{
        width: 360px;
        // height: 338px;
        height: auto;
        overflow: hidden;
        background: #F0F3FA;
        margin:10px 0;
        li.cur {
            .bg{
                opacity: 0.8;
                background: #ccc;
            }
            .prompt,.prompt_bg{
                display: block;
            }
        }
        li.select{
            color: #417ccc;
        }
        li{
            float: left;
            width: 150px;
            margin-left: 20px;
            cursor: pointer;
            position: relative;
            .prompt,.prompt_bg{
                position: absolute;
                bottom: 40px;
                left: 0;
                right: 0;
                color: #fff;
                height: 30px;
                line-height: 40px;
                display: none;
            }
            .prompt{
                z-index: 1;
            }
            .prompt_bg{
                
                background: linear-gradient(to top ,#ccc 30%,#ffffff1a)
            }
        }
        h3{
            text-align: center;
            font-size: 18px;
            color: #333333;
            line-height: 80px;
        }
        .bg{
            background: #fff;
            text-align: center;
            height: 208px;
            line-height: 208px;
            img{
                width: 104px;
                height: 188px;
                display: inline-block;
                margin: auto;
                background: #417ccc;

            }
        }
        p{
            text-align: center;
            line-height: 40px;
        }
    }
}
.f-content{
    margin-left: 380px;
    .content{
        height: 685px;
        background: #F0F3FA;
        margin-top: 10px;
        position: relative;
        h3{
            text-align: center;
            line-height: 60px;
        }
        .picBox{
            width: 600px;
            height: 500px;
            background: #fff;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            text-align: center;
            line-height: 500px;
            img{
                max-width: 600px;
                max-height: 500px;
            }
            .toggleBtn{
                cursor: pointer;
                position: absolute;
                right: -70px;
                text-align: center;
                top: 50%;
                transform: translateY(-50%);
                width: 70px;
                border: 1px solid #ddd;
                border-radius: 0 100% 100% 0;
                border-left: none;
                color: #999;
                height: 200px;
                line-height: 200px;
            }
            .toggleBtn:hover{
                color: #666;

            }
        }
    }
    .foot{
        text-align: center;
        line-height: 50px;
    }
}
</style>
<script>
export default {
    data(){
        return{
            data_all:[],
            curModelData:{
                equipmentTypeId: '',
                templateId: '',
                templateImgPath: [],
                applyFlag: '',
                titleInfo: ''
            },
            curImgIndex: 0,
            filePath: this.$store.getters.getFilePath

        }
    },
    methods:{
        applicationFunc(equipmentTypeId,templateId){
            console.log('applicationFunc');
            var data={
                equipmentTypeId: this.curModelData.equipmentTypeId,
                templateId: this.curModelData.templateId
            }
            this.http_applyedFunc(data);
        },
        http_modelmanageTableFunc(){
            var _this=this;
            this.$get('/app/content-aggr/content/queryEquipmentTypeTemplate')
            .then(function (response) {
                console.log(response);
                if (response.data.code===0) {
                    debugger;
                    _this.data_all= response.data.data;
                }else{
                    _this.$message({
                        type: 'info',
                        message: response.data.msg
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        http_applyedFunc(data){
            var _this=this;
            this.$post('/app/content-aggr/content/applyed',data)
            .then(function (response) {
                console.log(response);
                if (response.data.code==0) {
                    _this.http_modelmanageTableFunc();
                    _this.$message({
                        message:'模版应用成功',
                        type: 'success'
                    })
                    _this.curModelData.applyFlag= 1;
                }else{
                    _this.$message({
                        type: 'info',
                        message: response.data.msg
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        selectModelFunc(equipmentTypeId,items,object,equipmentsObj){
            this.curModelData.equipmentTypeId=equipmentTypeId;
            this.curModelData.templateId=items.templateId;
            this.curModelData.templateName=items.templateName;
            this.curModelData.applyFlag=items.applyFlag;
            var arrayImg= [];
            items.imagePath.forEach((item) => {
                arrayImg.push(this.$store.getters.getFilePath+item)
            });
            this.curModelData.templateImgPath=arrayImg;
            this.curModelData.titleInfo= object.equipmentSize+'寸'+' | '+(equipmentsObj.equipmentType.screenOrient==0 ? '横屏' : '竖屏')+' | '+equipmentsObj.equipmentType.dpi;
            debugger;
            this.curImgIndex= 0;
        },
        toggleFunc(index){
            debugger;
            if (this.curModelData.templateImgPath.length>index+1) {
                this.curImgIndex= index+1;
            }else{
                this.curImgIndex= 0;
            }
        }
    },
    created() {
        this.http_modelmanageTableFunc();
    },
}
</script>


