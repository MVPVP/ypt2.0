import Vue from 'vue'
import Vuex from 'vuex'
import user_module from './modules/user.js'
import app_module from './modules/app.js'

Vue.use(Vuex);

const store= new Vuex.Store({
    modules:{
        user_module,
        app_module,
    },
    getters:{
        getAdmin(state){
            return state.app_module.name;
        },
        getFilePath(state) {
            return state.app_module.filePath;
        },
    }
})

export default store;