// == Variables ==
const matchWrapper = document.querySelector(".matchWrapper")
const match = document.querySelector(".match")
const imageRandom = document.querySelector(".imageRandom")
const buttons = document.querySelectorAll(".btn")





// == Functions ==
fetch(`scripts/datas.json`)
  .then(response => response.json())
  .then(data => {
    console.log(data)

    
    function displayMatchs() {
      data.matchs.forEach(function(singleMatch){
        matchWrapper.innerHTML += `
          <div class="match ${singleMatch.match_id}">
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

// == Code ==

// //Choix doit resté apparent
matchWrapper.addEventListener('click', function(e) {
  // on vérifie si le button cliqué a la classe "btn"
  if (e.target.classList.contains("btn")) {
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
    // Ajoute ou retire la classe "activeButton" du bouton cliqué
    clickedButton.classList.toggle("activeButton")
  }
})








// == Gestion du fond d'image aléatoire ==

// Création d'un tableau contenant les images
const imagesTable = ['bg1.png', 'bg2.png', 'bg3.png'];

// Sélection aléatoire d'une image
const randomImage = imagesTable[Math.floor(Math.random() * imagesTable.length)];

// Injection de l'image aléatoire dans sa div "imageRandom"
imageRandom.innerHTML = `<img src="images/${randomImage}" alt="">`;





