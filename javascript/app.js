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
        event.preventDefault();
        let searchWord = $('#dictionaryWord').val().trim();


        console.log(typeof searchWord);
        // || typeof searchWord === "string"

        // /\s/.test(searchWord) || 
        if (/^[a-zA-Z-]*$/.test(searchWord) == false) { //add or for if a number or unfound word was entered
            $("#modal-alert2").iziModal({
                title: "Error!",
                subtitle: 'Please enter only one word. No numbers or symbols',
                icon: 'icon-power_settings_new',
                headerColor: '#BD5B5B',
                width: 600,
                timeout: 5000,
                timeoutProgressbar: true,
                transitionIn: 'fadeInDown',
                transitionOut: 'fadeOutDown',
                pauseOnHover: true,
                autoOpen: true,
            });
            
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

                //check if definition exists otherwise do error word not found

                $('#dictionaryDefinition').text(response.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]);

                var newWord = {
                    word: searchWord,
                    time: moment().format('MMMM Do YYYY, h:mm:ss a')
                }

                database.ref().push(newWord);

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
            $('#pButton').attr('src', 'data:audio/mp3;base64,' + res.audioContent);
        });
    };    
        // .catch(function(arg1, arg2) { console.log(arg1, arg2) })

    
    database.ref().on("child_added", function(snapshot) {

        word = snapshot.val().word;
        time = snapshot.val().time;

        // Log everything that's coming out of snapshot
        console.log(snapshot.val());

        // Change the HTML table to reflect added train
        $('#wordTable').after("<tr><td>" + word + "</td><td>" + time + "</td></tr>");

        // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

});