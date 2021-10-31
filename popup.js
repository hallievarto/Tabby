
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

// !! This is how you clear chrome storage !!
// chrome.storage.local.clear(function() {
//   var error = chrome.runtime.lastError;
//     if (error) {
//       console.error(error);
//     }
//  })


// !! This is how you get all things in chrome storage !!
 chrome.storage.local.get(null, function(items) {
  console.log(items);
  for (key in items){
    // console.log(key);
    let li = document.createElement("li");
    li.innerText = key;
    let openButton = document.createElement("button")
    openButton.innerHTML = "<button id=openTabs> Open Tabs </button>"
    groupNames.appendChild(li);
    groupNames.appendChild(openButton)
    openButton.addEventListener("click", openTabs, false)

  }
  
});

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
  var tabName = document.getElementById("GName").value;
  console.log(tabName)
  
  var save = {}
  save[tabName] = currTabs
  chrome.storage.local.set(save, function(){
    console.log(tabName)
  });
  chrome.storage.local.get(save, function (obj) {
    console.log(obj);
  });
  let li = document.createElement("li");
  let openButton = document.createElement("button")
  openButton.innerHTML = "<button id=openTabs> Open Tabs </button>"
  li.innerText = tabName;
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

// add to current tab group button 
addTo.addEventListener("click", async() =>{
  var list = document.getElementById("groupNames");
  var listoflists = list.getElementsByTagName("li");
  for(var i = 0; i < listoflists.length; i++) {
    if (document.body.contains(document.getElementById(listoflists[i].innerText))) {
      console.log('group already made')
    } else {
      console.log('group on drop down menu')
      let link = document.createElement("a");
      link.setAttribute('id', listoflists[i].innerText);
      link.setAttribute('href', '#');
      link.innerText = listoflists[i].innerText;
      document.getElementById("myDropdown").appendChild(link);
    }
  }
  document.getElementById("myDropdown").classList.toggle("show");
})

// dropdown button functionality 
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
