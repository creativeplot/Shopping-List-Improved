
const form = document.querySelector('#item-form');
const enterInput = document.querySelector('#enter');
const buttonX = document.querySelector('#red-x');
const clearBtn = document.querySelector('#clear-btn');
const filter = document.querySelector('#filter');
const orgBtn = document.querySelector('#organize-btn');
const ul = document.querySelector('ul');


// creating full item

function iconX(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
};

function btnX(classes) {
    const btn = document.createElement('button');
    btn.className = classes;
    const icon = iconX('fa-solid fa-xmark');
    btn.appendChild(icon);
    return btn;
}

function addSubmitItem (e) {
    e.preventDefault();

    const newItem = document.querySelector('#enter').value;
    if (newItem === '') {
        alert('put something in the text area my dude')
        return;
    };

    if(isEditMode) {
        // removing the item to add a new one

        const itemToEdit = document.querySelector('.edit-mode');

        removeTheThingStorage (itemToEdit.textContent);

        itemToEdit.classList.remove('.edit-mode');

        itemToEdit.remove();

        isEditMode = false;

    } else {
        
        if(checkToSeeIfItemExist (newItem)) {
            alert('That item already exists!');
            return
        }
    }

    addingToDom(newItem);

    putItemInStorage(newItem);

    checkingUI()

    enterInput.value = '';

}

function addingToDom(item) {

    const li = document.createElement('li');

    const btn = btnX('remove-btn red-x');

    li.classList.add('draggable-item');
    li.classList.add('dragdemo');

    li.setAttribute('draggable', true);

    li.appendChild(document.createTextNode(item));

    li.appendChild(btn);

    ul.appendChild(li);
}

// -------------------------------------------------

// make sure to not add the same item

function checkToSeeIfItemExist (item) {
    const itemsFromStorage = getItemFromStorage();

    return itemsFromStorage.includes(item);
}


// --------------------------------------------------


// Drag Drop and Swap
ul.addEventListener('dragstart', start);
ul.addEventListener('dragover', over);
ul.addEventListener('dragenter', enter);
ul.addEventListener('dragleave', leave);
ul.addEventListener('drop', drop);
ul.addEventListener('dragend', end);

function start(e) {
    dragObject = e.target;

    dragObject.classList.add('dragging');

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', dragObject.innerHTML);

    e.target.style.backgroundColor = '#c1c1c1';
}

function over(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function enter(e) {
    if(e.target.classList.contains('draggable-item')) {
        e.target.classList.add('over');
    }
}

function leave(e){
    e.target.classList.remove('over');
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    if (dragObject !== e.target && e.target.classList.contains('draggable-item')) {
        dragObject.innerHTML = e.target.innerHTML;
        e.target.innerHTML = e.dataTransfer.getData('text/html')

        // now i want to take the information about the changed position of the items and pass that to the local storage so it can load the items in the position that i left
        updateLocalStorageIndex()
    }
}

function end(){
    const itemsOnDom = document.querySelectorAll('.draggable-item');
    itemsOnDom.forEach((item) => {
        item.classList.remove('dragging', 'over');
    });
};


// Query all the items on the DOM and iterate over them to create an array (itemsArray) containing the updated items' content.
function updateLocalStorageIndex() {

    const itemsOnDom = document.querySelectorAll('.draggable-item');

    const itemsOnArray = [];

    itemsOnDom.forEach((item) => {
        itemsOnArray.push(item.textContent);
    });
    localStorage.setItem('items', JSON.stringify(itemsOnArray));
}
// Update the items key in localStorage with the new array.Make sure to call the updateLocalStorage function after each drag-and-drop operation to keep the storage synchronized with the updated positions of the items. i can do this inside the Drop function.


// ------------------------------------------------------



// Edit Mode

let isEditMode = false;

function editMode (e) {
    isEditMode = true;

    // selecting the items
    let itemList = document.querySelectorAll('li');

    // making sure that i can't have more than one item in edit mode
    itemList.forEach((thing) => {
        thing.classList.remove('edit-mode')
    })

    // selecting the item i want to edit
    e.target.classList.add('edit-mode');

    // selecting the add button
    let addBtn = document.querySelector('#add-btn');

    // change add button style
    addBtn.style.backgroundColor = 'green';
    addBtn.style.borderColor = 'green';

    // change add button icon
    addBtn.innerHTML = '<i class="fa-solid fa-pen"></i>&nbsp Update';

    // selecting the enter input
    const enterInput = document.querySelector('#enter');

    // seting the item input to the text content of the li tag that i want to change the text
    enterInput.value = e.target.textContent;
}

ul.addEventListener('dblclick', editMode);


// ------------------------------------------------------


// add items to local storage
function putItemInStorage(item) {
    let thingsFromStorage = getItemFromStorage ();

    thingsFromStorage.push(item);

    localStorage.setItem('items', JSON.stringify(thingsFromStorage));
}

// get items from storage
function getItemFromStorage () {
    let thingsFromStorage;

    if (localStorage.getItem('items') === null) {
        thingsFromStorage = [];
    } else {
        thingsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return thingsFromStorage;

}

function displayItem() {
    let contentFromStorage = getItemFromStorage();

    contentFromStorage.forEach((item) => {
        item = addingToDom(item);
    })

    checkingUI();
}


// ------------------------------------------------------


// Removing Item
// .target works because it gives me whatever i click on inside the element in which the event is attached to
// while .currentTarget gives me the element in which the event is  attached it doest matter where i click
function removeItem(e) {
    if(e.target.parentElement.classList.contains('remove-btn')){
        e.target.parentElement.parentElement.remove();
        checkingUI()

        ReallyRemovingItems(e.target.parentElement.parentElement);
        
    };
    if(e.target.parentElement.classList.contains('items')){
        e.target.parentElement.remove();
        checkingUI()
    }
};

// this name here is just bad
// but it is removing the item from the dom and from the local storage, so essencially it is making the brigde between this two functions
function ReallyRemovingItems(item) {
    item.remove();

    removeTheThingStorage(item.textContent);
    checkingUI();
}

function removeTheThingStorage (content) {
    let stuffStored = getItemFromStorage();

    stuffStored = stuffStored.filter((stuffy) => stuffy !== content);

    localStorage.setItem('items', JSON.stringify(stuffStored));
};

function clearAll() {
    localStorage.removeItem('items')

    while(ul.firstElementChild){
        ul.removeChild(ul.firstElementChild);
    };
    checkingUI()
};



// -----------------------------------------------------



// Clear UI

function checkingUI() {

    const enterInput = document.querySelector('#enter').value;

    enterInput.value = '';

    const itemsFromList = document.querySelectorAll('li');

    if(itemsFromList.length === 0){
        clearBtn.style.display = 'none';
        filter.style.display = 'none';
        orgBtn.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        filter.style.display = 'block';
        orgBtn.style.display = 'block';
    }

    const addBtn = document.querySelector('#add-btn');

    addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';

    addBtn.style.backgroundColor = 'black';
    addBtn.style.borderColor = 'black';

    isEditMode = false;
}
checkingUI()



// -------------------------------------------------------



// Organize items

function organize() {
    while(ul.firstElementChild){
        ul.removeChild(ul.firstElementChild);
    };
    const itemsStorage = getItemFromStorage();

    itemsStorage.sort();

    itemsStorage.forEach((item) => {
        addingToDom(item)
    })

    localStorage.setItem('items', JSON.stringify(itemsStorage));
};

orgBtn.addEventListener('click', organize);



// -----------------------------------------------------



// filtering the items

function filterItems(e) {
    const itemsFromList = document.querySelectorAll('li');

    const text = e.target.value.toLowerCase();

    itemsFromList.forEach((item) => {

        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// -------------------------------------------------


form.addEventListener('submit', addSubmitItem);
ul.addEventListener('click', removeItem);
clearBtn.addEventListener('click', clearAll);
filter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItem);
