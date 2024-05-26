import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Animatable from 'react-native-animatable';

library.add(faSearch, faMapMarkerAlt);

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recifeData, setRecifeData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      console.log('Location:', locationData);
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um bairro válido para a busca. ');
      return;
    }

    try {
      const apiUrl = `http://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=97ab18da-f940-43b1-b0d4-a9e93e90bed5&plain=query&filters={"bairro":"${searchQuery}"}`;

      // console.log('API URL:', apiUrl);

      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log('API Response:', data);

      if (data.success) {
        if (data.result.records.length === 0) {
          Alert.alert('Aviso', 'Não há museus neste bairro.');
        }
     
      } else {
        setRecifeData(data.result.records);
      }
    } catch (error) {
      Alert.alert('Erro', 'Houve um problema na busca dos dados. Tente novamente mais tarde.');
    }
  };

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <View>
          <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 30, fontWeight: '600' }}>
            Bairros & Museus
          </Text>
          <Animatable.View style={{ position: 'absolute', right: 50, top: 28 }} useNativeDriver animation="rubberBand" duration={1500} iterationCount="infinite">
            <FontAwesomeIcon icon={faMapMarkerAlt} size={25} color='orange' />
          </Animatable.View>
        </View>

        <Animatable.View  useNativeDriver animation="bounce" duration={1500}>
          <TextInput
            style={{ borderWidth: 2, borderColor: 'orange', marginTop: 20, marginBottom: 20, padding: 8, borderRadius: 5 }}
            placeholder="Digite o bairro para a busca. Ex.: Várzea"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <TouchableOpacity style={{ backgroundColor: 'orange', marginBottom: 20, padding: 10, borderRadius: 5 }} onPress={handleSearch}>
            <Text style={{ color: 'black', textAlign: 'center', fontWeight:'500' }}>Buscar Museus</Text>
          </TouchableOpacity>
        </Animatable.View> 
     

        {location && (
          <View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, textAlign: 'center' }}>Sua Localização</Text>
              
              <Animatable.View style={{ position: 'absolute', right: 50, top: 25 }} useNativeDriver animation="bounceInRight" >
                <FontAwesomeIcon icon={faSearch} size={20} color='orange' />
              </Animatable.View>
            </View>

            <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'space-between', marginTop: 15 }}>
              <Text style={{ fontWeight: '600' }}>Latitude: {location.coords.latitude}</Text>
              <Text style={{ fontWeight: '600' }}>Longitude: {location.coords.longitude}</Text>
            </View>

            <MapView
              style={{ width: '100%', height: 200, marginTop: 15 }}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Você está aqui"
              />
            </MapView>
          </View>
        )}

        {recifeData && (
          <View style={{ marginTop: 20 }}>
            {recifeData.map((record, index) => (
              <Animatable.View key={index} style={{ marginBottom: 20, padding: 10, borderWidth: 2, borderColor: 'orange', borderRadius: 5 }} useNativeDriver animation= "fadeInUpBig">
               
               <Text style={{ fontWeight: 'bold', fontSize:16, }}>{record.nome}</Text>
                <View style={{marginTop: 10, marginBottom: 10 }}>
                  <View>
                    <Text style={{ fontWeight:'500' }}>Descrição: {record.descricao}</Text>
                  </View>
                 
                </View>

                  <Text style={{ fontWeight:'500' }}>Contato: {record.telefone} </Text>
                  <Text style={{ fontWeight:'500' }}>Site: {record.site}</Text>
               
                <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'space-between', marginTop: 15 }}>
                  <Text style={{ fontWeight:'500' }}>Latitude:{record.latitude} </Text>
                  <Text style={{ fontWeight:'500' }}>Longitude:{record.longitude} </Text>
                </View>
           
              </Animatable.View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default App;
