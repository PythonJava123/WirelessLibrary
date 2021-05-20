import * as React from 'react';
import { Text, View, TouchableOpacity, Stylesheet} from 'react-native';

export default class SearchScreen extends React.Component{
    render(){
        return(
            <View style={{marginTop:150, marginLeft:100}}>
                <Text>Search for a book</Text>
            </View>
        )
    }
}