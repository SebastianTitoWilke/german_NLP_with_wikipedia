<?php header('Access-Control-Allow-Origin: *'); ?>
<!DOCTYPE html>
<meta charset="utf-8">
<script src="nlp.js"></script>
<script src="nlptool.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.min.js" integrity="sha512-ykZ1QQr0Jy/4ZkvKuqWn4iF3lqPZyij9iRv6sGqLRdTPkY69YX6+7wvVGmsdBbiIfN/8OdsI7HABjvEok6ZopQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap-grid.min.css" integrity="sha512-i1b/nzkVo97VN5WbEtaPebBG8REvjWeqNclJ6AItj7msdVcaveKrlIIByDpvjk5nwHjXkIqGZscVxOrTb9tsMA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<style>

    button {
        background-color: #222;
        color: #fff;
        padding: 10px;
        margin: 10px;
        font-size: 1em;
        border: 1 solid #000;
        border-radius: 5px;
        box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);
        -webkit-box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);
        -moz-box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);
        font-weight: bold;
    }

    input {
        background-color: #fff;
        color: #000;
        padding: 10px;
        margin: 10px;
        font-size: 1em;
        border: 1 solid #000;
        border-radius: 5px;        
        box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);
        -webkit-box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);
        -moz-box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);       
        font-weight: bold; 
    }

    body {
        padding: 25px;
        margin: 0 auto;
        box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);
        -webkit-box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);
        -moz-box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);        
        background-color: #333;
        color: #fff;
    }

    .output {
        border: 1px solid #fff;
        box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);
        -webkit-box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);
        -moz-box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);        
        background-color: black;
        border-radius: 5px;
        word-break: break-all!important;
        padding: 15px;
        width: 95%;
        white-space: normal!important;
        color: green;
    }

    pre {
        white-space: pre-wrap;       /* Since CSS 2.1 */
        white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
        white-space: -pre-wrap;      /* Opera 4-6 */
        white-space: -o-pre-wrap;    /* Opera 7 */
        word-wrap: break-word;       /* Internet Explorer 5.5+ */
    }

    .loading {
        position:relative;
        top: 10px;
        display: none;
    } 



</style>
<body>

<div class="container">
    <div class="row">   
        <div class="col-md-12"> 
            <h2>NLPTool</h2>
        </div>
    </div>
    <div class="row">   
        <div class="col-md-12"> 
            <button class="btn" onclick="recog()">Hören</button>
            <button class="btn" onclick="speak()">Sprechen</button>
        </div> 
    </div>
    <div class="row">    
        <div class="col-md-6">              
            <input class="form-control" id="input" placeholder="Ein Satz ..." type="text">        
            <button class="btn" onclick="send()">Sende Text</button>            
        </div> 
        <div class="col-md-4">           
            <input class="form-control" id="wiki" placeholder="Begriff" type="text">
            <button class="btn wiki_load_button" onclick="loadWiki()">Load Wiki</button>
        </div>
        <div class="col-md-2">           
            <div class="loading"><img src="loading.gif" width="40"/></div> 
        </div>        
    </div>
    <div class="row" style="margin-top: 25px;">        
        <div class="col-md-12 output"> 
            <h3>Zum Innenleben</h3>
            <h4>Output:</h4>
            <div id="output"></div></br>
            <button class="btn daten_zeige_button" onclick="zeigeDaten()">Daten zeigen</button>            
            <button class="btn daten_versteck_button" style="display: none;" onclick="versteckeDaten()">Daten schließen</button>            
            <h4>Daten:</h4>
            <pre class="zeige_daten" style="display: none;" id="data"></pre>
            <button class="btn speicher_zeige_button" onclick="zeigeSpeicher()">Speicher zeigen</button>            
            <button class="btn speicher_versteck_button" style="display: none;" onclick="versteckeSpeicher()">Speicher schließen</button>             
            <h4>Speicher:</h4>
            <pre class="zeige_speicher" style="display: none;" id="speicher"></pre>
        </div>
    </div>
</div>
</body>
<script>

    var grammatik;
    var antwort = "";

    function dump(obj) {
        var out = JSON.stringify(obj, undefined, "\t");
        return out;
    }

    function zeigeDaten() {
        document.querySelector('.zeige_daten').style = 'display: block';
        document.querySelector('.daten_zeige_button').style = 'display: none';
        document.querySelector('.daten_versteck_button').style = 'display: block';
    }

    function versteckeDaten() {
        document.querySelector('.zeige_daten').style = 'display: none';
        document.querySelector('.daten_zeige_button').style = 'display: bock';
        document.querySelector('.daten_versteck_button').style = 'display: none';
    }

    function zeigeSpeicher() {
        document.querySelector('.zeige_speicher').style = 'display: block';
        document.querySelector('.speicher_zeige_button').style = 'display: none';
        document.querySelector('.speicher_versteck_button').style = 'display: block';
    }

    function versteckeSpeicher() {
        document.querySelector('.zeige_speicher').style = 'display: none';
        document.querySelector('.speicher_zeige_button').style = 'display: bock';
        document.querySelector('.speicher_versteck_button').style = 'display: none';
    }

    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    recognition.onstart = function() {
        console.log("We are listening. Try speaking into the microphone.");
        document.querySelector('#output').innerHTML = "<b>We are listening. Try speaking into the microphone ...</br>";
    };

    recognition.onspeechend = function() {
        // when user is done speaking
        recognition.stop();
    }

    var NLPTool = new NLPTool();

    function botCall(transcript, confidence) {
        grammatik = {"satz" : transcript, "w" : confidence, "nlp": NLPTool.satz_nlp(transcript)};
        console.log("Satz: "+transcript);
        console.log("Confidence "+confidence);
        console.log("Grammatik");
        console.log(grammatik);    
        console.log("NLP")
        console.log(NLPTool.satz_nlp(transcript));
        console.log("Satzmodus: "+NLPTool.gebeSatzmodus(grammatik));
        console.log("1. Verb - Pos "+NLPTool.gebePositionDesErstenVerbesimSatz(grammatik));
        console.log("SatzSplitter");
        console.log(NLPTool.SatzSplitter(grammatik));
        antwort = transcript; 
        if(NLPTool.SatzSplitter(grammatik) !== false) {
            var base = NLPTool.SatzSplitter(grammatik);
            var A = NLPTool.SatzSplittImploder(base.A);
            var Verb = NLPTool.SatzSplittImploder(base.Verb);
            var B = NLPTool.SatzSplittImploder(base.B);
            console.log("A: "+A);
            console.log("Verb: "+Verb);
            console.log("B: "+B);
            document.querySelector('#output').innerHTML += "</br><b>A: </b>"+A;
            document.querySelector('#output').innerHTML += "</br><b>Verb: </b>"+Verb;
            document.querySelector('#output').innerHTML += "</br><b>B: </b>"+B;
            document.querySelector('#output').innerHTML += "</br><b>Satzmodus: </b>"+NLPTool.gebeSatzmodus(grammatik);
            if(NLPTool.gebeSatzmodus(grammatik) === "Objektion") {
                if(!NLPTool.sindDieInformationenBekannt(grammatik)) {
                    NLPTool.speichereObjektionen(grammatik);     
                    document.querySelector('#output').innerHTML += "</br>... gespeichert"+"</br>";
                    console.log(NLPTool.objektionen);
                } else {
                    antwort = "Das sagtest du";
                    document.querySelector('#output').innerHTML += "<b>Antwort:</b>"+antwort;
                }       
                console.log("Negationsbildung");
                document.querySelector('#output').innerHTML += "<b>Negation: </b>"+NLPTool.Negationsbildung(grammatik);
                console.log(NLPTool.Negationsbildung(grammatik));
                console.log("Konjunktionenbildung");
                console.log(NLPTool.ersetzeDisjunktionenDurchDisjunktionsjunktor(NLPTool.ersetzeVergleichsopferatorenDurchGleichsetzungsoperator(NLPTool.ersetzeNegationenDurchNegationsjunktor(NLPTool.ersetzeKonjunktionenDurchKonjunktionsjunktor(transcript)))));  
                console.log("NegationsZeichenbildung");
                console.log(NLPTool.ersetzeNegationenDurchNegationsjunktor(NLPTool.ersetzeKonjunktionenDurchKonjunktionsjunktor(transcript)));
                console.log("Vergleichoperatorenbildung");
                console.log(NLPTool.ersetzeVergleichsopferatorenDurchGleichsetzungsoperator(NLPTool.ersetzeNegationenDurchNegationsjunktor(NLPTool.ersetzeKonjunktionenDurchKonjunktionsjunktor(transcript))));  
                console.log("Disjunktionenbildung");
                console.log(NLPTool.ersetzeDisjunktionenDurchDisjunktionsjunktor(NLPTool.ersetzeVergleichsopferatorenDurchGleichsetzungsoperator(NLPTool.ersetzeNegationenDurchNegationsjunktor(NLPTool.ersetzeKonjunktionenDurchKonjunktionsjunktor(transcript)))));  
                if(NLPTool.Objektionswiderspruch(grammatik) === true) {
                    console.log("Widerspruch");
                    document.querySelector('#output').innerHTML += "</br><b>Widerspruch/Antwort: </b></br>";
                    antwort = NLPTool.gebeWiderspruch(grammatik);
                    document.querySelector('#output').innerHTML += antwort;
                }     
            }

            if(NLPTool.gebeSatzmodus(grammatik) === "Interrogation") {
                console.log("Antwort");
                var antwort_arr = NLPTool.beantworteFrage(transcript, grammatik);
                console.log(antwort_arr);
                document.querySelector('#output').innerHTML += "</br><b>Anworten-Array:</b>"+dump(antwort_arr);
                console.log("Enthält Rechnung "+NLPTool.enthaeltRechnung(grammatik.satz));
                document.querySelector('#output').innerHTML += "</br><b>Enthält Rechnung: </b>"+NLPTool.enthaeltRechnung(grammatik.satz);
                if(NLPTool.enthaeltRechnung(grammatik.satz)) {
                    console.log("Isolierte Rechnung "+NLPTool.isoliereRechnung(grammatik));
                    document.querySelector('#output').innerHTML += "</br><b>Isolierte Rechnung: </b>"+NLPTool.isoliereRechnung(grammatik);
                    antwort = NLPTool.beantworteRechnung(NLPTool.isoliereRechnung(grammatik));
                } else {
                    antwort = NLPTool.naturalImplode(antwort_arr, " ", "und");            
                }
                console.log(antwort);
            }
            document.querySelector('#output').innerHTML = "<b>Programm hörte: </b>"+transcript+"</br>";
            document.querySelector('#output').innerHTML += "<b>Confidence: </b>"+confidence+"</br>";
            document.querySelector('#data').innerHTML += "<b>Grammatik-JSON</b>: </br>";
            document.querySelector('#data').innerHTML = syntaxHighlight(grammatik)+"</br>";
            document.querySelector('#speicher').innerHTML = syntaxHighlight(NLPTool.objektionen)+"</br>";
            document.querySelector('#output').innerHTML += "<b>Antwort: </b>"+antwort;
        }
    }

    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        var confidence = event.results[0][0].confidence;
   /*     var Hypomnema = [{
            "Unix-Zeit" : "",
            "Sprecher-ID" : "Ghost",
            "Satzmodus" : "Objektion",
            "Satz-NLP" : "",
            "Satz" : "Ich bin ein Programm"
        }]; */
        document.querySelector('#input').value = transcript;
        botCall(transcript, confidence);
    }

    function send() {
        var transcript = document.getElementById("input").value;
        botCall(transcript, 1);
    } 

    function recog() {
        recognition.start();
    }

    // Original
    function encode_utf8( s ) {
      return unescape( encodeURIComponent( s ) );
    }

    function decode_utf8( s ) {
      return decodeURIComponent( escape( s ) );
    }

    function loadWiki() {
        var thema = document.getElementById("wiki").value;   
		var antwort = [];
		var satz_array = [];		
        document.querySelector('.loading').style = 'display: block';
        //https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles="+encodeURI(thema)
        fetch("https://de.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*&titles="+encodeURI(thema), {
        method: 'get'
        }).then(function(response){return response.json();}).then(function(response) {
            document.querySelector('.loading').style = 'display: none';
            console.log("wiki");
            console.log(response);
			var extract = response.query.pages; // Verarbeiten Sie die Ausgabe, um die Bildnamen zu erhalten
			Object.keys(extract).forEach(function(key) {
				console.log(extract[key].extract);
				antwort.push(extract[key].extract);
			});

			if(antwort.length > 0) {
				//satz_array = antwort[0].replace(/(?:\r\n|\r|\n)/, ' ').replace(/( es |Es | sie |Sie | er |Es )/, " "+thema+" ").replace(/\(.*?\)/, '').split(/(\. | und | oder)/);
				satz_array = antwort[0].replace(/(?:\r\n|\r|\n)/, ' ').replace(/(Es\s|Er\s|Sie\s)/, thema+" ").replace(/(\ser\s|\ssie\s|\ses\s)/, " "+thema+" ").replace(/\(.*?\)/, '').replace(/(\s\s|\s\s\s)/, ' ').trim().split(/(\.|\;)/);
			} 

            if(antwort.length === 0) {
                document.querySelector('#wiki').value = 'Kein Artikel ...';
            }
			console.log("Satzarray");
			console.log(satz_array);

			if(satz_array.length > 0) {
				for(var i= 0; satz_array.length; i++) {
					if(!satz_array[i].match(/(\n|\r)/) && satz_array[i] != "")
					botCall(satz_array[i], 1);
				}
			} 
        }).then(function() {
            document.querySelector('.loading').style = 'display: none';
        }).catch(function(err) {
            console.log(err);
        }); 
    }

    var satz = "Otto wählt weise und seine Oma sieht zu";

    function speak() { 
        var msg = new SpeechSynthesisUtterance();
        msg.text = antwort;
        msg.lang = 'de-DE';
        msg.volume = 1; // 0 to 1
        msg.rate = 1; // 0.1 to 10
        msg.pitch = 2; //0 to 2

        msg.onend = function(e) {
            // document.querySelector('#output').innerText += "Antwort: " + antwort + " " + (event.elapsedTime/1000) + ' Sek';
        };
        console.log('speak');
        speechSynthesis.speak(msg);  

      }

    function toText(arr) {
        const recur = ({Item, Children}) => Item?.Name + 
            (Children?.length ? "\n" + Children.map(recur).map((text, i, {length}) =>
                i < length-1 ? "├──" + text.replace(/\n/g, "\n│  ")
                            : "└──" + text.replace(/\n/g, "\n   ")
            ).join("\n") : "")
        return arr.map(recur).join("\n");
    }

    function syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }    

    

    

</script>

</body>