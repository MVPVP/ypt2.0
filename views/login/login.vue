<template>
    <div>
        <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
            <el-form-item
                label="账号:"
                prop="account">
                <el-input type="text" v-model.number="numberValidateForm.account"></el-input>
            </el-form-item>
            <el-form-item
                label="密码:"
                prop="password">
                <el-input type="text" v-model.number="numberValidateForm.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('numberValidateForm')">提交</el-button>
                <el-button @click="resetForm('numberValidateForm')">初始化账号密码</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style lang="scss" scoped>
.demo-ruleForm{
    width: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.el-form-item{
    margin-bottom: 20px;
}
</style>

<script>

export default {
    data() {
        return {
            numberValidateForm: {
                account: 'admin',
                password: '654321'
            }
        };
    },
    methods: {
        submitForm(formName) {
            console.log('submitForm');
            this.http_loginFunc(this.numberValidateForm);
        },
        resetForm(formName) {
            console.log('resetForm');
            this.$refs[formName].resetFields();
        },
        http_loginFunc(obj){
            var URL = 'http://192.168.11.51:6001/gateway/user/login';
            var _this=this;
            this.$post(URL, {
                username: obj.account,
                password: obj.password
            })
            .then(function (response) {
                console.log(response);
                debugger;

                sessionStorage.setItem('session_accessToken', response.data.data.accessToken);
                sessionStorage.setItem('session_userId', response.data.data.userId);
                sessionStorage.setItem('session_username', response.data.data.username);

                sessionStorage.removeItem('httpData_queryAreaTree_session');
                sessionStorage.removeItem('httpData_defaultExpandedKeys_session');
                _this.$router.push({path:'/resource'});
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
}
</script>
