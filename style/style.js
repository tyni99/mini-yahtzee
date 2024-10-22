import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    marginTop: 30,
    marginBottom: 15,
    backgroundColor: '#eba4eb',
    flexDirection: 'row',
  },
  footer: {
    marginTop: 20,
    backgroundColor: '#eba4eb',
    flexDirection: 'row'
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  },
  author: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  gameboard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gameinfo: {
    backgroundColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20,
    marginTop: 10
  },
  row: {
    marginTop: 20,
    padding: 10
  },
  flex: {
    flexDirection: "row"
  },
  button: {
    margin: 30,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f1157c",
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2
    
  },
  buttonText: {
    color:"#2B2B52",
    fontSize: 20
  },
  home: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input:{
    marginTop:15,
    height: 50, 
    width: 250, 
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
  },
  scoretitle:{
        fontSize: 20,
        marginBottom: 20,
        marginTop: 10,
        color: '#343a40',
        textAlign:'center'
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
},
date: {
    fontSize: 14,
    color: '#6c757d',
},
points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
},
hometitle:{
  fontWeight: 'bold',
  marginBottom:10,  
},
pointsContainer: {
  marginBottom:10,
  alignItems: 'center',
  marginLeft:5,
  
},

  
});