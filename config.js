import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyAQYT9si3kV6jGSa_HMQmbLaadGmxvdPoI",
    authDomain: "wireless-library-b2436.firebaseapp.com",
    databaseURL: "https://wireless-library-b2436-default-rtdb.firebaseio.com",
    projectId: "wireless-library-b2436",
    storageBucket: "wireless-library-b2436.appspot.com",
    messagingSenderId: "1056126974256",
    appId: "1:1056126974256:web:a93f4f2aa156be77ab30f5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();