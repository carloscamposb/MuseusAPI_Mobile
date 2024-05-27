## Bairros & Museus _ app React Native 📃🤓

Projeto desenvolvido como uma das atividades finais da disciplina Mobile 2024.1. 
_________

### Objetivo:

Implementação de Mapa e consumo de API. 
__________
### Funcionalidade:
O usuário tem o seu local de origem setado no mapa por geolocalizacao. Na área de busca o usuário coloca um determinado bairro do Recife para verificar se há museus naquele bairro. Havendo museus ele mostrará a localização no mapa daquele museu e trará informações abaixo sobre o museu como: Nome , descrição e contato
_______________
### Imports:
* Importes da biblioteca React: `useState` hook utilizado para gerenciar o estado em componentes funcionais | `useEffect` hook que permite realizar efeitos colaterais em componentes.Nesse caso solicitando o acesso a localização do usuário.

* Importa componentes específicos do React Native: `View`| `Text`| `TextInput`| `TouchableOpacity`| `Alert` | `ScrollView`

* Mapa : Biblioteca do React Native `react-native-maps` |  Geolocalização : Biblioteca do React Native: `expo-location`

* Animação de elementos: Biblioteca do Rect Native `react-native-animatable`

* Ícones: FontAwesome: Imports `@fortawesome/react-native-fontawesome` |  `@fortawesome/free-solid-svg-icons ` | `@fortawesome/fontawesome-svg-core`

________________
### API consumido (Museus)
> Informações sobre os museus do Recife e suas localizações georreferenciadas consumido do Banco de dados da Prefeitura do Recife

### Colunas utilizadas:
> Nome <br>
> Bairro <br>
> Descrição  <br>
> Latitude  <br>
> Longitude  <br>
> Telefone  <br>
> email

### Link da tabela com os dados 
> (http://dados.recife.pe.gov.br/dataset/roteiros-culturais-turismo-e-lazer/resource/97ab18da-f940-43b1-b0d4-a9e93e90bed5)

__________________
### Tecnologias utilizadas

<img src= 'https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB'> <br>

<img src=  'https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37'><br>

<img src= 'https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white'>

_________________


