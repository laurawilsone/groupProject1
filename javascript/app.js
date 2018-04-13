// Initialize Firebase
var config = {
    apiKey: "AIzaSyD9ds5k0bf8JxdiYFQzO9S3pooSC3PWwn0",
    authDomain: "apigroupproject1.firebaseapp.com",
    databaseURL: "https://apigroupproject1.firebaseio.com",
    storageBucket: "apigroupproject1.appspot.com",
    // messagingSenderId: "<SENDER_ID>",
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();






$(document).ready(function () {
       

    $('#dictionarySearch').on('click', function () {

        let searchWord = $('#dictionaryWord').val().trim();

        if (/\s/.test(searchWord) ) { //add or for if a number or unfound word was entered
            alert("error!!!!")
            // It has any kind of whitespace
        } else {


        const queryURL = 'https://cors-anywhere.herokuapp.com/https://od-api.oxforddictionaries.com/api/v1/entries/en/' + searchWord;

        $.ajax({
            url: queryURL,
            method: 'GET',
            headers: {
                "Accept": "application/json", 'app_id': "c568d91b", 'app_key': "6af662dae9c81b4e19d1dcea9a92ceb3",
            }
            }).then(function(response) {
                console.log(response);
                $('#dictionaryDefinition').text(response.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]);
                console.log(searchWord);
                callGoogle();
            });
        };    
    });
    


    function callGoogle () {

        $.ajax({ 
            url: 'https://cors-anywhere.herokuapp.com/https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=AIzaSyDVDrFjmbXqxXuGM4oY4Gb8CAxso7ZKFOQ', 
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                input: {
                text: $('#dictionaryDefinition').text(),
                },
                voice: {
                languageCode: 'en-US',
                name: "en-US-Wavenet-D"
                },
                audioConfig: {
                audioEncoding: 'MP3'
                }
            })
        }).then(function(res) { 
            console.log(res) 
            console.log('data:audio/mp3;base64,' + res.audioContent);
            $('audio').attr('src', 'data:audio/mp3;base64,' + res.audioContent);
        });
    };    
        // .catch(function(arg1, arg2) { console.log(arg1, arg2) })
});