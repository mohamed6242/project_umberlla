// Des IDs que l'on utilisera dans cette application.
var addForm = document.getElementById('addForm');
var saveForm = document.getElementById('saveForm');
var counter = document.getElementById('counter');
var task = document.getElementById('task');
var list = document.getElementById('list');

// Initialisation de l'interface
function init(){
    // Au départ, le champ <input id="task"> est vide.
    task.value = '';
    // Le focus est sur ce champ
    task.focus();
    // Afficher, ou cacher, le compteur?
    manageCounter(0);
}

// Gérer le compteur, avec un écart (delta = ±1 ou delta = 0) éventuel.
function manageCounter(ecart){
    // Le compteur est incrémenté de 'écart' (qui peut être négatif ou nul)
    var tasks_number = parseInt(counter.innerText) + ecart;
    counter.innerText = tasks_number;
    // Titre par défault de la page (compteur == 0).
    document.title = 'My TODO';
    // Si le nombre de tâches est égal à 0, cacher le compteur.
    if(tasks_number == 0){
        counter.classList.add('hide'); // Voir les CSS pour la classe '.hide'.
    }
    // Sinon, lui enlever la classe '.hide', donc il devient visible.
    // Et changer le titre de la page pour y inclure le nombre de tâches.
    else{
        counter.classList.remove('hide');
        document.title += ' ('+ tasks_number + ')';
    }
}

// ----------------------------------------------------------------------------- 
// Gestion des actions sur les éléments de la liste des tâches.
// ----------------------------------------------------------------------------- 
// Chaque <li> de la liste <ul id="list"></ul> contient quelques <button> qui
// servent de boutons (icônes) pour des actions.
//
// Le TP, au départ, ne considérait qu'une seule action: la suppression.
// Cette version en contient deux nouvelles: edition et sauvegarde.
//  - L'édition affiche un <input> dans le <li> pour éditer la tâche sur place.
//  - La confirmation de l'édition sert à confirmer l'édition.
//
// Donc pour résumer: à la création d'une nouvelle tâche, on insère dans la
// liste <ul id="list"> un nouvel <li> contenant en plus du texte de la tâche à
// faire, deux buttons: 
//  - <button class="del"></button>
//  - <button class="edit"></button>
//
// En d'autres termes:
// <ul id="list">
//  <li>tache1 <button class="del"></button><button class="edit"></button></li>
//  <li>tache2 <button class="del"></button><button class="edit"></button></li>
//  <li>tache3 <button class="del"></button><button class="edit"></button></li>
//  <li>tache4 <button class="del"></button><button class="edit"></button></li>
// </ul>
//
// À chaque <button> est associée une action (sur le <li>) selon sa classe.
// ----------------------------------------------------------------------------- 
function taskAction(event){
    // Sur quel élément HTML a-t-on cliqué?
    var elt = event.target;
    if(elt.tagName == 'LI'){ // Si c'est le <li> lui-même, entamer une édition.
        editItem(elt);
    } else if(elt.tagName == 'BUTTON'){ // Si c'est sur une icône:
        // Récupérer le <li> contenant ce button, c'est à dire: son parentNode.
        var li = elt.parentNode;
        switch (elt.className) { // Selon la classe du <button> cliqué:
            case 'del':
                delItem(li); // Supprimer le <li>.
                break;
            case 'edit':
                editItem(li); // Éditer le contenu du <li>.
                break;
            case 'ok':
                confirmItem(li); // Confirmer l'édition de la tâche.
                break;
            // Si nous voulons rajouter des actions, nous n'avons qu'à écrire de
            // nouvelles actions, et de nouvelles classes CSS (avec les icones)
            // Et venir dans ce switch pour gérer la nouvelle action.
            default:
        }
    }
}

// Ajouter une tâche.
function addItem(event){

    // Prévenir la soumission du formulaire d'ajout de tâches.
    event.preventDefault();

    // Récupérer le texte saisi dans le champs <input id="task" />
    var value = task.value;

    // Check if value is empty. if so, do nothing.
    if (value.trim() == '')
        return false;

    // Créer un élément <li>
    var element = document.createElement('li');
    // Créer un TextNode contenant la tâche à ajouter.
    var text = document.createTextNode(value);
    // Créer un élément <button> (icône de suppression).
    var delbtn = document.createElement('button');
    // Créer un élément <button> (icône d'édition).
    var editbtn = document.createElement('button');
    // Affecter à delbtn la classe 'del' pour qu'il soit affiché avec l'icône (croix)
    delbtn.className = 'del';
    // Affecter à editbtn la classe 'edit' pour qu'il soit affiché avec l'icône (crayon)
    editbtn.className = 'edit';
    // Insérer ce TextNode dans la <li>
    element.appendChild(text);
    // Insérer le <button> de suppression dans la <li>.
    element.appendChild(delbtn);
    // Insérer le <button> d'édition dans la <li>.
    element.appendChild(editbtn);
    // Insérer le <li> dans la liste <ul id="list">.
    list.appendChild(element);

    // Counter: incrémenter (+1).
    manageCounter(+1);

    // Effacer le champs de saisie et retour à l'état initial.
    task.value = '';
    task.focus();
}

// Supprimer une tâche.
function delItem(li){
    // Supprimer le <li> de la liste.
    list.removeChild(li);
    // Counter: décrémenter (-1)
    manageCounter(-1);
    // Rendre le focus au champ d'insertion de tâches.
    task.focus();
}

// Lancer l'édition d'une tâche.
function editItem(li){
    // Récupérer le text du <li> (la tâche à faire). It's the <li>'s first child.
    var text = li.firstChild.nodeValue;
    // Créer un champ de saisie <input>.
    var input = document.createElement('input')
    input.setAttribute('type', 'text'); // Par défault, ça l'est à vrai dire.
    input.value = text; // Afficher le texte dans ce champ qu'on vient de créer.
    li.firstChild.remove(); // Supprimer le textNode.
    li.prepend(input); // Insérer le <input> tout au début du <li> (prepend).
    var editbtn = li.getElementsByClassName('edit')[0]; // Récupérer le btn d'edit.
    editbtn.className = 'ok'; // Le changer en 'OK'.
    input.focus(); // Mettre le focus sur le <input> qu'on vient d'insérer.
    // Gérer l'évènement (appui sur 'Entrer' pour cet <input>).
    input.addEventListener("keydown",function(event){
        if(event.keyCode == 13){
            confirmItem(li)
        }
    });
}

// Confirmer l'édition d'une tâche.
function confirmItem(li){
    var text = li.firstChild.value; // Récupérer la valeur du <input> déjà inséré.
    var textnode = document.createTextNode(text); // Créer un textNode.
    li.firstChild.remove(); // Supprimer le <input>.
    li.prepend(textnode); // Prepend le textNode qu'on vient de créer.
    var confirm_btn = li.getElementsByClassName('ok')[0]; // Récupérer le btn 'OK'.
    confirm_btn.className = 'edit'; // Le changer en btn 'EDIT' (état initial).
}


// Effacer la liste
function clearList(){
    // Tant que la liste <ul id="list"> a un premier enfant:
    while (list.firstChild) {
        // Supprimer cet enfant.
        list.firstChild.remove();
    }
    // Le compteur est bien-entendu remis à 0.
    counter.innerText = 0;
    // Écart nul. On a remis le compteur à zéro dans l'instruction précédente.
    manageCounter(0); // C'est à dire, cacher le compteur.
}

// Gestion complète de l'interface
function ui(){
    // Initialisation
    init();
    // Gestion des actions associées aux tâches individuellement.
    list.addEventListener('click', taskAction);
    // Gestion du formulaire d'ajout
    addForm.addEventListener('submit', addItem);
    // Gestion du bouton 'Clear'
    saveForm.addEventListener('reset', clearList);
}

// Au chargement, lancer l'interface.
window.onload = ui;
