
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
  // console.log(items[0]);
  
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

// add to current tab group dropdown 
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
      link.setAttribute('class', 'existingGroups');
      link.innerText = listoflists[i].innerText;
      document.getElementById("myDropdown").appendChild(link);
    }
  }
  document.getElementById("myDropdown").classList.toggle("show");
})

// listener to add to a curr group
document.body.addEventListener( 'click', function ( event ) {
  if( event.target.className == 'existingGroups' ) {
    console.log('Saving to ' + event.target.id);
    var tabGroupName =  event.target.id;
    chrome.storage.local.get(tabGroupName, function(links) {
      for(var i = 0; i < currTabs.length; i++){
        var exists = false;
        for (var j = 0; j < links[tabGroupName].length; j++){
            if(currTabs[i] == links[tabGroupName][j]) {
              console.log(currTabs[i] + " already exists in this group");
              exists = true;
            }
        }
        if(!exists) {
          console.log("Adding " + currTabs[i] + " to group");
          // links.push(currTabs[i]);
        }
      }
      var save = {};
      save[tabGroupName] = links;
      chrome.storage.local.set(save, function(){
        console.log(tabGroupName)
      });
    });
  };
} );

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
