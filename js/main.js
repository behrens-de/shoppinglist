// JP BHERENS - SHOPPING LIST

const lists = [
    {
        active: true,
        id: 'jp-default',
        name: 'Allgemein'
    },
    {
        active: false,
        id: 'jp-penny',
        name: 'Penny'
    },
    {
        active: false,
        id: 'jp-aldi',
        name: 'Aldi'
    },
    {
        active: false,
        id: 'jp-dm',
        name: 'DM'
    }
];

let item = {
    id: '123',
    list: 'jp-default', // id of the List
    done: true,
    name: 'Example'
}

let item2 = {
    id: '456',
    list: 'jp-default', // id of the List
    done: false,
    name: 'Example 2'
}

const myList = [item, item2];

function generateID() {
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    var uuid = 'xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
            var r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            var r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

function loadLists() {
    const ul = document.querySelector('.lists ul');
    ul.innerHTML = '';
    lists.forEach((list) => {
        const li = document.createElement('li');
        li.dataset.listid = list.id;
        li.innerHTML = `${list.name} (${countListItems(list.id)})`;
        ul.appendChild(li);
    });

    selectList();
}

function selectList() {
    const liList = document.querySelectorAll('.lists li');
    liList.forEach((list) => {
        list.addEventListener('click', clickList);
    });
}

function clickList() {
    lists.map(list => {

        if (this.dataset.listid === list.id) {
            list.active = true;
        } else {
            list.active = false;
        }
    });

    displayActiveList();
    loadList();
}

// Added the Items to the Array - myList
function addItem() {
    const form = document.querySelector('.addItem');
    const input = form.querySelector('input');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = input.value;
        const valid = validateItem(input.value);
        input.value = valid ? '' : value;
    });
}

// Ckecked if the addItem is valid
function validateItem(input) {
    if (input.length > 2) {
        myList.push({
            id: generateID(),
            list: getActiveList().id,
            done: false,
            name: input
        });
        loadList();
        return true;
    }
    return false;
}

// Display the List
function loadList() {
    const itmes = document.querySelector('.items ul');
    itmes.innerHTML = '';

    myList.forEach((item) => {
        if (item.list === getActiveList().id) { // Zeigt einträge der gewählten liste an
            // Creates Items  
            const li = document.createElement('li');
            li.dataset.itemid = item.id;
            if (item.done) {
                li.classList.add('active');
            }
            li.innerHTML = item.name;
            itmes.appendChild(li);
        }
    });
    countCurrentItems();
    selectItem();
    loadLists();
}

// If item is done
function selectItem() {
    const items = document.querySelectorAll('.items li');
    items.forEach((item) => {
        item.addEventListener('click', clickItem);
    });
}

function clickItem() {
    // Toggle (.active)
    const activeClassName = "active";
    console.log(this.dataset.itemid);
    myList.map((item) => {
        if (item.id === this.dataset.itemid) {
            item.done = this.classList.contains(activeClassName) ? false : true;
        }
    })
    this.classList.contains(activeClassName) ? this.classList.remove(activeClassName) : this.classList.add(activeClassName);
    loadList();
}

// Count and display the Items of the Current List
function countCurrentItems() {
    const quanty = countListItems();
    const done = countListItemsDone();
    let procent = Math.round(done / quanty * 100);
    if(quanty<=1){
        procent = 0;
    }
    const process = document.querySelector('.progress');
    

    process.style.width = `${procent}%`;

    const headline = document.querySelector('.countItems');


    headline.innerHTML = `${quanty}/${done} Einträge (${procent})`;
}

// Count Items of any List (default = current List)
function countListItems(listId = getActiveList().id) {
    const myListItems = myList.filter((item) => {
        if (item.list === listId) {
            return true;
        }
    });
    return myListItems.length;
}

function countListItemsDone(listId = getActiveList().id) {
    const myListItemsDone = myList.filter((item) => {
        if (item.list === listId && item.done === true) {
            return true;
        }
    });
    return myListItemsDone.length;
}

// set active List
function getActiveList() {
    let activeList;
    lists.forEach((list) => {
        if (list.active) {
            activeList = list;
        }
    });
    return activeList;
}

function setActiveList() { }

// Zeigt die Aktuelle Liste an
function displayActiveList() {
    const currentList = document.querySelector('.currentList');
    currentList.innerHTML = getActiveList().name;
    document.querySelector('.closeLists').click();
}

// Die Listen anzeigen
function showLists() {
    const div = document.querySelector('.lists');
    const btnOpen = document.querySelector('.openLists');
    const btnClose = document.querySelector('.closeLists');

    btnOpen.addEventListener('click', () => {
        div.classList.add('listsOpen');
    });

    btnClose.addEventListener('click', () => {
        div.classList.remove('listsOpen');
    });
}

function init() {
    addItem();
    loadList();
    displayActiveList();
    loadLists();
    showLists();
}

init();