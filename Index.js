const addNote =   document.querySelector('.add-note')
const orderList = document.querySelector('.order-list')
const textInput = document.getElementById('inptext')

let lastid = 0;

var notes = JSON.parse(localStorage.getItem('note')) || []

const existNote = notes.map(note => {    

    const li = document.createElement('LI')
    li.className = 'fill'
    li.id = 'list-tag'
    li.setAttribute('draggable', 'true')
  
    
    let divTag = document.createElement('div')
    divTag.className = 'div-tag';
    divTag.setAttribute('id', lastid)
    divTag.innerText = note
    li.appendChild(divTag)
  
    const edit = document.createElement('button')
    edit.className = 'modify';
    edit.setAttribute('id', lastid)
    edit.innerText = 'EDIT';
    li.appendChild(edit)
  
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'erase';
    deleteBtn.setAttribute('id', lastid)
    deleteBtn.appendChild(document.createTextNode('DELETE'));
    li.appendChild(deleteBtn)
    
    lastid += 1;
    orderList.appendChild(li)
    //return note
    
})

//This function only pushing my input value to my notes array and set/save it to local storage. 
addNote.addEventListener('click', () =>{
    if(textInput.value == "" || textInput.value == null) {
        alert("Sorry! You can't add empty note")
        //return
    }

    notes.push(textInput.value)
    localStorage.setItem('note', JSON.stringify(notes))
    getNote()
    textInput.value = ""  
    location.reload()
    
})


  
//This function is responsible for displaying the text on the user's browser. But it does not persist the text on the browser.
function getNote() {
  const li = document.createElement('LI')
  li.className = 'fill'
  li.id = 'list-tag'
  li.setAttribute('draggable', 'true')

  // I am creating a div element that will wrap the text coming from textarea input.
  let divTag = document.createElement('div')
  divTag.className = 'div-tag';
  divTag.setAttribute('id', lastid)
  divTag.innerText = textInput.value
  li.appendChild(divTag)

  // I am creating a button element that will be a sibling to the div element created earlier. And they will get appended to the same parent element. 
  const edit = document.createElement('button')
  edit.className = 'modify';
  edit.setAttribute('id', lastid)
  edit.innerText = 'EDIT';
  li.appendChild(edit)
  
  // Same as above in line 71
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'erase';
  deleteBtn.setAttribute('id', lastid)
  deleteBtn.appendChild(document.createTextNode('DELETE'));
  li.appendChild(deleteBtn)
  
  lastid += 1;
  orderList.appendChild(li)
}


orderList.addEventListener('click', function(e){

    // This is a reference to the object onto which the event was dispatched.
    if(e.target.classList.contains('erase')){

        if(confirm('Are you sure')){
             const li = e.target.parentElement; 
             const del = e.target.attributes.id.value
             console.log(del)
             orderList.removeChild(li)
             toDelete(del)
        }
    }

    else if(e.target.textContent == 'EDIT'){
        const li = e.target.parentNode;
        const div = li.firstElementChild;
        const input = document.createElement('textarea');
        input.style.width = '800px';
        input.style.height = '30px';
        input.value = div.textContent
        li.insertBefore(input, div)
        li.removeChild(div)
        e.target.textContent = 'SAVE'
        
    }

    else if(e.target.textContent == 'SAVE'){
        const li = e.target.parentNode;
        const input = li.firstElementChild
        if(input.value !== ""){
             const div = document.createElement('div')
             div.style.width = '800px';
             div.textContent = input.value;
            
            li.insertBefore(div, input)
            li.removeChild(input)
            const ID = e.target.attributes.id.value;
            console.log(div)
            console.log(notes)
            notes[ID] = div.textContent
            localStorage.setItem('note', JSON.stringify(notes))
            location.reload()
            e.target.textContent = 'EDIT';

        }
        else {
            alert("You can't save empty note")
            return
        }
     }
})

// this function is responsible in deleting a note from local storage.
const toDelete = (index) => {
      notes.splice(index, 1)
      localStorage.setItem("note", JSON.stringify(notes))
      location.reload()
} 


function enableDragSort(listClass) {
  const sortableLists = document.getElementsByClassName(listClass);
  Array.prototype.map.call(sortableLists, (list) => {enableDragList(list)});
  console.log(sortableLists)
}


function enableDragList(list) {
  Array.prototype.map.call(list.children, (item) => {enableDragItem(item)});
}

function enableDragItem(item) {
  
  item.ondrag = handleDrag;
  item.ondragend = handleDrop;
}


function handleDrag(item) {
  const selectedItem = item.target,
        list = selectedItem.parentNode,
        x = event.clientX,
        y = event.clientY;
  selectedItem.classList.add('drag-sort-active');
  let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);
  //console.log(swapItem)
  if (list === swapItem.parentNode) {
    swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
    list.insertBefore(selectedItem, swapItem);
    
    
  }
}

function handleDrop(item) {
  item.target.classList.remove('drag-sort-active');
  const newOrderElement = document.querySelectorAll('ol li div')
  var newOrder = []

  for (let i = 0; i < notes.length; i++) {
    const item = newOrderElement[i].outerText
    newOrder.push(item)
  }

 notes = newOrder
 localStorage.setItem('note', JSON.stringify(notes))
  
}

(()=> {enableDragSort('order-list')})();
