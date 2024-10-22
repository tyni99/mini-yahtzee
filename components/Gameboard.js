import { useState, useEffect } from 'react' //npm i --save-dev @types/react jos ei toimi
import { Text, View , Pressable} from 'react-native';
import Header from './Header';
import Footer from './Footer';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Container, Row, Col } from 'react-native-flex-grid';
import { 
    NBR_OF_DICES,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS,
    BONUS_POINTS_LIMIT, 
    SCOREBOARD_KEY} from '../constants/Game';
import styles from '../style/style';
import AsyncStorage from '@react-native-async-storage/async-storage';


let board = [];

export default Gameboard = ({navigation, route}) => {

    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices');
    const [gameEndStatus, setGameEndStatus] = useState(false);
    //Mitkä arpakuutioista ovat valittuja? 
    const [selectedDices, setSelectedDices] = 
        useState(new Array(NBR_OF_DICES).fill(false));
    //Arpakuutioiden silmäluvut
    const [diceSpots, setDiceSpots] =
        useState(new Array(NBR_OF_DICES).fill(0));
    // Valittujen arpakuutioiden kokonaispistemäärät
    const [dicePointsTotal, setDicePointsTotal]=
        useState(new Array(MAX_SPOT).fill(0));
    // Mitkä arpakuutioiden silmäluvuista on valittu pisteisiin
    const [selectedDicePoints, setSelectedDicePoints] = 
        useState(new Array(MAX_SPOT).fill(0));
    const [playerName, setPlayerName] = useState('');
    const [scores, setScores] = useState([]);

    
    useEffect(() => {
      if(playerName === '' && route.params?.player){
        setPlayerName(route.params.player)
      }
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          getScoreboardData()
        })
        return unsubscribe
      }, [navigation])
      
  
  
      const getScoreboardData = async() => {
          try {
              const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY)
              if(jsonValue !== null) {
                  const tmpScores = JSON.parse(jsonValue)
                  setScores(tmpScores)
                  console.log('Gameboard: Read successful.');
                  console.log('Gameboard: Number of scores : ' + tmpScores.length);
              }
          } catch (e) {
              console.log('Gameboard: Read error ' + e);
              
          }
      }

      const savePlayerPoints = async () => {
        // Tarkista, onko peli päättynyt
        if (!gameEndStatus) {
            setStatus('Game is not over yet. Finish the game to save points.');
            return;
        }
    
        // Laske yhteispisteet
        const totalPoints = dicePointsTotal.reduce((total, num) => total + num, 0);
    
        // Lisää bonuspisteet, jos kokonaispisteet ylittävät rajan
        const points = totalPoints >= BONUS_POINTS_LIMIT ? totalPoints + BONUS_POINTS : totalPoints;
        
    
        const playerPoints = {
            key: scores.length + 1,
            name: playerName,
            date: new Date().toLocaleDateString(), 
            time: new Date().toLocaleTimeString(),
            points: points 
        };
    
        try {
            const newScores = [...scores, playerPoints]
                .sort((a, b) => b.points - a.points) 
                .slice(0, 7);
            const jsonValue = JSON.stringify(newScores);
            await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
            console.log('Gameboard: Save successful: ' + jsonValue);
            navigation.navigate('Scoreboard');
        } catch (e) {
            console.log('Gameboard: Save error ' + e);
        }
    };
    
//Tässä luodaan arpakuutiorivi sarakkeittain (Col)
const dicesRow = [];
for (let dice = 0; dice < NBR_OF_DICES; dice++) {
    dicesRow.push(
      <Col key={'dice' + dice}>
        <Pressable 
            key={"row" + dice}
            onPress={() => chooseDice(dice)}>
            <MaterialCommunityIcons
            name={board[dice]}
            key={"dice" + dice}
            size={55} 
            color={getDiceColor(dice)}>
            </MaterialCommunityIcons>
        </Pressable>
      </Col>
    );
  }

// Tässä luodaan pisterivi sarakkeittain (col)
const pointsRow = [];
for (let spot = 0; spot < MAX_SPOT; spot++){
    pointsRow.push(
        <Col key={'pointsRow'+ spot}>
            <Text key={'pointsRow'+ spot}>{getSpotTotal(spot)}</Text>
        </Col>
    )
}

// Tässä luodaan rivi, joka kertoo onko pisteet jo valittu silmäluvulle
const pointsToSelectRow = [];
for (let diceButton = 0 ; diceButton < MAX_SPOT; diceButton++){
    pointsToSelectRow.push(
        <Col key={'buttonsRow'+diceButton}>
            <Pressable 
            key={'buttonsRow'+diceButton}
            onPress={()=> chooseDicePoints(diceButton)}
            >
                <MaterialCommunityIcons
                    name={'numeric-' + (diceButton + 1) + '-circle'}
                    key={'buttonsRow'+diceButton}
                    size={35}
                    color={getDicePointsColor(diceButton)}>
                </MaterialCommunityIcons>
            </Pressable>
        </Col>
    )
}

    const chooseDice = (i) => {
        if(nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false : true;
        setSelectedDices(dices);
    }else{
        setStatus('You have to throw dices first')
        }
    }

    const chooseDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
    
            if (!selectedPoints[i]) {
                selectedPoints[i] = true;
                let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
                points[i] = nbrOfDices * (i + 1);
            } else {
                setStatus('You already selected points for ' + (i + 1));
                return points[i];    
            }
    
            setDicePointsTotal(points);
            setSelectedDicePoints(selectedPoints);
            setNbrOfThrowsLeft(NBR_OF_THROWS);
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    
            // Tarkista onko peli päättynyt
            if (selectedPoints.every(point => point === true)) {
                let totalPoints = points.reduce((total, num) => total + num, 0);
                
                // Tarkista bonus
                if (totalPoints >= BONUS_POINTS_LIMIT) {
                    setStatus(`Game over! Total points: ${totalPoints}. You have earned a bonus of ${BONUS_POINTS} points and it will be added to your score when you save the game!`);
                } else {
                    setStatus(`Game over! Total points: ${totalPoints}.`);
                }
                
                setGameEndStatus(true);
            } else {
                setStatus('Throw');
            }
    
            return points[i];
        } else {
            setStatus('Throw ' + NBR_OF_THROWS + ' times before setting points');
        }
    };
    
    
    function getDiceColor(i) {
         return selectedDices[i] ? "violet" : "pink";
        }

    function getDicePointsColor(i) {
        return (selectedDicePoints[i] && !gameEndStatus) ? "violet" : "pink";
         }
    
    function getSpotTotal(i) {
        return dicePointsTotal[i]
    }

    const restartGame = () => {
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        setDiceSpots(new Array(NBR_OF_DICES).fill(0));
        setDicePointsTotal(new Array(MAX_SPOT).fill(0));
        setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
        setGameEndStatus(false);
        setStatus('Game restarted! Throw the dices.');
    };

    const throwDices = () => {
        if (gameEndStatus) {
            setStatus('Game is over! Save points or start a new game.');
            return;
        }
        if (nbrOfThrowsLeft > 0) {
            let spots = [...diceSpots];
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-' + randomNumber;
                spots[i] = randomNumber;
            }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        setDiceSpots(spots)
        setStatus('Select and throw dices again')
    }else{
        setStatus('No throws left. Select points or start a new round')
    }
    
}
    
    return(
    <>
        <Header />
        <View style={styles.home}>
            <Container>
                <Row>{dicesRow}</Row>
            </Container>
            <Text>THROWS LEFT: {nbrOfThrowsLeft}</Text>
            <Text>{status}</Text>
            <Pressable style={styles.button}onPress={()=>throwDices()}>
                <Text>THROW DICES</Text>
            </Pressable>
            <Container>
                <Row style={styles.pointsContainer}>{pointsRow}</Row>
            </Container>
            <Container>
                <Row>{pointsToSelectRow}</Row>
            </Container>
            <Text>Player: {playerName}</Text>
            <Pressable style={styles.button}onPress={()=>savePlayerPoints()}>
                <Text>SAVE POINTS </Text>
            </Pressable>
            <Pressable style={styles.button} onPress={restartGame}>
            <Text>RESTART GAME</Text>
            </Pressable>
        </View>
        <Footer />
    </>
    )
}