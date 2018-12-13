import { http_loginFunc } from "../../api/login";

const user_module={
    state:{
        age:25,
        switchTo_resource_dialogOpen_notice: false,
        switchTo_resource_dialogOpen_media: false,

    },
    mutations:{
        setSession(state){
            sessionStorage.setItem('age',state.age)
        },
        getSession(state){
            sessionStorage.getItem('age');
        },
        getUserObj(){
            return sessionStorage.getItem('')
        },
    },
    actions:{
       
    },
    getters:{
        doubleAge(state){
            return state.age*2;
        },
        getUserObj(state) {
            return {
                name: '',
                id: '',
                Authorization:''
            }
        }
    },
    
}

export default user_module;