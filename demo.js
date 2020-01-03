

const idBoard = '5e0988eebbc38e7f54f14bdc';


let url = `https://api.trello.com/1/boards/${idBoard}/lists?cards=all&key=${key}&token=${token}`;

let pos = 0;
var mainTask = document.getElementById('browser-div');

get();
let i = 0;
// refreshDOM();
function get() {
    return fetch(url).then(res => res.json()).then(data => {
        // for (i = 0; i < data.length; i++) {
        addInList(data);
        // }


    });
}


function addInList(data) {
    while (mainTask.hasChildNodes()) {
        mainTask.removeChild(mainTask.firstChild);
    }
    for (let dataArray of data) {

        var div = document.createElement('div');
        div.className = 'inner-div-class'
        div.innerText = dataArray.name;
        div.setAttribute("position", pos++);
        div.id = dataArray.id;


        for (let card of dataArray.cards) {
            var li = document.createElement('li');
            li.setAttribute("id", card.id);
            li.className = "list-class";
            li.innerText = card.name;
            li.style.fontWeight = "normal";

            var remove = document.createElement('button');
            remove.innerText = "⚔";
            remove.className = 'remove-list';


            var edit = document.createElement("button");
            edit.className = "edit-list";
            edit.innerText = "✎";


            remove.addEventListener('click', deleteCard);

            li.appendChild(remove);
            li.appendChild(edit);
            div.appendChild(li);

            edit.addEventListener('click', editTheCard);
        }
        var addButton = document.createElement('input');
        addButton.setAttribute("id", "add-card");
        addButton.value = '+ Add another card';
        addButton.type = "button";
        addButton.setAttribute("onclick", "showInputBox()");
        addButton.name = "answer";
        div.appendChild(addButton);
        mainTask.appendChild(div);
    }



    var addCards = document.createElement('button');
    addCards.id = "add-list"
    addCards.innerText = '+ Add another list';

    addCards.addEventListener('click', showInputBoxForList);
    mainTask.appendChild(addCards);

}

function editTheCard() {
    event.preventDefault();
    let parent = event.target.parentNode;

    let hide = event.target;
    hide.style.display = 'none';

    let text = (event.target.parentNode.innerText).split('\n')[0];
    var addForm = document.createElement('form');
    let textBox = document.createElement('input');
    textBox.value = text;
    addForm.appendChild(textBox);
    parent.appendChild(addForm);
    addForm.addEventListener("submit", changeEditedValue);
    // get();

}

function changeEditedValue() {
    event.preventDefault();
    event.stopPropagation();

    let id = event.target.parentNode.id;
    let theItem = event.target.firstChild.value;
    console.log(theItem);
    url = `https://api.trello.com/1/cards/${id}?name=${theItem}&key=${key}&token=${token}`;

    return fetch(url, {
        method: "PUT"
    }).then(res => {
            if (res.ok) {
                get();
                return res.json();
            }
        })
        .then();

}

function showInputBox() {
    event.preventDefault();
    let parent = event.target.parentNode;
    let hide = event.target;
    hide.style.display = "none";

    var addForm = document.createElement('form');
    var inputText = document.createElement("input");
    var inputButton = document.createElement("button");
    inputText.type = "text";
    inputText.placeholder = "Enter title for this card...";
    inputText.id = "insert-item";
    inputButton.innerText = "Add";
    addForm.appendChild(inputText);
    addForm.appendChild(inputButton);
    parent.appendChild(addForm);
    addForm.addEventListener("submit", addNewCard)
}


function deleteCard() {
    event.preventDefault();
    let id = event.target.parentNode.id;
    var urlRemove = `https://api.trello.com/1/cards/${id}?key=${key}&token=${token}`;
    return fetch(urlRemove, {
        method: 'DELETE'
    }).then(res => {
        if (res.ok) {
            get();
            return res.json();
        }
    })
        .then();
}

function addNewCard(obj) {

    obj.preventDefault();
    const theItem = document.getElementById("insert-item").value;

    let id = obj.target.parentNode.id;

    const url = `https://api.trello.com/1/cards?idList=${id}&name=${theItem}&key=${key}&token=${token}`;
    return fetch(url, {
        method: "POST"
    })
        .then(res => {
            if (res.ok) {
                get();
                return res.json();
            }
        })
        .then();
}


function addNewList() {
    event.preventDefault();
    const name = document.getElementById("insert-item").value;
    console.log(name);
    const url = `https://api.trello.com/1/lists?name=${name}&idBoard=${idBoard}&pos=bottom&key=${key}&token=${token}`;

    return fetch(url, {
        method: 'POST'
    }).then(res => {
        if (res.ok) {
            get();
            return res.json();
        }
    })
        .then();

}

function showInputBoxForList() {
    event.preventDefault();
    let parentNode = event.target.parentNode;
    let addButton = document.getElementById('add-list');
    addButton.style.display = "none";
    var addForm = document.createElement('form');
    var inputText = document.createElement("input");
    var inputButton = document.createElement("button");
    inputText.type = "text";
    inputText.placeholder = "Enter list title...";
    inputText.id = "insert-item";
    inputButton.innerText = "Add";
    addForm.appendChild(inputText);
    addForm.appendChild(inputButton);
    parentNode.appendChild(addForm);
    addForm.addEventListener("click", addNewList);
}




// *************************************************/
