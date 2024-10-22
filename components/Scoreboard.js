import { useState, useEffect} from 'react';
import { Text, View, FlatList } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import { SCOREBOARD_KEY } from '../constants/Game';
import styles from '../style/style';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default Scoreboard = ({ navigation }) => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardData();
        });
        return unsubscribe;
    }, [navigation]);

    const getScoreboardData = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                const tmpScores = JSON.parse(jsonValue);
                setScores(tmpScores);
                console.log('Scoreboard: Read successful.');
            }
        } catch (e) {
            console.log('Scoreboard: Read error ' + e);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.points}>{item.points} pts</Text>
        </View>
    );

    return (
        
        <View style={styles.container}>
            <Text style={styles.scoretitle}>Top Scores of All Time</Text>
            <FlatList
                data={scores}
                renderItem={renderItem}
                keyExtractor={item => item.key.toString()}
            />
            <Footer/>
        </View>
        
    );
};

