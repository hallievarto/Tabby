
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


// !! This is how you print everything in storage !!
// chrome.storage.local.get(null, function(items) {
//   console.log(items);
// });


// !! This is how you get all things in chrome storage !!
 chrome.storage.local.get(null, function(items) {
  console.log(items);
  for (group in items){
    // console.log(key);
    let myName = document.createElement("p")
    myName.setAttribute('class', 'myGroupName')
    myName.innerHTML = group
    console.log(group)

    let li = document.createElement("div");
    li.setAttribute('id', 'myBoxes');
    myName.appendChild(li)

    // create open and close buttons
    let openButton = document.createElement("button")
    let deleteButton = document.createElement("button")
    openButton.setAttribute('id', 'openDel')
    deleteButton.setAttribute('id', 'openDel')
    openButton.innerHTML = "Open Tabs"
    deleteButton.innerHTML = "Delete Group"
    
    li.appendChild(openButton)
    li.appendChild(deleteButton)
    for (i = 0; i < items[group].length; i++ ) {
      let link = document.createElement("div")
      link.innerHTML = items[group][i]
      link.setAttribute('id', 'myLinks');
      li.appendChild(link)
    }

    document.getElementById("myGroups").appendChild(myName);

    openButton.addEventListener("click", function(){
      openTabs(group)
    });
    deleteButton.addEventListener("click", function(){
    deleteGroup(li.id)
    });

  }
  
});

let currTabs = []
let querying = chrome.tabs.query({currentWindow: true});
querying.then(logTabs, onError);

createGroup.addEventListener("click", async() =>{
  console.log("make new")

  document.getElementById("textbox").innerHTML = "<input type='text' id='GName' placeholder='type group name' /> <button id='NG'> Submit </button>"
  document.getElementById("NG").onclick = submitNewGroup
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
  let deleteButton = document.createElement("button")

  openButton.innerHTML = "<button> Open Tabs </button>"
  deleteButton.innerHTML = "<button> Delete Group </button>"
  li.innerText = tabName;
  li.id = tabName;
  groupNames.appendChild(li);
  li.appendChild(openButton)
  li.appendChild(deleteButton)

  openButton.addEventListener("click", function(){
    openTabs(group)
});
  deleteButton.addEventListener("click", function(){
    deleteGroup(li.id)
  });
}

function openTabs(tabName){
  chrome.storage.local.get(tabName, function(items) {
    if (items[tabName].length > 0){
      for (let i=0; i < items[tabName].length; i++) {
        chrome.tabs.create({url: items[tabName][i]})
      }
    }
  });
}

function deleteGroup(group){
  console.log(group)
  let element = document.getElementById(group);
  element.remove()

  chrome.storage.local.remove(group,function(){
    var error = chrome.runtime.lastError;
       if (error) {
           console.error(error);
       }
   })
}

// add to current tab group button 
addTo.addEventListener("click", async() =>{
  var list = document.getElementById("groupNames");
  var children = list.children;
  for(var i = 0; i < children.length; i++) {
    if (document.body.contains(document.getElementById(children[i].innerText))) {
      console.log('group already made')
    } else {
      console.log('group on drop down menu')
      let link = document.createElement("a");
      link.setAttribute('id', children[i].innerText);
      link.setAttribute('class', 'existingGroups');
      link.innerText = children[i].id;
      document.getElementById("myDropdown").appendChild(link);
    }
  }
  document.getElementById("myDropdown").classList.toggle("show");
})

// listener to add to a curr group
document.body.addEventListener( 'click', function ( event ) {
  if( event.target.className == 'existingGroups' ) {
    var tabGroupName =  event.target.innerText;
    console.log('Saving to ' + tabGroupName);
    chrome.storage.local.get(tabGroupName, function(links) {
      for(var i = 0; i < currTabs.length; i++){
        var exists = false;
        console.log(links);
        for (var j = 0; j < links[tabGroupName].length; j++){
            if(currTabs[i] == links[tabGroupName][j]) {
              console.log(currTabs[i] + " already exists in this group");
              exists = true;
            }
        }
        if(!exists) {
          console.log("Adding " + currTabs[i] + " to group");
          links[tabGroupName].push(currTabs[i]);
          chrome.storage.local.remove(tabGroupName, function(){
            console.log('deleting');
          });
          var save = {};
          save[tabGroupName] = links[tabGroupName];
          chrome.storage.local.set(save, function(){
            console.log('re adding ' + tabGroupName);
          });
        }
      }
    });
  };
});

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
