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
    let li = document.createElement("li");
    li.innerText = tab.title;
    list.appendChild(li);
  }
}

// function makeBigger() {
//   let button = document.getElementById("goHome");
//   // button.onclick(window.resizeTo(400,600));
//   button.onclick(chrome.windows.update(windowId, { state: "fullscreen" })
  
// }

function onError(error) {
  console.log(`Error: ${error}`);
}

let querying = chrome.tabs.query({currentWindow: true});
querying.then(logTabs, onError);

let homeButton = document.getElementById("goHome");
if(homeButton){
  console.log("HI");
  console.log(chrome.windows.getCurrent());
  homeButton.addEventListener("click", async () => {
    document.body.style.width = "800px"
    document.body.style.height = "600px"
    // this part is trying to switch to the home page of the extension. right now you have to click twice on the tabby extension to get it to swtich
    // console.log(chrome.action.getPopup(chrome.tabs.getCurrent()))
    // chrome.action.setPopup({popup: "home.html"});
    // console.log(chrome.action.getPopup(chrome.tabs.getCurrent()))
  });
}