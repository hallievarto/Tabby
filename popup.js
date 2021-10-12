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
// })
  // }
}

function onError(error) {
  console.log(`Error: ${error}`);
}

let querying = chrome.tabs.query({currentWindow: true});
querying.then(logTabs, onError);