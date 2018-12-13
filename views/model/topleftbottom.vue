<template>
    <div class="ztree_box">
        <div class="ztree_aside">
            <el-input 
                placeholder="输入关键字进行过滤"
                v-model="ztree_filterText">
            </el-input>
            <div class="m_scroll">
                <el-tree
                    v-if="if_load_treeAgain"
                    :data="area_treeDatas"
                    :props="area_props"
                    :default-expanded-keys="defaultExpandedKeys"
                    node-key="areaId"
                    :load="loadNodeTree"
                    :expand-on-click-node="false"
                    :highlight-current="true"
                    :filter-node-method="filterNode"
                    lazy
                    ref="ref_tree"
                    @node-click="tree_nodeFunc"
                    :render-content	="ztree_render">
                </el-tree>
            </div>
            
        </div>
        <div class="ztree_article">
            <div class="f-header">
                sdffs
            </div>
            <div class="f-contain">
                <div class="box">
                    <div class="header">
                        <h2 class="m_borderLeft_title">住户列表</h2>
                    </div>
                    <div class="contain">

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<style lang="scss" scope>
.ztree_box{
    .box{
        min-height: 200px;
    }
    .ztree_aside{
        .el-input{
            width: 100%;
            margin-bottom: 10px;
        }
        .m_scroll{

        }
    }
    .el-input{
        width: 180px;
    }
    label{
        width: 100px;
        text-align: right;
        display: inline-block;
    }
    .el-col{
        min-height: 50px;
    }
    .el-textarea{
        width: 180px;
        display: inline-block;
        .el-textarea__inner{
            height: 80px;
        }
    }
    .el-dialog{
    .el-dialog__body{
        padding: 5px 0 20px 0;
    }
    h3.m_borderLeft_title{
        font-size: 16px;
    }
    .box{
        padding: 0 20px;
    }
}

}


.curColor{
    color: #417ccc;
}
</style>
<script>
import {arrayToAttrArray,tree_addAttr,tree_addAttr_b,tree_arrayToAttrArray_childrens} from '@/utils/common.js'

export default {
    data (){
        return {
            ztree_filterText: '',
            cur_nodeClick: {},
            cur_level: '',

            if_load_treeAgain: false,//控制是否从新渲染树数据，不知道还有没有更好的方法。。
            area_treeDatas: [],
            area_props:{
                label: 'areaName',
                children: 'childrens',
                isLeaf: 'ifLeaf'
            },
            defaultExpandedKeys: [],
        }
    },
    methods:{
        loadNodeTree(node, resolve) {
            debugger;
            if (node.level === 0) {
                debugger
                var sessionTreeDatas=JSON.parse(sessionStorage.getItem('httpData_queryAreaTree_session')),
                    expandTreeDatas=JSON.parse(sessionStorage.getItem('httpData_defaultExpandedKeys_session'));
                
                if (sessionTreeDatas) {//缓存起来；
                // var arrayId= JSON.parse(sessionStorage.getItem('disabledNodes_session')),
                //     msgDatas_disabled=tree_addAttr_b([sessionTreeDatas],arrayId,'disabled','areaId');
                    resolve(sessionTreeDatas) ;
                    this.defaultExpandedKeys= expandTreeDatas;
                }else{
                    this.http_getAreaTreesFunc(resolve);
                }
            }else{
                var hasChild= node.data.childrens ? 1 : 0;
                if (hasChild) {
                    // var arrayId= JSON.parse(sessionStorage.getItem('disabledNodes_session')),
                    //     msgDatas_disabled=tree_addAttr_b(node.data.childrens,arrayId,'disabled','areaId');
                    resolve(node.data.childrens);
                }else{
                    var data={
                        parentId : node.data.areaId
                    }
                    this.http_queryAreaChildrens(data,resolve);
                }
            }
            
        },
        http_getAreaTreesFunc(resolve){
            var _this=this
             this.$get('/app/hpc-aggr/hpc/queryAreaTree')
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var msgDatas= response.data.data;
                    
                    _this.defaultExpandedKeys= tree_arrayToAttrArray_childrens(msgDatas,'areaId');
                    sessionStorage.setItem('httpData_queryAreaTree_session',JSON.stringify(msgDatas));
                    sessionStorage.setItem('httpData_defaultExpandedKeys_session',JSON.stringify(_this.defaultExpandedKeys));

                    // var arrayId= JSON.parse(sessionStorage.getItem('disabledNodes_session')),
                    //     msgDatas_disabled=tree_addAttr_b([msgDatas],arrayId,'disabled','areaId');
                    resolve(msgDatas);
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
        http_queryAreaChildrens(data,resolve){
            var _this=this
             this.$get('/app/hpc-aggr/hpc/queryAreaChildrens',data)
            .then(function (response) {
                console.log(response);
                debugger;
                if (response.data.code==0) {
                    var msgDatas=response.data.data;
                    if (msgDatas.length>0) {
                        // var arrayId= JSON.parse(sessionStorage.getItem('disabledNodes_session')),
                        //     msgDatas_disabled=tree_addAttr_b(msgDatas,arrayId,'disabled','areaId');
                        for(let i=0;i<msgDatas.length;i++){//房间去掉下拉按钮；
                            if(msgDatas[i].level==50){
                                msgDatas[i].ifLeaf= true;
                            }
                        }
                        resolve(msgDatas);
                    }else{
                        resolve([]);
                    }
                    
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
        updatedTreeStatusFunc(){//更新树状图禁用状态；
            console.log('更新树状图禁用状态；');
            var _this=this;
            setTimeout(() => {
                _this.if_load_treeAgain= true;
            }, 0);
        },

      
        levelToHouseTypeFunc(level){
            if (level==0) {
                return '二级平台'
            }
            if (level==20) {
                return '小区'
            }
            if (level==30) {
                return '楼栋'
            }
            if (level==40) {
                return '单元'
            }
            if (level==50) {
                return '房屋'
            }else{
                return '自定义'
            }
        },

        add_ztreeFunc(){
            
            debugger;
            var cur_nodeClick=this.$refs.ref_tree.getCurrentNode();
            if (cur_nodeClick) {
                var data={
                    areaId: cur_nodeClick.areaId
                }
                this.http_queryAllowableAreaType(data);
                
            }else{
                this.$message({
                    type: 'info',
                    message: '请选择树状图'
                })
            }

        },
        delete_ztree(){
            var cur_nodeClick=this.$refs.ref_tree.getCurrentNode();
            if (cur_nodeClick) {
                var data={
                    id: cur_nodeClick.areaId
                }
                debugger;
                this.http_delete_ztree(data);
            }else{
                this.$message({
                    type: 'info',
                    message: '请选择树状图'
                })
            }
        },
        http_delete_ztree(data){
            var _this=this;
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$post('/app/hpc-aggr/hpc/deleteArea',data)
                .then(function (response) {
                    console.log(response);
                    debugger;
                    if (response.data.code==0) {
                        _this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        _this.if_load_treeAgain= false;
                        _this.updatedTreeStatusFunc();
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
            
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
            
        },
        tree_nodeFunc(aa,bb,cc){
            console.log(aa);
            var level= aa.level;
            this.cur_level=level;
            this.formData_attr.areaId= aa.areaId;
            debugger;
            
        
            var data={
                areaId: aa.areaId
            }
            this.http_queryAreaInfo(data);

            var datas={
                pageNum: this.page.current,
                pageSize: this.page.size,
                managementId: '6b0c4ccab56711e88a4a000c29a401f2',
                areaId : aa.areaId,
            }
            this.http_getAreaCardPageList(datas);
            this.http_getAreaPersonPageList(datas);
        },
        http_getAreaCardPageList(datas){
            var _this=this;
            this.$get('/app/hpc-aggr/hpc/getAreaCardPageList',datas)
            .then(function (response) {
                console.log(response);
                debugger
                if (response.data.code==0) {
                    _this.tableData_door= response.data.data.records;
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
        filterNode(value, data) {
            if (!value) 
                return true;
            debugger;
            return data.areaName.indexOf(value) !== -1;
        },
        ztree_render(h, { node, data, store }) {
            // debugger;
            if (data.level==50) {
                return (
                    <span>
                        <span class="curColor">{node.label}</span>
                    </span>
                )
            }else{
                return (
                    <span>
                        <span>{node.label}</span>
                    </span>
                )
            }
            
        },


    },
    watch: {
        ztree_filterText(val) {
            this.$refs.ref_tree.filter(val);
        }
    },
    created() {
        this.if_load_treeAgain= true;
    },
}
</script>


