/**
* Déclaration des modules
**/
var curl1 = require('curl');
var curl2 = require('curl');
var jsdom = require("jsdom");


//entry point
parsingListeAdds("http://www.leboncoin.fr/ventes_immobilieres/offres/rhone_alpes/?f=a&th=1&sqs=1&ros=4&location=Lyon%2069003");

/**
* Fonction qui cherche les annonces disponible depuis une URL
**/
function parsingListeAdds(URL){
  console.log("Analyse depuis l'URL : "+URL);
  //recupre la liste des annonces disponible sur cette URL
  curl1.get(URL, null, function(err, response, data){
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
  sleep(1500);
  //recupre l'annonce disponible sur cette URL
  curl2.get(URL, null, function(err, response, data){
    //on enleve les espaces et on analyse le DOM html obtenu
    data = data.fulltrim();
    indice = 0;
    jsdom.env(
      data,
      ["http://code.jquery.com/jquery.js"],
      function (errors, window) {
        var add = {};
        //on recupere les informations de l'annonce
        window.$(".lbcParams tr").each(function(index) {
          key = window.$("th").eq(indice).text();
          valeur = window.$("td").eq(indice).text();
          //console.log(key+" "+valeur+" indice "+indice);
          if( key !== null && valeur !== null)
          {
            if(key.indexOf("Prix") > -1){
              valeur = valeur.replace("★ Urgent","").replace("€","").replace(" ","");
              add.price = valeur;
            }
            if(key.indexOf("Ville") > -1){
              add.city = valeur;
            }
            if(key.indexOf("Code postal") > -1){
              add.cp = valeur;
            }
            if(key.indexOf("Frais d'agence inclus") > -1){
              add.costAgency = valeur;
            }
            if(key.indexOf("Type de bien") > -1){
              add.type = valeur;
            }
            if(key.indexOf("Pièces") > -1){
              add.nbRoom = valeur;
            }
            if(key.indexOf("Surface") > -1){
              valeur = valeur.replace("m2","").replace(" ","");
              add.surface = valeur;
            }
            if(key.indexOf("Réfèrence") > -1){
              //add.ref = valeur;
            }
            if(key.indexOf("GES") > -1){
              //add.ges = window.$("a").text();
            }
          }
          indice++;
        });
        indice = 0;
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
