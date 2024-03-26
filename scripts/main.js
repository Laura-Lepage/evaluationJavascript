//Hello Olivier (haha je suis sûr que tu ne t'attendais pas à un petit message d'accueil), juste pour te dire que l'incrémentation de mon panier part en cacahuètes quand sur la même ligne je passe d'un bouton à l'autre et aussi l'équipe choisie se modifie en fonction du dernier bouton cliqué... je pète un mini câble... haha... si jamais tu peux m'expliquer c'est quoi le problème à la correction... Je te remercie 😁

// == Variables ==
// ===============

const matchWrapper = document.querySelector(".matchWrapper")
const match = document.querySelector(".match")
const imageRandom = document.querySelector(".imageRandom")
const buttons = document.querySelectorAll(".btn")
const yourBetsTitle = document.querySelector(".yourBetsTitle")
const yourBets = document.querySelector(".yourBets")
const yourBetsAdd = document.querySelector(".yourBetsAdd")
const coteTotaleDiv = document.querySelector(".coteTotale")
const GainPotentielDiv = document.querySelector(".gainPotentiel")
let inputNumber = document.querySelector("#mise")
let count = 0
let betValueTable = []


// == Functions ==
// ===============

// Fonction pour mettre à jour le contenu de la class coteTotale
function updateCoteTotale(){
  // Initialise le total à 1 pour la multiplication
  let total = 1
  // Multiplie chaque élément du tableau
  betValueTable.forEach(function(betValue){
      total *= parseFloat(betValue)
  })
  // Retourne le total calculé avec 2 décimales
  return total.toFixed(2)
}

// Fonction qui vérifie l'état du compteur du "panier" et ajoute/supprime la class active qui permet de faire monter/descendre le panier
function emptyBets(div){
  if (count === 0){
   div.classList.remove("active")
 } else {
   div.classList.add("active")
 }
}

// Utilisation d'une api avec un fichier local
fetch(`scripts/datas.json`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    // création d'une fonction pour afficher les matchs
    function displayMatchs() {
      // Parcourir chaque match dans les données
      data.matchs.forEach(function(singleMatch){
        // Affichage de chaque match par injection HTML dans le conteneur voulu + donne un index à chaque bouton pour identifer équipe à domicile/match nul/équipe extérieure
        matchWrapper.innerHTML += 
        `
          <div class="match" data-id="${singleMatch.match_id}">
            <div>${singleMatch.hometeam} - ${singleMatch.awayteam}</div>
            <div class="buttons">
              <button class="btn" data-index="1">${singleMatch.home_odd}</button>
              <button class="btn" data-index="0">${singleMatch.draw_odd}</button>
              <button class="btn" data-index="2">${singleMatch.away_odd}</button>
            </div>
          </div>
        `
      })
    }
    // Appel de la fonction pour afficher les matchs une fois les données récupérées
    displayMatchs()
  })
  .catch(error => {
    console.log("Erreur lors de la récupération des données :", error)
  })


// == Code ==
// ==========

// Lancement d'un évenement click dans le conteneur matchWrapper
matchWrapper.addEventListener('click', function(e) {
  // Réinitialise le tableau betValueTable
  betValueTable = []
  // on vérifie si le button cliqué a la class btn
  if (e.target.classList.contains("btn")){
    // on stocke le bouton cliqué dans une variable
    const clickedButton = e.target
    // on récupère tous les autres boutons du même conteneur que le bouton cliqué
    const otherButtons = clickedButton.parentElement.querySelectorAll('.btn')
    // on parcourt tous les autres boutons
    otherButtons.forEach(function(button) {
      // on vérifie si le bouton n'est pas le bouton cliqué
      if (button !== clickedButton) {
        // Si ce n'est pas le bouton cliqué, on retire la classe "activeButton"
        button.classList.remove("activeButton")
      }
    })
    // Vérifie si le bouton cliqué a déjà la classe "activeButton"
    const isActive = clickedButton.classList.contains("activeButton")
    // Si le bouton est déjà actif, décrémente le compteur, sinon, incrémente le compteur
    count += isActive ? -1 : 1;
    // Met à jour le titre "Your Bets" avec le compteur
    yourBetsTitle.innerHTML = `Your Bets (${count})`
    // Ajoute ou retire la classe "activeButton" du bouton cliqué
    clickedButton.classList.toggle("activeButton")
    // Vide la div yourBetsAdd avant d'ajouter de nouveaux éléments
    yourBetsAdd.innerHTML = ''
    // Parcours tous les boutons avec la classe activeButton
    document.querySelectorAll('.btn.activeButton').forEach(button =>{
      // Récupère la valeur du bouton
      const betValue = button.textContent
      // Ajout de betValue au tableau betValueTable
      betValueTable.push(betValue)
      // Récupère les informations sur le match correspondant
      const betMatch = button.parentElement.previousElementSibling.textContent
      // Récupère l'attribut data-id du parent (match) de ce bouton
      const matchId = button.closest('.match').getAttribute('data-id')

      // Ajout du nom de l'équipe en fonction du data-index du bouton cliqué
      let teamName = ''
      // Si le data-index = "1", le nom de l'équipe est le premier élément du texte du match
      if (clickedButton.dataset.index === "1"){
        teamName = `${betMatch.split(' - ')[0]}`
      } 
      // Si le data-index = "0", c'est un match nul
        else if (clickedButton.dataset.index === "0"){
        teamName = "Match Nul"
      } 
      // Si le data-index = "2", le nom de l'équipe est le deuxième élément du texte du match
      else if (clickedButton.dataset.index === "2"){
        teamName = `${betMatch.split(' - ')[1]}`
      }
       
      // Affichage des détails des paris dans le conteneur voulu
      yourBetsAdd.innerHTML += 
      `
        <div class="yourBetsAddDiv" data-index="${betValueTable.length-1}" data-id="${matchId}">
          <div class="matchDiv">
            <div class="teamName">${teamName}</div>
            <div>${betValue}<button class="cross">🗑️</button></div>
          </div>
          <div>${betMatch}</div>  
        </div> 
      `
    })
    console.log(betValueTable)

    //vérification de l'état du "panier"
    emptyBets(yourBets)

    coteTotaleDiv.innerHTML = `${updateCoteTotale()}`

    let inputNumberValue = inputNumber.value
    let coteTotaleGainValue = parseFloat(coteTotaleDiv.textContent)
    let gainPotentiel = inputNumberValue*coteTotaleGainValue

    GainPotentielDiv.innerHTML = `${gainPotentiel.toFixed(2)} €`
  }

})

//Ajout d'un évenement quand on opère un changement sur input number
inputNumber.addEventListener('change', function(){
  let inputNumberValue = inputNumber.value
  let coteTotaleGainValue = parseFloat(coteTotaleDiv.textContent)
  let gainPotentiel = inputNumberValue*coteTotaleGainValue

  GainPotentielDiv.innerHTML = `${gainPotentiel.toFixed(2)} €`

})

// Ajout d'un écouteur d'événements aux boutons "cross"
yourBetsAdd.addEventListener('click', function(e) {
  // Vérifie si l'élément cliqué est un bouton avec la classe "cross"
  if (e.target.classList.contains("cross")){
    // Récupère le parent de l'élément cliqué (la div yourBetsAddDiv)
    const parentDiv = e.target.closest('.yourBetsAddDiv')
    // Si le parent est trouvé, supprime-le
    if (parentDiv) {
      // Recherche de l'index de la valeur à supprimer dans le tableau betValueTable
      //obtenir l'index de l'élément ciblé
      const index = parseInt(parentDiv.getAttribute("data-index"))
      //supprimer la ligne de cet index dans le tableau, 1 élément
      betValueTable.splice(index,1)
      // Récupère l'attribut data-id de la div supprimée
      const removedMatchId = parentDiv.getAttribute("data-id")
       // Supprime la div yourBetsAddDiv correspondante
      parentDiv.remove()

      //mettre à jour les valeurs de data-index
      //on récupère toutes les div
        const listItems = yourBetsAdd.querySelectorAll(".yourBetsAddDiv");
        listItems.forEach(function(item, i){
            item.setAttribute("data-index", i)
        })

      // Décrémente le compteur
      count--
      // Met à jour le titre "Your Bets" avec le compteur
      yourBetsTitle.innerHTML = `Your Bets (${count})`

      console.log(betValueTable)

      // Met à jour la cote totale
      coteTotaleDiv.innerHTML = `${updateCoteTotale()}`


      // Parcourir tous les matchs dans matchWrapper
      document.querySelectorAll('.match').forEach(match => {
        // Récupérer l'attribut data-id de ce match
        const matchId = match.getAttribute('data-id')
        // Si l'attribut data-id du match correspond à celui de la div supprimée
        if (matchId === removedMatchId){
            // Désactiver tous les boutons dans ce match
            match.querySelectorAll('.btn.activeButton').forEach(button =>{
                button.classList.remove("activeButton")
            })
        }
      })
    }
    
  }
  //vérification état du "panier"
  emptyBets(yourBets)
})


// == Gestion du fond d'image aléatoire ==
// =======================================

// Création d'un tableau contenant les images
const imagesTable = ['bg1.png', 'bg2.png', 'bg3.png']

// Sélection aléatoire d'une image
const randomImage = imagesTable[Math.floor(Math.random() * imagesTable.length)]

// Injection de l'image aléatoire dans sa div "imageRandom"
imageRandom.innerHTML = `<img src="images/${randomImage}" alt="">`


// == Dark Mode ==
// ===============

// Déclaration des variables utiles pour le DarkMode
let iconDarkMode = document.querySelector(".iconDarkMode")
let body = document.querySelector("body")
let leftPart = document.querySelector(".leftPart")
let principalNav = document.querySelector(".principalnav")

// Événement click sur l'icône Dark Mode
iconDarkMode.addEventListener('click', function(){
  // Ajout/suppression de la class darkMode au click
  body.classList.toggle("darkMode")
  
  // Enregistrement du mode actuel dans le localStorage
  let currentMode = body.classList.contains("darkMode")
  localStorage.setItem('mode', currentMode)
  
  // Application des styles en fonction du mode
  if (currentMode) {
    iconDarkMode.innerHTML = `<i class="fa-solid fa-sun"></i>`
    leftPart.style.backgroundColor = '#f1667d'
    yourBetsTitle.style.backgroundColor = '#f1667d'
  } else {
    iconDarkMode.innerHTML = `<i class="fa-solid fa-moon"></i>`
    leftPart.style.backgroundColor = ''
    yourBetsTitle.style.backgroundColor = ''
  }
})

// Au chargement/actualisation de la page
window.addEventListener('load', function(){
  // Récupération du mode enregistré dans le localStorage
  let savedMode = localStorage.getItem('mode')
  // Vérification si le mode enregistré est "true"
  if (savedMode === "true") { 
    body.classList.add("darkMode")
    iconDarkMode.innerHTML = `<i class="fa-solid fa-sun"></i>`
    leftPart.style.backgroundColor = '#f1667d'
    yourBetsTitle.style.backgroundColor = '#f1667d'
  }
})



 




