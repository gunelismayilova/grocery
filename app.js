//*********SELECT ITEMS****** */
const alert = document.querySelector('.alert');
// const form = document.querySelector('.grocery-form');
const groceryInput = document.getElementById('grocery-input');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// EDIT OPTION
let editElement;
let editFlag = false;
let editId = "";

// EVENT LISTENERS
window.addEventListener('DOMContentLoaded', setupItems)
submitBtn.addEventListener('click', addItem);
clearBtn.addEventListener('click', clearItems);

//FUNCTIONS
function addItem(e) {
    e.preventDefault();
    const value = groceryInput.value;
    const id = new Date().getTime().toString();
    
    if (value && !editFlag) {
          createListItems(id, value);
          container.classList.add('show-container');

          
       
         displayAlert('item added to the list', 'success');
         addToLocalStorage(id, value);
         setBackToDefault();

       
       
    }
    else if (value && editFlag) {
         editElement.textContent = value;
         displayAlert('value changed', 'success');
         editLocalStorage(editId, value);
         setBackToDefault();
         
        
    }
    else {
        displayAlert('please enter value', 'danger')

    }
        
    
}

// display alert
function displayAlert(text, action) {
        alert.textContent = text;
        alert.classList.add(`alert-${action}`);
        setTimeout (function() {
            alert.textContent = "";
            alert.classList.remove(`alert-${action}`);

        }, 1000)


}

// clear items

function clearItems() {
    const items = document.querySelectorAll('.grocery-item');
    if (items.length > 0) {
    items.forEach(function(item) {
        list.removeChild(item);
    })
    displayAlert('empty list', 'danger');
    container.classList.remove('show-container')
    }

    localStorage.removeItem('list');

}

// set back to default
function setBackToDefault() {
    groceryInput.value= "";
    submitBtn.textContent = 'submit';
    editFlag = false;
    editId = "";
}

//edit items

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    groceryInput.value = element.textContent;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = 'edit';
//    console.log(editElement);
    
    
}

//delete items
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    let id = element.dataset.id;
    //console.log(id)
    //console.log(element);
    list.removeChild(element);
    //console.log(list.children);
    displayAlert('item deleted', 'danger');
    if (list.children.length === 0) {
            container.classList.remove('show-container');
            displayAlert('empty list', 'danger');
            localStorage.removeItem('list');
    }

    removeFromLocalStorage(id);

}


//LOCAL STORAGE

function addToLocalStorage(id, value) {
    const grocery = {id, value};
    // console.log(grocery)
    let items = getLocalStorage();
    // console.log(localStorage.getItem('list'))
    items.push(grocery);
    // console.log(items)
    localStorage.setItem('list', JSON.stringify(items));
    
};

function removeFromLocalStorage(id) {
        let items = getLocalStorage();

        items = items.filter(function (item) {
            if (item.id !== id) {
                return item;
            }
             
         })

         localStorage.setItem('list', JSON.stringify(items))
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();

        items = items.map(function (item) {
            if (item.id === id) {
                item.value = value;
            }
            return item;
         });
        console.log(items)
         localStorage.setItem('list', JSON.stringify(items))
}

   function getLocalStorage() {
        return localStorage.getItem('list') 
        ? JSON.parse(localStorage.getItem('list')) 
        : [];

   }


//SETUP ITEMS
function setupItems() {
    items = getLocalStorage();
    if(items.length>0) {
        items.forEach(function(item) {
            createListItems(item.id, item.value)
        })
        container.classList.add('show-container');
    }
    
}

function createListItems(id, value) {
    const element = document.createElement('div');
    element.classList.add('grocery-item');
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
          <button type="button" class="edit-btn">
              <i class="fa-regular fa-pen-to-square"></i>
          </button>

          <button class="delete-btn">
              <i class="fa-solid fa-trash"></i>
          </button>
    </div>`;
    const editBtn = element.querySelector('.edit-btn');
    const deleteBtn = element.querySelector('.delete-btn');

    editBtn.addEventListener('click', editItem)
    deleteBtn.addEventListener('click', deleteItem)
    list.appendChild(element);
}