//v043 

// RESPOND TO TOOL REGISTRY BUTTON SELECTION (USER'S DASHBOARD, WEBSITE)


/*// RESPOND TO USER CLICKING ICON IN BROWSER'S TOOLBAR (browserAction)
chrome.browserAction.onClicked.addListener(function(tab) { 
	//alert('browser action (icon) has been clicked; attempt message passing to content.js here...');
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
			console.log(response.farewell);
		});
	});
});*/

