var NLPTool = class  {
    constructor() {
    }

    objektionen = [];
    kommutativeVerbenRegex = /(bin|bist|ist|sind|seid)/;

    speichern(Satz) {
        Hypomnema.push({
            "Unix-Zeit" : "",
            "Sprecher-ID" : "",
            "Satzmodus" : gebeSatzmodus(Satz),
            "Satz-NLP" : satz_nlp(satz),
            "Satz" : ""
        });
    }

    Satzmodus_Array(grammatik) {
        var modi = [];
        if(grammatik.nlp[0].wortarten.length > 0) {
            for(var i = 0; i < grammatik.nlp[0].wortarten.length; i++) {
                if(typeof grammatik !== undefined && grammatik.nlp[0].wortarten[i].match(/(PWS|PWAV|VAFIN|VVFIN|VMFIN|KOKOM|PTKZU)/)) modi.push("Interrogation");  
                if(typeof grammatik !== undefined && grammatik.nlp[0].wortarten[i].match(/(VVIMP)/)) modi.push("Imperativ"); 
                if(typeof grammatik !== undefined && !grammatik.nlp[0].wortarten[i].match(/(VVIMPPWS|PWAV|PRELS|VAFIN|VVFIN|VMFIN|KOKOM)/)) modi.push("Objektion");
            }
        } else {
            modi.push("unbestimmt");
        }
        return modi;
    }

    enthaeltModus(Modus, Modi) {
        var check = false;
        for(var i = 0; i < Modi.length; i++) {
            if(Modi[i] === Modus) {
                check = true;
            } 
        }
        return check;
    }

    gebeSatzmodus(grammatik) { 
        var Modi = NLPTool.Satzmodus_Array(grammatik);
        if(Modi !== undefined && Modi[0] !== "unbestimmt") {
            if(Modi !== undefined && Modi.length > 1 && NLPTool.enthaeltModus("Imperativ", Modi)) {
                return "Imperativ";
            } else if(!NLPTool.enthaeltModus("Interrogation",  Modi)) {
                return "Objektion";
            } else {
                return "Interrogation";
            }
        }  else {
            return "unbestimmt";
        }  
    }

    naturalImplode(einfachesArray, Verknuepfung, Verknuepfungslogik) {
        var str = "";
        var stopper = einfachesArray.length-1;
        for(var i = 0; i < stopper; i++) {
            str += einfachesArray[i]+Verknuepfung;
        }

        if(stopper === 0) {
            str += Verknuepfung+einfachesArray[0];
        }

        if(einfachesArray.length > 1) {
            str += Verknuepfungslogik+" "+einfachesArray[stopper];
        }
        return str; 

    }   

    enthaeltRechnung(Satz) {
        Satz = String(Satz);
        if(Satz.match(/(\d)/) && Satz.match(/(\+|\s\-\s|\s\x\s|\/|durch|plus|mal)/)) {
            return true;
        } else {
            return false;
        }
    }

    beantworteRechnung(Rechnungsstring) {
        Rechnungsstring = String(Rechnungsstring);
        if(typeof Rechnungsstring === "string") {
            return String(eval(Rechnungsstring.replaceAll("x", "*").replaceAll("mal", "*").replaceAll("plus", "+").replaceAll("durch", "/").replaceAll("pi", Math.PI).replaceAll("PI", Math.PI))).replaceAll(".", ",");
        } else {
            return false;
        }
    }

    isoliereRechnung(grammatik) {
        if(NLPTool.enthaeltRechnung(grammatik.satz) && NLPTool.SatzSplitter(grammatik) !== false && NLPTool.enthaeltRechnung(NLPTool.SatzSplittImploder(NLPTool.SatzSplitter(grammatik).A))) {
            return NLPTool.SatzSplittImploder(NLPTool.SatzSplitter(grammatik).A);  
        } 

        if(NLPTool.enthaeltRechnung(grammatik.satz) && NLPTool.SatzSplitter(grammatik) !== false && NLPTool.enthaeltRechnung(NLPTool.SatzSplittImploder(NLPTool.SatzSplitter(grammatik).B))) {
            return NLPTool.SatzSplittImploder(NLPTool.SatzSplitter(grammatik).B);  
        }           

        if(NLPTool.SatzSplitter(grammatik) === false) {
            return false;
        }     

    }


    beantworteFrage(Frage, grammatik) {

        var antwort = [];

        if(NLPTool.objektionen.length > 0 && NLPTool.gebeSatzmodus(grammatik) === "Interrogation") {
            for(var i = 0; i < NLPTool.objektionen.length; i++) {
                if(NLPTool.objektionen[i].Frage.toLowerCase() === Frage.toLowerCase()) {
                    antwort.push(NLPTool.objektionen[i].Antwort);    
                }
            }
        }
        return antwort;
    }

    implode(einfachesArray, Verknuepfung) {
        var str = "";
        for(var i = 0; i < einfachesArray.length; i++) {
            str += Verknuepfung+einfachesArray[i];
        }
        return str.substr(1, str.length);
    }   

    IstEinNegationsjunktor(begriff) {
        var antwort = false;
        var Junktoren = [
            "nein",
            "nicht",
            "kein",
            "keine",
            "keiner",
            "keinen",
            "keinem",
            "niemand"     
        ];

        for(var i = 0; i < Junktoren.length; i++ ) {
            if(Junktoren[i] === begriff) {
                antwort = true;
            }
        }
    }



    Konjunktionen = [
        " und "
    ];



    ersetzeKonjunktionenDurchKonjunktionsjunktor(Satz) {
        for(var i = 0; i < NLPTool.Konjunktionen.length; i++) {
            Satz = Satz.replaceAll(NLPTool.Konjunktionen[i], " && ");
        }
        return Satz;
    }

    Disjunktionen = [
        " oder "
    ];

    ersetzeDisjunktionenDurchDisjunktionsjunktor(Satz) {
        for(var i = 0; i < NLPTool.Disjunktionen.length; i++) {
            Satz = Satz.replaceAll(NLPTool.Disjunktionen[i], " || ");
        }
        return Satz;
    }


    GleichsetzungOperatoren = [
        " ist ",
        " sind ",
        " bin ",
        " bist ",
        " seid "
    ];

    ersetzeVergleichsopferatorenDurchGleichsetzungsoperator(Satz) {
        for(var i = 0; i < NLPTool.GleichsetzungOperatoren.length; i++) {
            Satz = Satz.replaceAll(NLPTool.GleichsetzungOperatoren[i], " === ");
        }
        return Satz;
    }

    
    Negationsjunktoren = [
        " nicht ",
        " kein ",
        " keine ",
        " keiner ",
        " keinen ",
        " keinem ",                
        " un",
        " Un"
    ];

    ersetzeNegationenDurchNegationsjunktor(Satz) {
        for(var i = 0; i < NLPTool.Negationsjunktoren.length; i++) {
            Satz = Satz.replaceAll(NLPTool.Negationsjunktoren[i], " !");
        }
        return Satz;
    }

    sindDieInformationenBekannt(grammatik) {
        var bekannt = false;
        for(var i = 0; i < NLPTool.objektionen.length; i++) {
            if(NLPTool.objektionen[i].Antwort === "Ja") {
                var A = NLPTool.SatzSplittImploder(NLPTool.SatzSplitter(grammatik).A);
                var Verb = NLPTool.SatzSplittImploder(NLPTool.SatzSplitter(grammatik).Verb);
                var B = NLPTool.SatzSplittImploder(NLPTool.SatzSplitter(grammatik).B);
                if(NLPTool.objektionen[i].Frage === Verb+" "+A+" "+B) {
                    bekannt = true; 
                } 
            }
        }
        return bekannt;
    }


    Negationsbildung(grammatik) {
        var Verneinungen = [];
        if(NLPTool.SatzSplitter(grammatik) !== false && NLPTool.gebeSatzmodus(grammatik) === "Objektion") {
            var A = NLPTool.SatzSplittImploder(NLPTool.SatzSplitter(grammatik).A);
            var Verb = NLPTool.SatzSplittImploder(NLPTool.SatzSplitter(grammatik).Verb);
            var B = NLPTool.SatzSplittImploder(NLPTool.SatzSplitter(grammatik).B);
            if(A !== false && Verb !== false && B !== false) {
                var nichtbeschrieben = false;
                if(!B.match("nicht") && !B.match("kein")) {
                    Verneinungen.push(A+" "+Verb+" nicht "+B);
                    nichtbeschrieben = true;
                } else if(B.match("nicht") && !B.match("kein")) {
                    Verneinungen.push(A+" "+Verb+" "+B.replace("nicht ", ""));
                    nichtbeschrieben = true;
                }

                if(nichtbeschrieben === false && !B.match("kein") && !B.match("nicht")) {

                    Verneinungen.push(A+" "+Verb+" "+B.replace("ein", "kein"));

                } else if(B.match("kein") && !B.match("nicht")) {

                    Verneinungen.push(A+" "+Verb+" "+B.replace("kein", "ein"));
                }
            }
        }
        return Verneinungen;
    }

    Objektionswiderspruch(grammatik) {
        var result = false;
        for(var i = 0; i < NLPTool.objektionen.length; i++) {
            for(var n = 0; n < NLPTool.Negationsbildung(grammatik).length; n++) {
                if(NLPTool.objektionen[i].volleAntwort === NLPTool.Negationsbildung(grammatik)[n]) {
                    result = true;
                }
            }
        } 
        return result;
    }

    istEinWortEinNormalesNomen(wort, grammatik) {
        var arr = [];
        if(word !== "") {
            for(var i = 0; i < grammatik["nlp"].length; i++) {  
                if(wort === grammatik["nlp"][i]["begriff"].toLowerCase() && grammatik["nlp"][i]["begriff"] != "") {
                    arr.push(grammatik["nlp"][i]["wortart"]);
                }
            }
            if(arr.length > 0) {
                for(var i = 0; i < arr.length; i++) {
                    if(arr[i] === 'NN') {
                        return true;
                    }
                }
            }
        }
    }

    reduziereSatzGliedAufNomen(satzglied, grammatik) {
        var worte = satzglied.split(" ");
        var nomen = [];
        for(var i = 0; i < worte.length; i++) {
            if(istEinWortEinNormalesNomen(worte[i], grammatik)) {
                nomen.push(worte[i]);
            }
        }
        return nomen;
    }

    gebeWiderspruch(grammatik) {

        var result = false;

        for(var i = 0; i < NLPTool.objektionen.length; i++) {

            for(var n = 0; n < NLPTool.Negationsbildung(grammatik).length; n++) {

                if(NLPTool.objektionen[i].volleAntwort === NLPTool.Negationsbildung(grammatik)[n]) {

                    result = NLPTool.objektionen[i].volleAntwort+" oder "+grammatik.satz;

                }

            }

        } 

        return result;        

    }



    Objektionswiderspruchsmenge(grammatik) {

       var Verbesserungen = [];

        for(var i = 0; i < NLPTool.objektionen.length; i++) {

            for(var n = 0; n < NLPTool.Negationsbildung(grammatik).length; n++) {

                if(NLPTool.objektionen[i].volleAntwort === NLPTool.Negationsbildung(grammatik)[n]) {

                    Verbesserungen.push(NLPTool.Negationsbildung(NLPTool.objektionen[i].volleAntwort));

                }

            }

        }

        return Verbesserungen; 

    }



    IstEinnatuerlicherJunktor(begriff) {

        var antwort = false;

        var Junktoren = [

            "ja",

            "nein",

            "nicht",

            "kein",

            "keiner",

            "keiner",

            "und",

            "oder",

            "vielleicht",

            "wenn",

            "dann",

            "also",

            "aber",

            "solange"

        ];

        for(var i = 0; i < Junktoren.length; i++ ) {

            if(Junktoren[i] === begriff) {

                antwort = true;

            }

        }

    }



    enthaeltGrammatikKuerzel(kuerzel, kuerzelArray) {

        var check = false;

        for(var i = 0; i < kuerzelArray.length; i++) {

            if(kuerzelArray[i] === kuerzel) {

                check = true;

            }

        }

        return check;

    }



    gebePositionDesLetztenVerbesimSatz(grammatik) {

        var verben_kuerzel = ["VAFIN","VVFIN","VMFIN", "VVIMP"];

        var pos = -1;

        for(var i2 = 0; i2 < grammatik.nlp.length; i2++) {                     

            for(var i1 = 0; i1 < grammatik.nlp[i2].wortarten.length; i1++) {

                for(var i3 = 0; i3 < verben_kuerzel.length; i3++) {                    

                    if(verben_kuerzel[i3] === grammatik.nlp[i2].wortarten[i1]) {

                        pos = i2;

                    }

                }

            }

        }

        return pos;

    }



    gebePositionDesErstenVerbesimSatz(grammatik) {

        var verben_kuerzel = ["VAFIN","VVFIN","VMFIN", "VVIMP"];

        var pos = -1;

		var nomenlos = false;

        for(var i2 = 0; i2 < grammatik.nlp.length; i2++) {                     

            for(var i1 = 0; i1 < grammatik.nlp[i2].wortarten.length; i1++) {

                for(var i3 = 0; i3 < verben_kuerzel.length; i3++) {                    

                    if(verben_kuerzel[i3] === grammatik.nlp[i2].wortarten[i1]) {

                      /*  for(var i = 0; i < grammatik.nlp[i2].wortarten.length; i++) {

							if(grammatik.nlp[i2].wortarten[i].match(/(NE|NN)/)) {

								nomenlos = true;

							}

						}

						if(nomenlos === false) {

							return i2;

						} */

						return i2;



                    }

                }

            }

			nomenlos = false;

        }

        return pos;

    }





    SatzSplitter(grammatik) {

        var Split = {"A": [], "B" :[], "Verb": []};

        var pos = NLPTool.gebePositionDesErstenVerbesimSatz(grammatik);

        if(pos > -1) {

            for(var i1 = 0; i1 < pos; i1++) {

                Split.A.push(grammatik.nlp[i1]); 

            }

            Split.Verb.push(grammatik.nlp[pos]);

            for(var i1 = pos+1; i1 < grammatik.nlp.length; i1++) {

                Split.B.push(grammatik.nlp[i1]);

            }

            return Split;

        } else {

            return false;

        }

    }



    SatzSplittImploder(SatzSplitt) {

        var SatzStueck = "";

        if(typeof SatzSplitt !== undefined && SatzSplitt.length > 0) {

            for(var i1 = 0; i1 < SatzSplitt.length; i1++) {

                SatzStueck += SatzSplitt[i1].begriff+" ";

            }

            if(SatzStueck !== "")

            return SatzStueck.substr(0, SatzStueck.length-1);

        } else {

            return false;

        }

    }





    SatzImploder(grammatik) {

        var SatzStueck = "";

        if(typeof grammatik.nlp !== undefined && grammatik.nlp.length > 0) {

            for(var i1 = 0; i1 < grammatik.nlp.length; i1++) {

                SatzStueck = grammatik.nlp.grammtik.nlp[i1].begriff+" ";

            }

            return SatzStueck.substr(-1);

        } else {

            return false;

        }

    }






    speichereObjektionen(grammatik) {

        if(NLPTool.gebeSatzmodus(grammatik) == "Objektion") {

            var A = NLPTool.SatzSplittImploder(NLPTool.SatzSplitter(grammatik).A);

            var Verb = NLPTool.SatzSplittImploder(NLPTool.SatzSplitter(grammatik).Verb);

            var B = NLPTool.SatzSplittImploder(NLPTool.SatzSplitter(grammatik).B);

//            var Frageworte = ["als was", "warum", "wer", "was", "Wen", "wem", "wann", "wohin", "wo", "woher", "wovon","von wo", "von wem" ,"zu wem", "um wie viel Uhr", "um wie viel", "wie viel", "wie"];
            
            var Frageworte = ["wer", "was", "Wen", "wem", "wann", "wohin", "wo", "woher", "wovon", "von wo", "von wem" ,"zu wem", "um wie viel Uhr", "um wie viel", "wie viel", "wie"];

            NLPTool.objektionen.push( 

                {

                    "Frage" : Verb+" "+A+" "+B,

                    "volleAntwort" : A+" "+Verb+" "+B, 

                    "Antwort": "Ja"    

                }

            );

            NLPTool.objektionen.push( 

                {

                    "Frage" : Verb+" "+A+" "+B.replace('/((D|d)er\s|(D|d)ie\s|(D|d)as\s)/'),

                    "volleAntwort" : A+" "+Verb+" "+B, 

                    "Antwort": "Ja"    

                }

            );            

            for(var i = 0; i < Frageworte.length; i++) {

/*
                if(reduziereSatzGliedAufNomen(B).length === 1) {
                    NLPTool.objektionen.push(

                        {

                            "Frage" : Frageworte[i]+" "+Verb+" "+reduziereSatzGliedAufNomen(B)[0],

                            "volleAntwort" : A+" "+Verb+" "+B,

                            "Antwort": A    

                        }

                    );
                }
*/
                NLPTool.objektionen.push(

                    {

                        "Frage" : Frageworte[i]+" "+Verb+" "+B.replace('/((D|d)er\s|(D|d)ie\s|(D|d)as\s)/'),

                        "volleAntwort" : A+" "+Verb+" "+B,

                        "Antwort": A    

                    }

                );


                NLPTool.objektionen.push(

                    {

                        "Frage" : Frageworte[i]+" "+Verb+" "+B,

                        "volleAntwort" : A+" "+Verb+" "+B,

                        "Antwort": A    

                    }

                );

                NLPTool.objektionen.push(

                    {

                        "Frage" : Frageworte[i]+" "+Verb,

                        "volleAntwort" : A+" "+Verb+" "+B,

                        "Antwort": A    

                    }

                );

                var machen = ["mache", "machst", "macht", "machen"];

                for(var m = 0; m < machen.length; m++) {

                    NLPTool.objektionen.push(

                        {

                            "Frage" : Frageworte[i]+" "+machen[m]+" "+A,

                            "volleAntwort" : A+" "+Verb+" "+B,

                            "Antwort": Verb    

                        }

                    );  

                }

                NLPTool.objektionen.push(

                    {

                        "Frage" : Frageworte[i]+" ist mit "+A,

                        "volleAntwort" : A+" "+Verb+" "+B,

                        "Antwort": Verb    

                    }

                );                  

                NLPTool.objektionen.push(

                    {

                        "Frage" : Frageworte[i]+" "+Verb+" "+A,

                        "volleAntwort" : B+" "+Verb+" "+A,

                        "Antwort": B    

                    }

                );                

                

            }

        }

    }



    satz_nlp(satz) {

        var  satz_arr = satz.split(" ");

        var satz_nlp = [];

        for(var e = 0; e < satz_arr.length; e++) {

            var arr = [];

            for(var i = 0; i < nlp.length; i++) {  

                if(satz_arr[e].toLowerCase() === nlp[i]["begriff"].toLowerCase() && nlp[i]["begriff"] != "") {

                    arr.push(nlp[i]['wortart']);

                }

            }

            satz_nlp.push({"begriff": satz_arr[e], "wortarten" : arr.filter(function(item, pos){ return arr.indexOf(item)== pos; })});

        }     

        return satz_nlp; 

    }



}