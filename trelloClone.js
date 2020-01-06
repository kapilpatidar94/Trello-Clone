

const idBoard = '5e0988eebbc38e7f54f14bdc';


let url = `https://api.trello.com/1/boards/${idBoard}/lists?cards=all&key=${key}&token=${token}`;

var mainTask = document.getElementById('browser-div');

masterboard();
function masterboard() {
    const backurl = `https://api.trello.com/1/boards/${idBoard}?cards=all&key=${key}&token=${token}`;

    return fetch(backurl, {
        method: "GET"
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(data => {
            document.body.style.backgroundImage = `url(${data.prefs.backgroundImage})`;
            document.body.style.backgroundSize = "cover";
        });

}


get();
let i = 0;
function get() {
    return fetch(url).then(res => res.json()).then(data => {
        addInList(data);
    });
}


function addInList(data) {
    while (mainTask.hasChildNodes()) {
        mainTask.removeChild(mainTask.firstChild);
    }
    console.log(data);
    for (let dataArray of data) {

        var div = document.createElement('div');
        div.className = 'inner-div-class'
        div.innerText = dataArray.name;
        div.id = dataArray.id;


        for (let card of dataArray.cards) {
            var li = document.createElement('li');
            li.setAttribute("id", card.id);
            li.className = "list-class";

            li.style.fontWeight = "normal";

            let text = document.createElement('div');
            text.innerText = card.name;
            text.setAttribute("onclick", "popupEvent()");

            var remove = document.createElement('button');
            remove.innerText = "⚔";
            remove.className = 'remove-list';


            var edit = document.createElement("button");
            edit.className = "edit-list";
            edit.innerText = "✎";


            remove.addEventListener('click', deleteCard);

            li.appendChild(text);
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

    let parent = event.target.parentNode;

    let hide = event.target;
    hide.style.display = 'none';

    let text = (event.target.parentNode.innerText).split('\n')[0];
    var addForm = document.createElement('form');
    let textBox = document.createElement('input');
    textBox.value = text;
    addForm.appendChild(textBox);
    parent.appendChild(addForm);
    addForm.addEventListener('submit', async function () {
        event.preventDefault();
        event.stopPropagation();
        const input = event.target.firstChild.value;
        const cardId = event.target.parentNode.id;
        if (input) {
            const Url = `https://api.trello.com/1/cards/${cardId}?name=${input}&key=${key}&token=${token}`;
            const resp = await fetch(Url, { method: 'PUT' });
            if (resp.ok) {
                get();
            }
        }
    })
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
    event.stopPropagation();
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

function addNewCard() {

    event.preventDefault();
    const theItem = document.getElementById("insert-item").value;

    let id = event.target.parentNode.id;

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

function popupEvent() {
    parent = event.target.parentNode.id;
    popup();
}

async function popup() {
    const checklist = document.getElementById("popup");
    checklist.style.display = "block";
    let CID = parent;

    const cardUrl = `https://api.trello.com/1/cards/${CID}?key=${key}&token=${token}`;
    const checkListUrl = `https://api.trello.com/1/cards/${CID}/checklists?checkItems=all&checkItem_fields=all&filter=all&fields=all&key=${key}&token=${token}`;
    let cardData = await fetch(cardUrl).then(res => res.json()).then(data => data);
    let checkListData = await fetch(checkListUrl).then(res => res.json()).then(data => data);

    refreshCardDOM(cardData, checkListData)
}

function refreshCardDOM(cardData, checkListData) {
    const dataDes = cardData;
    const dataChecklist = checkListData;

    const tabCheckBoard = document.getElementById("popup-content");

    while (tabCheckBoard.hasChildNodes()) {
        tabCheckBoard.removeChild(tabCheckBoard.firstChild);
    }

    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    cardHeader.appendChild(document.createTextNode(dataDes.name));

    tabCheckBoard.appendChild(cardHeader);

    const desCard = document.createElement("div");
    desCard.className = 'description';
    const desCardHead = document.createElement("div");
    desCardHead.className = "des-card-head";
    desCardHead.appendChild(document.createTextNode("Description"));
    const desCardContent = document.createElement("div");
    desCardContent.className = "des-card-content";
    desCardContent.appendChild(document.createTextNode(dataDes.desc));
    desCard.appendChild(desCardHead);
    desCard.appendChild(desCardContent);
    tabCheckBoard.appendChild(desCard);

    for (dataCheck of dataChecklist) {
        const checklistItems = document.createElement("div");
        checklistItems.innerText = dataCheck.name;
        checklistItems.setAttribute("id", dataCheck.id);
        checklistItems.className = 'checklist-box';

        const deleteWholeCheckList = document.createElement("button");
        deleteWholeCheckList.className = 'delete-checklist-button';
        deleteWholeCheckList.innerText = "Delete";
        deleteWholeCheckList.addEventListener("click", deleteTheChecklist);
        checklistItems.append(deleteWholeCheckList);

        for (let j = 0; j < dataCheck.checkItems.length; j++) {
            let status = dataCheck.checkItems[j].state;
            let checklistData = dataCheck.checkItems[j].name;

            const addListItem = document.createElement("div");
            const checkBox = document.createElement("input");
            const text = document.createElement("div");
            const editButton = document.createElement("button");
            const delButton = document.createElement("button");

            addListItem.className = "items-checklist";
            addListItem.setAttribute("id", dataCheck.checkItems[j].id);
            checkBox.className = "item-checkbox";
            checkBox.type = "checkbox";
            if (status === "incompelete") {
                checkBox.checked = 0;
            } else if (status === "complete") {
                checkBox.checked = 1;
            }

            text.appendChild(document.createTextNode(checklistData));
            editButton.className = "edit-list";
            editButton.innerText = "✎";
            delButton.className = "remove-list";
            delButton.innerText = "⚔";
            delButton.addEventListener("click", delItem);
            editButton.addEventListener("click", editItemForm);
            checkBox.addEventListener("click", strikeItem);
            if (status === "complete") {
                text.style.textDecoration = "line-through";
            } else if (status === "incomplete") {
                text.style.textDecoration = "none";
            }

            addListItem.appendChild(checkBox);
            addListItem.appendChild(text);
            addListItem.appendChild(editButton);
            addListItem.appendChild(delButton);
            checklistItems.appendChild(addListItem);
        }

        const addChecklistItem = document.createElement("button");
        addChecklistItem.className = "items-checklist";
        addChecklistItem.innerText = "Add an item";
        checklistItems.appendChild(addChecklistItem);
        addChecklistItem.addEventListener("click", addItemForm);

        tabCheckBoard.appendChild(checklistItems);
    }
    const newChecklistButton = document.createElement("button");
    newChecklistButton.innerText = "+ Add new checklist";
    newChecklistButton.addEventListener("click", addNewChecklistForm);
    tabCheckBoard.appendChild(newChecklistButton);
}



window.onclick = function (event) {
    const checklist = document.getElementById("popup");
    if (event.target == checklist) {
        checklist.style.display = "none";
    }
};

function delItem() {
    let CID = event.target.parentNode.parentNode.id;
    let IID = event.target.parentNode.id;
    url = `https://api.trello.com/1/checklists/${CID}/checkItems/${IID}?key=${key}&token=${token}`;

    return fetch(url, {
        method: "DELETE"
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    })
        .then(() => popup());
}

function editItemForm() {
    event.preventDefault();
    let hide = event.target;
    hide.style.display = "none";
    const editFormLayout = event.target.parentNode;
    const editTheForm = document.createElement("form");
    const einputText = document.createElement("input");
    einputText.type = "text";
    einputText.placeholder = "Edit text";
    einputText.id = "edit-checklist-item";
    editTheForm.appendChild(einputText);
    editFormLayout.appendChild(editTheForm);
    editTheForm.addEventListener("submit", editItem);
}

function editItem() {
    event.preventDefault();
    const theItem = document.getElementById("edit-checklist-item").value;
    let LID = event.target.parentNode.id;
    const CID = parent;
    let ENAME = theItem;
    url = `https://api.trello.com/1/cards/${CID}/checkItem/${LID}?name=${ENAME}&key=${key}&token=${token}`;

    return fetch(url, {
        method: "PUT"
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    })
        .then(() => popup());
}

function addItemForm() {
    event.preventDefault();
    let hide = event.target;
    hide.style.display = "none";
    const addItemFormLayout = event.target.parentNode;
    const addTheItem = document.createElement("form");
    const addItemInputText = document.createElement("input");
    addItemInputText.type = "text";
    addItemInputText.placeholder = "Add Item";
    addItemInputText.id = "add-checklist-item";
    addTheItem.appendChild(addItemInputText);
    addItemFormLayout.appendChild(addTheItem);
    addTheItem.addEventListener("submit", addItem);
}

function addItem() {
    event.preventDefault();
    const CID = event.target.parentNode.id;
    const CINAME = document.getElementById("add-checklist-item").value;
    url = `https://api.trello.com/1/checklists/${CID}/checkItems?name=${CINAME}&pos=bottom&checked=false&key=${key}&token=${token}`;
    return fetch(url, {
        method: "POST"
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    })
        .then(() => popup());
}

function strikeItem(event) {
    event.preventDefault();
    const CID = event.target.parentNode.id;
    const PCID = parent;

    let state;
    if (event.target.checked === false) {
        state = "incomplete";
    } else if (event.target.checked === true) {
        state = "complete";
    }
    url = `https://api.trello.com/1/cards/${PCID}/checkItem/${CID}?state=${state}&key=${key}&token=${token}`;
    return fetch(url, {
        method: "PUT"
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    })
        .then(() => popup());
}

function addNewChecklistForm(event) {
    event.preventDefault();
    let hide = event.target;
    hide.style.display = "none";
    const addCheckListFormLayout = event.target.parentNode;
    const addTheChecklist = document.createElement("form");
    const addCheckListInputText = document.createElement("input");
    addCheckListInputText.type = "text";
    addCheckListInputText.placeholder = "Add Item";
    addCheckListInputText.id = "add-checklist";
    addTheChecklist.appendChild(addCheckListInputText);
    addCheckListFormLayout.appendChild(addTheChecklist);
    addTheChecklist.addEventListener("submit", addNewChecklist);
}

function addNewChecklist(event) {
    event.preventDefault();
    const CID = parent;
    const CINAME = document.getElementById("add-checklist").value;
    url = `https://api.trello.com/1/checklists?idCard=${CID}&name=${CINAME}&key=${key}&token=${token}`;
    return fetch(url, {
        method: "POST"
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    })
        .then(() => popup());
}

function deleteTheChecklist(event) {
    const CID = event.target.parentNode.id;
    url = `https://api.trello.com/1/checklists/${CID}?key=${key}&token=${token}`;
    return fetch(url, {
        method: "DELETE"
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    })
        .then(() => popup());
}