/*
Flow:
    1. Get all Tabs
    2: Group all Tabs by Domain
    3: Sort Domain lists alphabetically
    3: Make a Tab Group for each Domain list
    4: Insert all Tabs into appropriate group
*/

const button = document.querySelector("button");

/*
async function getTabs(){
  let tabs = await chrome.tabs.query()

  return tabs
}

const tabs = getTabs()
const collator = new Intl.Collator()

console.log(tabs)

tabs.sort((a, b) => collator.compare(a.title, b.title))

const template = document.getElementById("li_template")
const elements = new Set()

for (const tab of tabs) {
  const element = template.content.firstElementChild.cloneNode(true)

  const title = tab.title.split("-")[0].trim()
  const pathname = new URL(tab.url).pathname.slice("/docs".length)

  element.querySelector(".title").textContent = title
  element.querySelector(".pathname").textContent = pathname
  element.querySelector("a").addEventListener("click", async () => {
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true })
    await chrome.windows.update(tab.windowId, { focused: true })
  })

  elements.add(element)
}

document.querySelector("ul").append(...elements)
*/

function groupTabs(tabs){
  var sortedTabs = {}

  console.log("poo")
  console.log(tabs)

  tabs.forEach((tab) => {
    console.log(tab)
    let url
    let urlNoProtocol
    let domain

    try {
      url = new URL(tab.url)
      urlNoProtocol = psl.parse(url.host)
      domain = urlNoProtocol.domain.split(".")[0]
    } catch {
      console.log(tab.url)
      return
    }
    

    if((sortedTabs[domain]) === undefined){
      sortedTabs[domain] = [tab.id]
    } else {
      sortedTabs[domain].push(tab.id)
    }

    console.log(domain)
  })

  console.log(sortedTabs)

  return sortedTabs
  
}

button.addEventListener("click", async () => {
  var tabs = await chrome.tabs.query({currentWindow : true})
  console.log(tabs)

  var url = new URL(tabs[0].url)

  console.log(url)

  const collator = new Intl.Collator()
  tabs.sort((a, b) => collator.compare(a.url, b.url))

  console.log(tabs)

  var dict = groupTabs(tabs)

  for(const [host, tabIds] of Object.entries(dict)) {
    const group = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(group, { title: host, collapsed : true });
  }

  //const tabIds = tabs.map(({ id }) => id);
  //const group = await chrome.tabs.group({ tabIds });
  //await chrome.tabGroups.update(group, { title: "DOCS" });
});