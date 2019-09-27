<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Categorías</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
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
                        <v-flex xs12 sm6 md4>
                            <v-text-field v-model="descripcion" label="Descripcion"></v-text-field>
                        </v-flex>
                        </v-layout>
                    </v-container>
                    </v-card-text>
        
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                    <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="categorias"
                :search="search"
                class="elevation-1"
            >
                <template v-slot:items="props">
                    <td class="justify-center layout px-0">
                        <v-icon
                        small
                        class="mr-2"
                        @click="editItem(props.item)"
                        >
                        edit
                        </v-icon>
                        <v-icon
                        small
                        @click="deleteItem(props.item)"
                        >
                        delete
                        </v-icon>
                    </td>
                    <td>{{ props.item.nombre }}</td>
                    <td>{{ props.item.descripcion }}</td>
                    <td>
                        <div v-if="props.item.estado">
                            <span class="blue--text">Activo</span>
                        </div>
                        <div v-else>
                            <span class="red--text">Inactivo</span>
                        </div>
                    </td>
                </template>
                <template v-slot:no-data>
                <v-btn color="primary" @click="listar()">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios'
    export default {
        data(){
            return{
                dialog: false,
                search:'',
                categorias: [],
                headers: [
                { text: 'Opciones', value: 'opciones', sortable: false },
                { text: 'Nombre', value: 'nombre', sortable: true},
                { text: 'Descripcion', value: 'descripcion', sortable: false},
                { text: 'Estado', value: 'estado', sortable: false},
                ],
                editedIndex: -1,
                _id: '',
                nombre: '',
                descripcion: ''
            }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Registro' : 'Editar Registro'
            }
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {
            //this.initialize()
            //this.listar()
            me.listar();
        },
        methods: {
            listar(){
                let me = this;
                axios.get('categoria/list').then(function(response){
                    //console.log(response);
                    me.categorias = response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            limpiar(){
                this._id='';
                this.nombre='';
                this.descripcion='';
            },
            guardar(){
                let me = this;
                if(this.editedIndex >-1){
                    //Editar datos del registro

                } else{
                    //guardar nuevo registro
                    axios.post('categoria/add', {'nombre': this.nombre, 'descripcion': this.descripcion})
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
            initialize () {
            this.desserts = [
                {
                name: 'Frozen Yogurt',
                calories: 159,
                fat: 6.0,
                carbs: 24,
                protein: 4.0
                }
            ]
            },

            editItem (item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
            },

            deleteItem (item) {
            const index = this.desserts.indexOf(item)
            confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
            },

            close () {
                this.dialog = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            }

        }
    }
</script>
