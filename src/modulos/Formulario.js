import React,{Component} from 'react';
import {Button, Text,TextInput,View} from 'react-native';
import Tarefa from '../models/Tarefa';
import DataBase from '../dataBase/DataBase';

export default class Formulario extends Component{
    tarefa = new Tarefa();
    data = new DataBase();

    render(){
        return(
            <View>
                <Text>Nome:</Text>
                <TextInput onEndEditing={nome => this.tarefa.Nome = nome }></TextInput>
                <Text>Descrição:</Text>
                <TextInput onEndEditing={descricao => this.tarefa.Descricao = descricao}></TextInput>
                <Text>Data de Termino:</Text>
                <TextInput onEndEditing={dataTermino => this.tarefa.DataTermino = dataTermino}></TextInput>
                <Text>Prioridade</Text>
                <TextInput onEndEditing={prioridade => this.tarefa.Prioridade = prioridade}></TextInput>
                <Button title="Cadastrar" onPress={ () => this.data.addTarefa(this.tarefa)}></Button>
            </View>
        )
    }
}