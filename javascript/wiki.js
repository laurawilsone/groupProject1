
$(document).ready(function () {
       

    $('#wikiSearch').on('click', function () {
        event.preventDefault();

        let wikiSearchWord = $('#wikiWord').val().trim();

        // /\s/.test(searchWord) || 
        if (/^[a-zA-Z ]*$/.test(wikiSearchWord) == false) { //add or for if a number or unfound word was entered
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
            
        const queryURL = 'https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?format=json&formatversion=2&action=query&prop=extracts&exintro=&explaintext=&redirects=1&titles=' + wikiSearchWord;

        $.ajax({
            url: queryURL,
            method: 'GET',
            }).then(function(response) {
                console.log(response);

                //check if definition exists otherwise do error word not found

                $('#wikiDefinition').text(response.query.pages[0].extract);

                // var newWord = {
                //     word: searchWord,
                //     time: moment().format('MMMM Do YYYY, h:mm:ss a')
                // }

                // database.ref().push(newWord);

                // callGoogle();
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
    
});    