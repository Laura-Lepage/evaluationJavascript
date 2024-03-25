// == Variables ==
const matchWrapper = document.querySelector(".matchWrapper")
const match = document.querySelector(".match")
const imageRandom = document.querySelector(".imageRandom")
const buttons = document.querySelectorAll(".btn")
let count = 0
const yourBetsTitle = document.querySelector(".yourBetsTitle")
const yourBets = document.querySelector(".yourBets")
const yourBetsAdd = document.querySelector(".yourBetsAdd")
const coteTotaleDiv = document.querySelector(".coteTotale")


// == Functions ==
fetch(`scripts/datas.json`)
  .then(response => response.json())
  .then(data => {
    console.log(data)

    function displayMatchs() {
      data.matchs.forEach(function(singleMatch){
        matchWrapper.innerHTML += `
          <div class="match">
            <div>${singleMatch.hometeam} - ${singleMatch.awayteam}</div>
            <div class="buttons">
              <button class="btn">${singleMatch.home_odd}</button>
              <button class="btn">${singleMatch.draw_odd}</button>
              <button class="btn">${singleMatch.away_odd}</button>
            </div>
          </div>
        `
      })
    }
    displayMatchs()
  })
  .catch(error => {
    console.log("Erreur lors de la récupération des données :", error)
  })

  // Vérifie si le compteur est égal à zéro, et si oui, retire la classe "active"
  function emptyBets(div){
     if (count === 0){
      div.classList.remove("active")
    } else {
      div.classList.add("active")
    }
  }
  
  // Fonction pour mettre à jour la div "cote totale" avec le résultat de la multiplication
  function updateTotalOdds(result) {
    coteTotaleDiv.textContent = "Cote Totale: " + result.toFixed(2); // Formatage du résultat avec deux décimales
  }

  function calculateMultiplication() {
    let multiplicationResult = 1;

    document.querySelectorAll('.yourBetsAddDiv').forEach(div => {
        const betValueString = div.querySelector('button').textContent;
        const betValueNumber = parseFloat(betValueString);

        if (!isNaN(betValueNumber)) {
            multiplicationResult *= betValueNumber;
        }
    });

    console.log("Résultat de la multiplication :", multiplicationResult);

    // Mettre à jour la div "cote totale" avec le résultat de la multiplication
    updateTotalOdds(multiplicationResult);
  }

  



// == Code ==

matchWrapper.addEventListener('click', function(e) {
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
      // Récupère les informations sur le match correspondant
      const betMatch = button.parentElement.previousElementSibling.textContent
       
      yourBetsAdd.innerHTML += `
        <div class="yourBetsAddDiv">
        <div class="matchDiv">
          <div>Match</div>
          <div>${betValue}<button class="cross">🗑️</button></div>
        </div>
        <div>${betMatch}</div>  
        </div> 
        
      `
      
      
    })

    //vérification état du "panier"
    emptyBets(yourBets)
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
      // Supprime la div yourBetsAddDiv correspondante
      parentDiv.remove()
      // Décrémente le compteur
      count--
      // Met à jour le titre "Your Bets" avec le compteur
      yourBetsTitle.innerHTML = `Your Bets (${count})`
    }
  }
  //vérification état du "panier"
  emptyBets(yourBets)
})

// Appel initial pour calculer la multiplication et mettre à jour la div "cote totale" au chargement de la page
calculateMultiplication();












// == Gestion du fond d'image aléatoire ==

// Création d'un tableau contenant les images
const imagesTable = ['bg1.png', 'bg2.png', 'bg3.png']

// Sélection aléatoire d'une image
const randomImage = imagesTable[Math.floor(Math.random() * imagesTable.length)]

// Injection de l'image aléatoire dans sa div "imageRandom"
imageRandom.innerHTML = `<img src="images/${randomImage}" alt="">`



// == Dark Mode ==
let iconDarkMode = document.querySelector(".iconDarkMode")
let leftPart = document.querySelector(".leftPart")
let principalNav = document.querySelector(".principalnav")

iconDarkMode.addEventListener('click', function(){
  iconDarkMode.textContent = '☀'
  leftPart.style.backgroundColor = 'pink'
  yourBetsTitle.style.backgroundColor = 'pink'
  principalNav.style.backgroundColor = 'purple'

})






