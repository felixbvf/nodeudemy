<template>
  <v-layout align-start>
   <v-data-table
   :headers="headers"
   :items="categorias"
   :search="search"
   sort-by="calories"
   class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Categorias</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <div class="flex-grow-1"></div>
          <v-text-field class="text-xs-center" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
                                </v-flex>
                                 <v-flex xs12 sm12 md12 v-show="valida">
                                    <div class="red--text" v-for="v in validaMensage" :key="v" v-text="v"></div>
                                </v-flex>
                    </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="adModal" max-width="200">
            <v-card>
              <v-card-title class="headline" v-if="adAccion==1">
                Activar Item
              </v-card-title>
              <v-card-title class="headline" v-if="adAccion==2">
                Desactivar Item
              </v-card-title>
              <v-card-text>
                Estas a punto de <span v-if="adAccion==1">Activar</span>
                <span v-if="adAccion==2">desactivar</span> el item {{adNombre}}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="activarDesactivarCerrar()" color="green darken-1" >
                  cancelar
                </v-btn>
                <v-btn v-if="adAccion==1" @click="activar()" color="orange darken-4" >
                    Activar
                </v-btn>
                 <v-btn v-if="adAccion==2" @click="desactivar()" color="orange darken-4" >
                    Desactivar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-toolbar>
      </template>

      <template v-slot:item.action="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          edit
        </v-icon>
        <template v-if="item.estado">
          <v-icon
            small
            @click="activarDesactivarMostrar(2,item)"
          >
            block
          </v-icon>
        </template>
         <template v-else>
          <v-icon
            small
            @click="activarDesactivarMostrar(1,item)"
          >
            check
          </v-icon>
        </template>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="listar">Resetear</v-btn>
      </template>
    </v-data-table>
  </v-layout align-start>
</template>

<script>
import axios from 'axios';
export default {
data: () => ({
    dialog: false,
    search:'',
    categorias:[],
    headers: [
      { text: 'Nombre', value: 'nombre', sortable: true },
      { text: 'Descripción', value: 'descripcion', sortable: false },
      { text: 'Estado', value: 'estado', sortable: false },
      { text: 'Actions', value: 'action', sortable: false },
    ],
    editedIndex: -1,  //si es 1 significar que se va editar 
    _id: '',
    nombre: '',
    descripcion: '',
    valida: 0,
    validaMensage: [],
    adModal: 0,   // Variables activar y desactivar
    adAccion: 0,
    adNombre: '',
    adId: ''  //

  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo Registro' : 'Editar Registro'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  created () {
    this.listar()
  },

  methods: {
    listar () {
      let me=this;
      axios.get('categoria/list').then(function (response){
                    me.categorias=response.data;
                    //console.log(me.categorias);
                }).catch(function(error){
                    console.log(error);
                });
    },
    limpiar(){
                this._id='';
                this.nombre='';
                this.descripcion='';
                this.valida=0;
                this.validaMensaje=[];
                this.editedIndex=-1;
    },
    validar() {
      this.valida=0;
      this.validaMensage=[];
      if(this.nombre.length <1 || this.nombre.length >50){
        this.validaMensage.push('El nombre debe tener 1-50 caracteres');
      }
      if(this.descripcion.length > 255){
        this.validaMensage.push('La descripcion no debe tener mas 255 caracteres');
      }
      if(this.validaMensage.length)
      {
        this.valida=1;
      }
      return this.valida;
    },
    guardar(){
      let me=this;
      if (this.validar()){
        return;
      }
     // console.log('ggggg' + this.editedIndex);
      if (this.editedIndex > -1){
                    //Código para editar
                    axios.put('categoria/update',{'_id':this._id,'nombre':this.nombre,'descripcion':this.descripcion})
                    .then(function(response){
                        me.limpiar();
                        me.close();
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
      } else{
                    //Código para guardar
                    axios.post('categoria/add',{'nombre':this.nombre,'descripcion':this.descripcion})
                    .then(function(response){
                        me.limpiar();
                        me.close();
                        me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
                    });
      }
    },

    editItem (item) {
      console.log(item.nombre);
      this._id = item._id;
      this.nombre = item.nombre;
      this.descripcion= item.descripcion;
      this.dialog = true;
      this.editedIndex = 1;
      
      //console.log('hhhhh -----' + item._id);
      /*this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)*/
      
    },

    activarDesactivarMostrar (accion,item) {
      //console.log(accion);
      this.adModal = 1;
      this.adNombre = item.nombre;
      this.adId = item._id;
      if(accion == 1){
        this.adAccion = 1;
      } else if(accion==2){
        this.adAccion = 2;
      } else {
        this.adModal=0;
      }
      //confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },
    activarDesactivarCerrar(){
      this.adModal=0;
    },
    activar(){
      let me = this;
      axios.put('categoria/activate',{'_id':this.adId})
                    .then(function(response){
                       me.adModal=0;
                       me.adAccion=0;
                       me.adNombre= '';
                       me.adI='';
                       me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
      });
    },
    desactivar(){
      let me = this;
      axios.put('categoria/deactivate',{'_id':this.adId})
                    .then(function(response){
                       me.adModal=0;
                       me.adAccion=0;
                       me.adNombre= '';
                       me.adI='';
                       me.listar();
                    })
                    .catch(function(error){
                        console.log(error);
      });
    },

    close () {
      this.dialog = false;
    },

  }



}
</script>