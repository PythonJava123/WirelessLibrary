import * as React from 'react';
import db from '../config';
import firebase from 'firebase'
import {Text, View, TouchableOpacity, StyleSheet, TextInput, Image, Alert, KeyboardAvoidingView} from 'react-native';
import Toast from 'react-native-simple-toast';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';

export default class BookTransactionScreen extends React.Component{

    constructor(){
        super()
        this.state = {
     hasCameraPermission: null,
     scanned: false,
     scannedData: '',
     buttonState: 'normal',
     scannedBookID: '',
     scannedStudentID:'',
     transactionMessage: ''

        }
    }
    getCameraPermission = async (ID) =>{

        const {status} = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermission: status === 'granted',
            buttonState: ID,
            scanned: false,
        })

    }

    handleBarCodeScanned = async ({type,data}) => {
const {buttonState} = this.state
if(buttonState==="bookID"){
this.setState({

    scanned: true,
    scannedData: data,
    buttonState: 'normal',

})}
else if (buttonState === "studentID"){

    this.setState({
        scanned: true,
        scannedData: data,
        buttonState: 'normal'
    })

}

    }

    handleTransaction = async() => {
        var transactionMessage
        db.collection("books").doc(this.state.scannedBookID).get()
        .then((doc)=>{

            var book = doc.data()
            if(book.bookAvailability){

            this.initiateBookIssue();
            transactionMessage = "issued"
            Toast.show(transactionMessage, Toast.SHORT);

            }

            else{

                this.initiateBookReturn();
                transactionMessage = "returned"
                Toast.show(transactionMessage, Toast.SHORT);

            }

        })

        this.setState({
            transactionMessage: transactionMessage,

        })

    }

    initiateBookIssue = async () => {
        db.collection("transaction").add({
            studentID: this.state.scannedStudentID,
            bookID: this.state.scannedBookID,
            date: firebase.firestore.Timestamp.now().toDate(),
            transactionType: 'issue'
        })
        db.collection("books").doc(this.state.scannedBookID).update({
            bookAvailability: false,
        })
        db.collection("students").doc(this.state.scannedStudentID).update({
            booksIssued: firebase.firestore.FieldValue.increment(1)
        })
            Alert.alert("Book Issued");
            this.setState({
                scannedBookID: '',
                scannedStudentID: '',            
             })
    }

    initiateBookReturn = async () => {
        db.collection("transaction").add({
            studentID: this.state.scannedStudentID,
            bookID: this.state.scannedBookID,
            date: firebase.firestore.Timestamp.now().toDate(),
            transactionType: 'return'
        })
        db.collection("books").doc(this.state.scannedBookID).update({
            bookAvailability: true,
        })
        db.collection("students").doc(this.state.scannedStudentID).update({
            booksIssued: firebase.firestore.FieldValue.increment(-1)
        })
        Alert.alert("Book Returned");
        this.setState({
            scannedBookID: '',
            scannedStudentID: '',
        })
    }

    render(){
        const hasCameraPermission = this.state.hasCameraPermission;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;


        if(buttonState !== 'normal' && hasCameraPermission){
            return(
                <BarCodeScanner onBarCodeScanned = {scanned ? undefined : this.handleBarCodeScanned} style={StyleSheet.absoluteFillObject}/>
            )
        }
        else if( buttonState === 'normal'){
        return(
            <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
            <View style={styles.container}>
                <View>
                    <Image source={require('../assets/booklogo.jpg')} style={{width: 200, height: 200}}></Image>
                    <Text style={{textAlign:'center', fontSize: 20}}>Wireless Library</Text>
                </View>
                <View style={styles.inputView}>
                    <TextInput 
                    style={styles.inputBox} 
                    placeholder = "Book ID"
                    value={this.state.scannedBookID}
                    onChangeText={text=>this.setState({
                        scannedBookID: text,
                    })}/>
                    <TouchableOpacity 
                    style={styles.scanButton}
                    onPress={() =>{
                        this.getCameraPermission("bookID")
                    }}> 
                    <Text style={styles.buttonText}>SCAN</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.inputView}>
                    <TextInput
                    style={styles.inputBox}
                    placeholder ="Student ID"
                    value={this.state.scannedStudentID}
                    onChangeText={text=>this.setState({
                        scannedStudentID: text,
                    })}/>
                    <TouchableOpacity
                    style={styles.scanButton}
                    onPress={()=>{
                        this.getCameraPermission("studentID")
                    }}>
                        <Text style={styles.buttonText}>SCAN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitButton} onPress={async()=>{
                        var transactionMessage = this.handleTransaction();
                        this.setState({
                            scannedBookID: '',
                            scannedStudentID: '',
                        })
                    }}>
                        <Text style={styles.submitButtonText}>SUBMIT</Text>
                        </TouchableOpacity>
                        
                </View>
            </View>
            </KeyboardAvoidingView>
        )
    }
    }
}

const styles = StyleSheet.create({

container: {

flex: 1,
justifyContent: 'center',
alignItems: 'center'

},

displayText:{

fontSize: 15,
textDecorationLine: 'underline',

},

scanButton:{

backgroundColor: 'blue',
padding: 10,
margin: 10,

},

buttonText: {

fontSize: 20,

},

inputView: {

flexDirection: 'row',
margin: 20,

},

inputBox: {

width: 200,
height: 40,
borderWidth: 1.5,
fontSize: 20,

},

submitButton:{
backgroundColor: 'red',
width: 100,
height:50

},

submitButtonText:{

    padding:10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',


}

})