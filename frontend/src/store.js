import Vue from 'vue'
import Vuex from 'vuex'
import decode from 'jwt-decode'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { //no pueder ser modificado solo lectura
    token: null,
    usuario: null
  },
  mutations: {  // para modificar los estados
    setToken(state,token){
      state.token = token;
    },
    setUsuario(state,usuario){
      state.usuario = usuario;
    }
  },
  actions: { //realizar mutaciones
    guardarToken({commit},{token}){ //me permite almacer el token del backen en localstorage del navegador
      commit("setToken",token)
      commit("setUsuario",decode(token))
      localStorage.setItem("token",token)
    },
    autoLogin({commit}){
      let token = localStorage.getItem("token");
      if(token){
        commit("setToken",token);
        commit("setUsuario",decode(token));
      }
      router.push({name: 'home'});
    },
    salir({commit}){
      commit("setToken",null);
      commit("setUsuario",null);
      localStorage.removeItem("token");
      router.push({name: 'login'});
    }
  }
})
