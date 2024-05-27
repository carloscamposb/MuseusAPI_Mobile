import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Linking, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Animatable from 'react-native-animatable';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

library.add(faSearch, faMapMarkerAlt);

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recifeData, setRecifeData] = useState(null);
  const [location, setLocation] = useState(null);

  const [fontesLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

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
      Alert.alert('Aviso', 'Por favor, insira um bairro válido para a busca.');
      return;
    }

    try {
      const apiUrl = `http://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=97ab18da-f940-43b1-b0d4-a9e93e90bed5&plain=query&filters={"bairro":"${searchQuery}"}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.success) {
        if (data.result.records.length === 0) {
          Alert.alert('Aviso', 'Não há museus neste bairro.');
        }
        setRecifeData(data.result.records);
      }
    } catch (error) {
      Alert.alert('Erro', 'Houve um problema na busca dos dados. Tente novamente mais tarde.');
    }
  };

  if (!fontesLoaded) {
    return null;
  }

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <View>
          <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 30, fontWeight: '600', fontFamily: 'Roboto_700Bold' }}>
            Bairros & Museus
          </Text>
          <Animatable.View style={{ position: 'absolute', right: 50, top: 28 }} useNativeDriver animation="rubberBand" duration={1500} iterationCount="infinite">
            <FontAwesomeIcon icon={faMapMarkerAlt} size={25} color="orange" />
          </Animatable.View>
        </View>

        <Animatable.View useNativeDriver animation="bounce" duration={1500}>
          <TextInput
            style={{ borderWidth: 2, borderColor: 'orange', marginTop: 20, marginBottom: 20, padding: 8, borderRadius: 5,  fontFamily: 'Roboto_400Regular' }}
            placeholder="Digite o bairro para a busca. Ex.: Várzea"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <TouchableOpacity style={{ backgroundColor: 'orange', marginBottom: 20, padding: 10, borderRadius: 5 }} onPress={handleSearch}>
            <Text style={{ color: 'black', textAlign: 'center', fontWeight: '500', fontFamily:'Roboto_500Medium' }}>Buscar Museus</Text>
          </TouchableOpacity>
        </Animatable.View>

        {location && (
          <View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, textAlign: 'center', fontFamily:'Roboto_700Bold' }}>Sua Localização</Text>
              <Animatable.View style={{ position: 'absolute', right: 50, top: 25 }} useNativeDriver animation="bounceInRight">
                <FontAwesomeIcon icon={faSearch} size={20} color="orange" />
              </Animatable.View>
            </View>

            <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'space-between', marginTop: 15 }}>
              <Text style={{ fontWeight: '600' , fontFamily:'Roboto_500Medium' }}>Latitude: {location.coords.latitude}</Text>
              <Text style={{ fontWeight: '600', fontFamily:'Roboto_500Medium' }}>Longitude: {location.coords.longitude}</Text>
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
                title="Você está aqui!"
              />

              {recifeData && recifeData.map((record, index) => (
                record.latitude && record.longitude && (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: parseFloat(record.latitude),
                      longitude: parseFloat(record.longitude),
                    }}
                    title={record.nome}
                  />
                )
              ))}
            </MapView>
          </View>
        )}

        {recifeData && (
          <View style={{ marginTop: 20 }}>
            {recifeData.map((record, index) => (
              <Animatable.View key={index} style={{ marginBottom: 20, padding: 10, borderWidth: 2, borderColor: 'orange', borderRadius: 5 }} useNativeDriver animation="fadeInUpBig">
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{record.nome}</Text>
                <View style={{ marginTop: 10, marginBottom: 10 }}>
                  <View>
                    <Text style={{ fontFamily:'Roboto_500Medium'}}>Descrição: {record.descricao}</Text>
                  </View>
                </View>
                <Text style={{ fontFamily:'Roboto_500Medium' }}>Contato: {record.telefone}</Text>
                {/* Texto do site transformado em link clicável */}
                {record.site && (
                  <Text style={styles.linkText} onPress={() => Linking.openURL(record.site)}> Site: {record.site}</Text>
                )}
              </Animatable.View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  linkText: {
    fontWeight: '500',
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default App;
