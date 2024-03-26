// == Variables ==
// ===============

const matchWrapper = document.querySelector(".matchWrapper")
const match = document.querySelector(".match")
const imageRandom = document.querySelector(".imageRandom")
const buttons = document.querySelectorAll(".btn")
let count = 0
const yourBetsTitle = document.querySelector(".yourBetsTitle")
const yourBets = document.querySelector(".yourBets")
const yourBetsAdd = document.querySelector(".yourBetsAdd")
const coteTotaleDiv = document.querySelector(".coteTotale")
const GainPotentielDiv = document.querySelector(".gainPotentiel")
let betValueTable = []


// == Functions ==
// ===============

// Fonction pour mettre à jour la cote totale
function updateCoteTotale() {
  // Initialise le total à 1 pour la multiplication
  let total = 1
  // Multiplie chaque élément du tableau
  betValueTable.forEach(function(betValue) {
      total *= parseFloat(betValue)
  })
  // Retourne le total calculé
  return total.toFixed(2)
}

// fonction qui Vérifie l'état du compteur dans le "panier"
function emptyBets(div){
  if (count === 0){
   div.classList.remove("active")
 } else {
   div.classList.add("active")
 }
}

// function updateGain(){
//   let inputNumber = document.querySelector("#mise")
//   let coteTotaleGainValue = parseFloat(coteTotaleDiv.textContent)

//   return (inputNumber*coteTotaleGainValue).toFixed(2)

// }
fetch(`scripts/datas.json`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    //création d'une fonction pour afficher les matchs
    function displayMatchs() {
      // Parcours de chaque match dans les données
      data.matchs.forEach(function(singleMatch){
        // Affichage de chaque match par injection HTML dans le conteneur voulu + donne un index à chaque bouton pour identifer équipe à domicile/match nul/équipe extérieure
        matchWrapper.innerHTML += 
        `
          <div class="match">
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

matchWrapper.addEventListener('click', function(e) {
  // Réinitialise le tableau betValueTable
  betValueTable = []
  // on vérifie si le button cliqué a la classe "btn"
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
    document.querySelectorAll('.btn.activeButton').forEach(button => {
      // Récupère la valeur du bouton
      const betValue = button.textContent
      // Ajout de betValue au tableau betValueTable
      betValueTable.push(betValue)
      
      // Récupère les informations sur le match correspondant
      const betMatch = button.parentElement.previousElementSibling.textContent

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
        <div class="yourBetsAddDiv" data-index="${betValueTable.length-1}">
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

    let inputNumber = document.querySelector("#mise")
    console.log(inputNumber.value)
    
    let coteTotaleGainValue = parseFloat(coteTotaleDiv.textContent)
    GainPotentielDiv.innerHTML = `Gain Potentiel : ${inputNumber.value*coteTotaleGainValue} €`
  }
  

  
})

// Ajout d'un écouteur d'événements aux boutons "cross"
yourBetsAdd.addEventListener('click', function(e) {
  // Vérifie si l'élément cliqué est un bouton avec la classe "cross"
  if (e.target.classList.contains("cross")) {
    // Récupère le parent de l'élément cliqué (la div yourBetsAddDiv)
    const parentDiv = e.target.closest('.yourBetsAddDiv')
    // Si le parent est trouvé, supprime-le
    if (parentDiv) {
      // Recherche de l'index de la valeur à supprimer dans le tableau betValueTable
      //obtenir l'index de l'élément ciblé
      const index = parseInt(parentDiv.getAttribute("data-index"))
      //supprimer la ligne de cet index dans le tableau, 1 élément
      betValueTable.splice(index,1)
       // Supprime la div yourBetsAddDiv correspondante
      parentDiv.remove()

      //mettre à jour les valeurs de data-index
      //on récupère toutes les div
        const listItems = yourBetsAdd.querySelectorAll(".yourBetsAddDiv");
        listItems.forEach(function(item, i) {
            item.setAttribute("data-index", i)
        })

      // Décrémente le compteur
      count--
      // Met à jour le titre "Your Bets" avec le compteur
      yourBetsTitle.innerHTML = `Your Bets (${count})`

      console.log(betValueTable)

      // Met à jour la cote totale
      coteTotaleDiv.innerHTML = `${updateCoteTotale()}`
      GainPotentielDiv.innerHTML = `Gain Potentiel : ${updateGain()} €`
      

      //Je laisse ma réflexion pour désactiver le bouton en même temps qu'on supprime du "panier" mais c'est galère....
      // const buttonLinked = parentDiv.parentElement.parentElement
      // .previousElementSibling.querySelector(".match").querySelector(".activeButton")
      // if (buttonLinked){
      //   buttonLinked.classList.remove("activeButton")
      // }
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
    leftPart.style.backgroundColor = 'pink'
    yourBetsTitle.style.backgroundColor = 'pink'
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
    leftPart.style.backgroundColor = 'pink'
    yourBetsTitle.style.backgroundColor = 'pink'
  }
})



 




