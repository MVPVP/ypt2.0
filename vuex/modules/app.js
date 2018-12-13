const app_module={
    state:{
        name: 'lihongwei_app_module',
        filePath: 'http://192.168.11.51:6001/gateway/file/showFile?fileId=',

    },
    mutations:{
        breadListMutations(state,list){
            sessionStorage.setItem('breadList_session', list);
        }
    },
    getters:{
        getName(state){
            return state.name;
        },
        breadListGetters(){
            return JSON.parse(sessionStorage.getItem('breadList_session')) || [{
                name: "首页",
                path: '/resource',
            }];
        }
    }
}

export default app_module;