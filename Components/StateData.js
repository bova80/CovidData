import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {Text} from 'native-base'
import {Picker} from '@react-native-community/picker';
import {PieChart} from 'react-native-chart-kit';

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

class StateData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      language: '',
      dataSource: [],
      stateData: [],
      positive: 0,
      negative: 0
    };
  }

  componentDidMount() {
    this.GetStateData();
  }

  GetStateData() {
    fetch('https://covidtracking.com/api/v1/states/current.json')
      .then((response) => response.json())
      .then((json) => {
        this.setState({dataSource: json});
      })

      .catch((error) => {
        console.error(error);
      });
  }

  getItemContent(state) {
    if (this.state.dataSource.length > 0) {
      fetch(`https://covidtracking.com/api/v1/states/${state}/current.json`)
        .then((response) => response.json())
        .then((json) => {
          this.setState({stateData: json});
        });
    }
  }

  componentWillUnmount() {
    console.log('component unmounted');
  }

  render() {
    return (
        
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1.5}}>
              <Text style={styles.text}>Select State:</Text>
            </View>
            <View style={{flex: 1}}>
              <Picker
                selectedValue={this.state.language}
                onValueChange={(itemValue, itemIndex) => {
                  this.getItemContent(itemValue);
                  this.setState({
                    language: itemValue,
                  });
                }}>
                <Picker.Item key="" value="" label="" />
                {this.state.dataSource.map((item) => {
                  return (
                    <Picker.Item color='white' 
                      key={item.state}
                      value={item.state}
                      label={item.state}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 0}}>
              <Text style={styles.text}>
                Confirmed Positive: {this.state.stateData.positive}
              </Text>
            </View>
            <View style={{flex: 0}}>
              <Text style={styles.text}>
                Confirmed Negative: {this.state.stateData.negative}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.text}>
                Total Tests: {this.state.stateData.total}
              </Text>
            </View>
            <View style={{flex: 3}}>
              {(this.state.stateData.positive > 0) && <PieChart
                data={[
                  {
                    name: 'Positive',
                    count: this.state.stateData.positive,
                    color: 'rgb(255, 102, 102)',
                    legendFontColor: 'white',
                    legendFontSize: 15,
                  },
                  {
                    name: 'Negative',
                    count: this.state.stateData.negative,
                    color: 'rgb(204, 255, 204)',
                    legendFontColor: 'white',
                    legendFontSize: 15,
                  },
                ]}
                width={400}
                height={220}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="10"
                absolute
                hasLegend={true}
              />}
            </View>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: 40,
    paddingRight: 20,
    paddingLeft: 20,
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Arial',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
});

export default StateData;
