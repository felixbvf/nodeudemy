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
        <v-icon
          small
          @click="deleteItem(item)"
        >
          delete
        </v-icon>
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
    validaMensage: []

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
      console.log('ggggg' + this.editedIndex);
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

    deleteItem (item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },

    close () {
      this.dialog = false;
    },

  }



}
</script>