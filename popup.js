
function logTabs(tabs) {
  let list = document.getElementById("myList");
  for (let tab of tabs) {
    // tab.url requires the `tabs` permission or a matching host permission.
    // alert(tab.url);
    currTabs.push(tab.url)
    let li = document.createElement("li");
    li.innerText = tab.title;
    list.appendChild(li);

    master['currTabUrls'].push(tab.url)
    master['currTabTitles'].push(tab.title)

    console.log(master)
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
    // create a new div for an entire group
    let myNewBox = document.createElement("div")
    myNewBox.setAttribute('class', 'myBoxes');
    myNewBox.setAttribute('id', group)

    // create the title to the box and append it to the new div
    let myName = document.createElement("p")
    myName.setAttribute('id', 'myGroupName')
    myName.innerHTML = group
    myNewBox.appendChild(myName);
    console.log(group)

    // create open and close buttons amnd append them to new div
    let openButton = document.createElement("button")
    let deleteButton = document.createElement("button")
    openButton.setAttribute('id', 'openDel')
    deleteButton.setAttribute('id', 'openDel')
    openButton.innerHTML = "Open Tabs"
    deleteButton.innerHTML = "Delete Group"
    myNewBox.appendChild(openButton)
    myNewBox.appendChild(deleteButton)

    for (i = 0; i < items[group]['titles'].length; i++ ) {
      let link = document.createElement("div")
      link.innerHTML = items[group]['titles'][i]
      link.setAttribute('id', 'myLinks');
      myNewBox.appendChild(link)
    }

    document.getElementById("myGroups").appendChild(myNewBox);

    openButton.addEventListener("click", function(){
      openTabs(myNewBox.id)
    });
    deleteButton.addEventListener("click", function(){
      deleteGroup(myNewBox.id)
    });

  }
  
});

let master = {}
master['currTabUrls'] = []
master['currTabTitles'] = []
let currTabs = []
let nameList = []
let querying = chrome.tabs.query({currentWindow: true});
querying.then(logTabs, onError);

createGroup.addEventListener("click", async() =>{
  console.log("make new")

  document.getElementById("textbox").innerHTML = "<input type='text' id='GName' placeholder='type group name' /> <button id='NG'> Submit </button>"
  document.getElementById("NG").onclick = submitNewGroup
})

function submitNewGroup(){

  var tabName = document.getElementById("GName").value;
  let tempName = tabName
  if (tempName.trim().length === 0){
    alert("Invalid name! Please enter a name with at least 1 character.");
  }
  else if(nameList.includes(tabName)){
    alert("Group name already exists! Please create a unique group name or add to an existing group.");
  }
  else{

    nameList.push(tabName);
    console.log(tabName)

    
    var save = {}
    // save[tabName] = currTabs
    save_dict = {}
    save_dict['urls'] = master['currTabUrls']
    save_dict['titles'] = master['currTabTitles']
    save[tabName] = save_dict
    chrome.storage.local.set(save, function(){
      console.log(tabName)
    });
    chrome.storage.local.get(save, function (obj) {
      console.log(obj);
    });

    // create a new div for an entire group
    let myNewBox = document.createElement("div")
    myNewBox.setAttribute('class', 'myBoxes');
    myNewBox.setAttribute('id', tabName)

    // create the title to the box and append it to the new div
    let myName = document.createElement("p")
    myName.setAttribute('id', 'myGroupName')
    myName.innerHTML = tabName
    myNewBox.appendChild(myName);
    // console.log(group)

    // create open and close buttons amnd append them to new div
    let openButton = document.createElement("button")
    let deleteButton = document.createElement("button")
    openButton.setAttribute('id', 'openDel')
    deleteButton.setAttribute('id', 'openDel')
    openButton.innerHTML = "Open Tabs"
    deleteButton.innerHTML = "Delete Group"
    myNewBox.appendChild(openButton)
    myNewBox.appendChild(deleteButton)

    for (i = 0; i < master['currTabTitles'].length; i++ ) {
      let link = document.createElement("div")
      link.innerHTML = master['currTabTitles'][i]
      link.setAttribute('id', 'myLinks');
      myNewBox.appendChild(link)
    }

    document.getElementById("myGroups").appendChild(myNewBox);

    openButton.addEventListener("click", function(){
      openTabs(myNewBox.id)
    });
    deleteButton.addEventListener("click", function(){
      deleteGroup(myNewBox.id)
    });
  }
  

}

function openTabs(tabName){
  chrome.storage.local.get(tabName, function(items) {
    console.log(items)
    if (items[tabName]['urls'].length > 0){
      for (let i=0; i < items[tabName]['urls'].length; i++) {
        chrome.tabs.create({url: items[tabName]['urls'][i]})
      }
    }
  });
}

function deleteGroup(group){
  console.log(group)
  let element = document.getElementById(group);
  // let element = document.getElementsByClassName(group);
  console.log(element)
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
  var list = document.getElementById("myGroups");
  var second = list.children;
  var theBox = second.children;
  // var children = document.getElementById("myGroupName");
  
  //console.log(second)
  //console.log(theBox)
  for(var i = 0; i < second.length; i++) {
    console.log('this is where to look')
    console.log(second[i].firstChild.innerText)
    if (document.body.contains(document.getElementById(second[i].firstChild.innerText + 'List'))) {
      console.log('group already made')
    } else {
      console.log('group on drop down menu')
      let link = document.createElement("a");
      link.setAttribute('id', second[i].firstChild.innerText + 'List');
      link.setAttribute('class', 'existingGroups');
      link.innerHTML = second[i].firstChild.innerText;
      document.getElementById("myDropdown").appendChild(link);
    }
  }
  document.getElementById("myDropdown").classList.toggle("show");
})

// listener to add to a curr group
document.body.addEventListener( 'click', function ( event ) {
  if( event.target.className == 'existingGroups' ) {
    var tabGroupName =  event.target.innerText;
    console.log('this is what ')
    console.log(event.target.innerText)
    console.log('Saving to ' + tabGroupName);
    chrome.storage.local.get(tabGroupName, function(links) {
      console.log(links)
      for(var i = 0; i < master['currTabUrls'].length; i++){
        var exists = false;
        console.log(links);
        for (var j = 0; j < links[tabGroupName]['urls'].length; j++){
            if(master['currTabUrls'][i] == links[tabGroupName]['urls'][j]) {
              console.log(master['currTabUrls'][i] + " already exists in this group");
              exists = true;
            }
        }
        if(!exists) {
          console.log("Adding " + master['currTabUrls'][i] + " to group");
          links[tabGroupName]['urls'].push(master['currTabUrls'][i]);
          links[tabGroupName]['titles'].push(master['currTabTitles'][i]);
          chrome.storage.local.remove(tabGroupName, function(){
            console.log('deleting');
          });

          var save = {};
          temp_dict = {}
          temp_dict['urls'] = links[tabGroupName]['urls']
          temp_dict['titles'] = links[tabGroupName]['titles']
          save[tabGroupName] = temp_dict
          chrome.storage.local.set(save, function(obj){
            console.log('re adding ' + tabGroupName);
            console.log(obj)
          });
          chrome.storage.local.get(save, function (obj) {
            console.log(obj);
          });


          let link = document.createElement("div")
          link.innerHTML = master['currTabTitles'][i]
          link.setAttribute('id', 'myLinks');
          // myNewBox.appendChild(link)
          console.log(tabGroupName)
          document.getElementById(tabGroupName).appendChild(link)


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
