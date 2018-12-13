<template>
    <div>
        <div class="f-header">
            <el-row>
                <el-col :span="6">
                    <label>输入框：</label>
                    <el-input placeholder="请输入查询内容" size="small" v-model="headInput.hhaa"></el-input>
                </el-col>

                <el-col :span="6">
                    <label>下拉框：</label>
                    <el-select  v-model="headInput.hhbb" placeholder="请选择" size="small" @change="head_selectFunc">
                        <el-option v-for="item in head_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>

                <el-col :span="8">
                    <label>添加时间：</label>
                    <el-date-picker
                        v-model="headInput.hhcc"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        size="small">
                    </el-date-picker>
                </el-col>

                <el-col :span="4">
                    <el-button type="primary" round size="small" @click="query_globalFunc()">查询</el-button>
                    <el-button round size="small" @click="reset_globalFunc">重置</el-button>
                </el-col>
            </el-row>
            <el-row class="btnBox">
                <el-col :span="4">
                    <el-button type="primary" round size="small" @click="addBtn_globalFunc">添加弹窗</el-button>
                </el-col>
            </el-row>
        </div>

        <div class="f-contain">
            <el-table
            ref="ref_global"
            :data="tableData_global"
            style="width: 100%"
            border
            size="mini">
                <el-table-column
                    label="序号"
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column
                    label="姓名"
                    prop="aaa"
                    width="150">
                </el-table-column>
                <el-table-column
                    label="电话"
                    prop="aaa"
                    width="200">
                </el-table-column>
                <el-table-column
                    label="证件类型"
                    prop="aaa"
                    width="200">
                </el-table-column>
                <el-table-column
                    label="证件号码"
                    prop="aaa">
                </el-table-column>
                <el-table-column
                    prop="aaa"
                    label="关联房屋数"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="aaa"
                    label="添加住户时间"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="aaa"
                    label="备注"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="aaa"
                    label="操作"
                    width="250">
                    <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="add_revise_detail_Func"
                            type="text"
                            size="small">
                            查看
                        </el-button>
                        <el-button
                            @click.native.prevent="add_revise_detail_Func"
                            type="text"
                            size="small">
                            编辑
                        </el-button>
                        <el-button
                            @click.native.prevent="add_revise_detail_Func"
                            type="text"
                            size="small">
                            房产
                        </el-button>
                        <el-button
                            @click.native.prevent="add_revise_detail_Func"
                            type="text"
                            size="small">
                            门禁卡
                        </el-button>
                        <el-button
                            @click.native.prevent="deleteRowFunc"
                            type="text"
                            size="small"
                            class="btnDel">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div style="margin-top: 20px">
                <div class="block">
                    <el-pagination
                    @size-change="pageSizeChangeFunc"
                    @current-change="pageChangeFunc"
                    :current-page="page.current"
                    :page-sizes="[20, 50, 100, 200]"
                    :page-size="page.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total">
                    </el-pagination>
                </div>
            </div>
        </div>

        <!-- 弹窗 -->
        <el-dialog title="门禁卡详情" :visible.sync="dialogFormVisible_nnnn" width="800px">
            <div class="box">
                <div class="m_dialogHead">
                    <h3 class="m_borderLeft_title">小标题</h3>
                </div>
                <div class="m_dialogMain">
                    内容
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button type="danger" round size="small" @click="dialogFormVisible_nnnn= false">关闭</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>
<style lang="scss" scoped>

</style>
<script>
export default {
    data(){
        return {
            headInput:{
                hhaa: '',
                hhbb: '',
                hhcc: '',
            },
            page:{
                current: 1,
                size: 20,
                total: 0,
            },
            tableData_global:[
                {
                    aaa: '内容'
                }
            ],
            head_options: [{
                value: '3',
                label: '公告'
            }, {
                value: '2',
                label: '图片'
            }, {
                value: '1',
                label: '视频'
            }],
            dialogFormVisible_nnnn: false,
        }
    },
    methods:{
        query_globalFunc(){

        },
        addBtn_globalFunc(){
            this.dialogFormVisible_nnnn= true;
        },
        reset_globalFunc(){

        },
        head_selectFunc(){

        },
        add_revise_detail_Func(){

        },
        deleteRowFunc(){

        },
        http_nnnnTableFunc(data){
            // var _this=this;
            // this.$get('/app/content-aggr/content/shownnnnPage',data)
            // .then(function (response) {
            //     console.log(response);
            //     if (response.data.code==0) {
            //         var msg= response.data.data;

            //     }else{
            //         _this.$message({
            //             type: 'info',
            //             message: response.data.msg
            //         })
            //     }
            // })
            // .catch(function (error) {
            //     console.log(error);
            // });
        },
        pageSizeChangeFunc(val) {
            console.log(`每页 ${val} 条`);
            this.page.size= val;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size,
            }
            this.http_nnnnTableFunc(data);
        },
        pageChangeFunc(val) {
            console.log(`当前页: ${val}`);
            this.page.current= val;
            var data={
                pageNum: this.page.current,
                pageSize: this.page.size
            }
            this.http_nnnnTableFunc(data);
        },
    }
}
</script>


