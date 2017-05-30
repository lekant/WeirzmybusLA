/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';



function getETAPlusMinutes(minutes) {
    let date = new Date();
    date.setMinutes(date.getMinutes() +  minutes);
    return date;
}


 function  renderPredictions(predictions) {
        if (predictions.length > 0) {
            predictions.forEach((prediction, index, array) => prediction.eta=getETAPlusMinutes(prediction.minutes));
            return predictions.map((prediction, index) => (
            <Predictions key={prediction.block_id} prediction={prediction}/>
            ));
        }
        else {return []};
    }

export default class totoApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
          predictions: [],
          animating: false
        };
      }

     getStopPrediction(value){
        const url = 'http://api.metro.net/agencies/lametro/stops/'+value+'/predictions/';
        console.log(url );
        this.setState({animating:true});
        fetch(url,
            {
              method: 'GET',
              headers:
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json())
            .then((responseJson) => {
            console.log(responseJson);

            this.setState({predictions:responseJson.items});
            this.setState({animating:false});
        })
        .catch((error) => {
            this.setState({animating:false});
            console.error(error);
        });
    }
      render() {
        return (
          <View style={styles.container}>
            <Text style={styles.welcome}>
              Welcome to Weirzmybus LA!
            </Text>
            <Text style={styles.instructions}>
              To get started, Enter a bus stop number.
            </Text>
            <TextInput style={styles.instructions, {width: 70}}
            maxLength = {4}
            autoCorrect={false}
            keyboardType={'numeric'}
            placeholder={'Bus stop'}
            onSubmitEditing={(event) => {this.getStopPrediction(event.nativeEvent.text)}}>
            </TextInput>
            <ScrollView style={{flex:1, padding: 8}}>
             {renderPredictions(this.state.predictions)}
            </ScrollView>

            <ActivityIndicator
                  animating={this.state.animating}
                  style={[styles.centering, {height: 80}]}
                  size="large"
                />
          </View>
        );
      }
}

const Predictions = ({prediction}) => {
    return (
        <View style={{padding: 8, flexDirection: 'row'}}>
           <Text style={styles.cell}>{prediction.route_id}</Text>
           <Text style={styles.cell}>ETA {prediction.minutes} minutes</Text>
           <Text style={styles.cell}>ETA {prediction.eta.toLocaleTimeString()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  cell: {
    borderLeftWidth: 1,
    padding: 6,
  }
});

AppRegistry.registerComponent('totoApp', () => totoApp);
