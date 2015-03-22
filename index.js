/**
* Déclaration des modules
**/
var curl = require('curl');
var jsdom = require("jsdom");
var fs = require('fs');


//entry point
parsingListeAdds("http://www.leboncoin.fr/ventes_immobilieres/offres/rhone_alpes/?f=a&th=1&sqs=1&ros=4&location=Lyon%2069003");


/**
* Fonction qui cherche les annonces disponible depuis une URL
**/
function parsingListeAdds(URL){
  console.log("Analyse depuis l'URL : "+URL);
  //recupre la liste des annonces disponible sur cette URL
  curl.get(URL, null, function(err, response, data){
    //on enleve les espaces et on analyse le DOM html obtenu
    data = data.fulltrim();
    jsdom.env(
      data,
      ["http://code.jquery.com/jquery.js"],
      function (errors, window) {
        //pour chaque annonces trouvés on recupere l'url
        //vers l'annonce afin de récupérer leur contenu
        window.$(".list-lbc a").each(function () {
          theAdd = window.$(this).attr("href");
          console.log(theAdd);
          sleep(500);
          viewAndParsingAdd(theAdd);
        });
      }
    );
  });
}

/**
* Fonction qui retourne une annonce auquel on extrait des informations precisent
**/
function viewAndParsingAdd(URL){
  //recupre l'annonce disponible sur cette URL
  curl.get(URL, null, function(err, response, data){
    //on enleve les espaces et on analyse le DOM html obtenu
    data = data.fulltrim();
    jsdom.env(
      data,
      ["http://code.jquery.com/jquery.js"],
      function (errors, window) {
        var add = {};
        //on recupere les informations de l'annonce
        window.$(".lbcParams table tbody tr td").each(function(index) {
          valeur = window.$(this).text();
          if(index === 0){
            add.price = valeur;
          }else if(index === 1){
            add.city = valeur;
          }else if(index === 2){
            add.cp = valeur;
          }else if(index === 3){
            add.costAgency = valeur;
          }else if(index === 4){
            add.type = valeur;
          }else if(index === 5){
            add.nbRoom = valeur;
          }else if(index === 6){
            add.surface = valeur;
          }else if(index === 7){
            add.ref = valeur;
          }else if(index === 8){
            //add.ges = window.$("a").text();
          }else if(index === 9){
            //add.energy = window.$("a").text();
          }
        });
        console.log(JSON.stringify(add));
      }
    );
  });
}

/**
* Fonction qui réalise un trim sur une chaîne de caractéres
**/
String.prototype.fulltrim=function(){
  return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
};


/**
* Fonction qui sleep l'application pour quelques minisecondes
**/
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
