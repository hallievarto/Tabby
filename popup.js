// // Initialize button with user's preferred color
// let changeColor = document.getElementById("changeColor");
// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// // When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: setPageBackgroundColor,
//     });
// });
  
// // The body of this function will be executed as a content script inside the
// // current page
// function setPageBackgroundColor() {
//     chrome.storage.sync.get("color", ({ color }) => {
//       document.body.style.backgroundColor = color;
//     });
// }

function logTabs(tabs) {
  let list = document.getElementById("myList");
  for (let tab of tabs) {
    // tab.url requires the `tabs` permission or a matching host permission.
    // alert(tab.url);
    currTabs.push(tab.url)
    let li = document.createElement("li");
    li.innerText = tab.title;
    list.appendChild(li);
  }
}


function onError(error) {
  console.log(`Error: ${error}`);
}

let currTabs = []
let querying = chrome.tabs.query({currentWindow: true});
querying.then(logTabs, onError);

createGroup.addEventListener("click", async() =>{
  console.log("make new")
  let groupNameText = document.createElement('text')
  let groupNameSubmit = document.createElement('button')

  groupNameText.innerHTML = "<input type='text' id='GName' placeholder='type group name' />"
  groupNameSubmit.innerHTML = "<div id='NG'> Submit </div>"

  document.getElementById("textbox").appendChild(groupNameText)
  document.getElementById("textbox").appendChild(groupNameSubmit)
  groupNameSubmit.onclick = submitNewGroup
})

function submitNewGroup(){
  var name = document.getElementById("GName").value;
  chrome.storage.sync.set({name: currTabs});
  chrome.storage.sync.get("name", function (obj) {
    console.log(obj);
  });
  let li = document.createElement("li");
  let openButton = document.createElement("button")
  openButton.innerHTML = "<button id=openTabs> Open Tabs </button>"
  li.innerText = name;
  groupNames.appendChild(li);
  groupNames.appendChild(openButton)

  openButton.addEventListener("click", openTabs, false)
}

function openTabs(){
  window.open(currTabs[0], "_blank");
  if (currTabs.length > 0){
    for (let i=1; i < currTabs.length; i++) {
      // tab.url requires the `tabs` permission or a matching host permission.
      // alert(tab.url);
      chrome.tabs.create({url: currTabs[i]})
      // let li = document.createElement("li");
      // li.innerText = tab.title;
      // list.appendChild(li);
    }
  }
}

addTo.addEventListener("click", async() =>{
  var list = document.getElementById("groupNames");
  var listoflists = list.getElementsByTagName("li");
  console.log(list);
  console.log(listoflists);
  for(var i = 0; i < listoflists.length; i++) {
    let link = document.createElement("a");
    link.innerText = listoflists[i].innerText;
    document.getElementById("myDropdown").appendChild(link);
  }
  document.getElementById("myDropdown").classList.toggle("show");
})

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


// let newGroupButton = document.getElementById("newGroup");
// if (newGroupButton) {
//   newGroupButton.addEventListener("click", async () => {
//     var txtNewInputBox = document.createElement('text');
//     var newSubmitButton = document.createElement('button');
//     txtNewInputBox.innerHTML = "<input type='text' id='newInputBox'>";
//     newSubmitButton.innerHTML = "<input type='button' id='newGroupSubmitButton' value='Submit'>"

//     console.log("made it to first listener");  

  
//     document.getElementById("newInputGroup").appendChild(txtNewInputBox);
//     document.getElementById("newInputGroup").appendChild(newSubmitButton);
//   });
// }

// let submitButton = document.getElementById("newGroupSubmitButton");
// console.log(submitButton);
// if (submitButton) {
//   console.log("yo");
//   submitButton.addEventListener("click", async () => {
//     var groupName = document.getElementById("newInputBox").value;
//     var newGroupLabel = document.createElement('h3');

//     console.log(groupName);
//     console.log('hey its me');
//     newGroupLabel.innerHTML = groupName;
//     document.getElementById("groupBox").appendChild(newGroupLabel);
//   });
// }