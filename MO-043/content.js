//v043 Revising Lesson request, modify styles, add dialog open/close to icons, add Home btn

// PHP FILE PATHS FOR REQUESTING DATA 
var lesson_server	 		= 'https://www.azwaldo.com/MentorsOnline/php/request-current-lesson.php';//red
//var allLinks 		= 'https://www.azwaldo.com/MentorsOnline/php/requestalllinks.php?mentorID=1';//red
var bookmark_server 		= 'https://www.azwaldo.com/MentorsOnline/php/bookmark.php';//green
var canvas_server 	= 'https://www.azwaldo.com/MentorsOnline/php/canvas-exchange-demo.php';//blue
var database_server = 'https://www.azwaldo.com/MentorsOnline/php/database-server.php';

/////////////////////  GLOBAL VARS    //////////////////////////////////////////
/*------  MOVE GLOBAL VARS INTO FXNS BELOW PRIOR TO VERSIONING  --------------*/
var extensionID = "fgbcflecedleolocnbiggiblhdmbbdpe";//valid only during development
// user      STORES SYSTEM USER ID; VALUE ASSIGNED IN ONLOAD EVENT HANDLER (requestUserData)
// mentor    STORES USER ID FOR MENTOR
// homepage  STORES URL USED BY (ORANGE) HOME BTN; UPDATED IN ONLOAD EVENT HANDLER (requestUserData)
// lessonID  STORES ID OF LESSON; USED BY mo_btn_alpha CLICK HANDLER 
//    "        VALUE ASSIGNED IN ONLOAD EVENT HANDLER (requestUserData)
//    "        selectLesson FXN (BELOW) = STUDENT OVERRIDE (WEBSITE: DASHBOARD) 
var user, mentor, homepage;//, lesson;

// INTERFACE (DIALOG ELEMENTS, TRANSPARENT BUTTONS)(HOME BTN CREATED BY ONLOAD EVENT HANDLER)
var dialog_alpha	= '<div id="alpha" title="Current Lesson" style="display:none"></div>';//red btn
var dialog_beta 	= '<div id="beta" title="Bookmark" style="display:none"><div class="mentorsonline">Change information if needed, then select "Save".<div id="mo-bk-url-div"></div><H3>Title</H3><input id="mo-bk-title" type="text"><H3>Description</H3><input type="text" id="mo-bk-desc" rows="3" cols="35"></input><br /><H3>Notes</H3><input type="text" id="mo-bk-notes" rows="3" cols="35"  autofocus></input><br /><button id="mo-button-save">Save</button></div></div>';//green btn
var dialog_gamma	= '<div id="gamma" title="Current Canvas Lesson" style="display:none"></div>';//blue btn
var dialog_chi 		= '<div id="chi" title="dialog_chi_div" style="display:none"></div>';//main btn (lrg, gray)

// CHAT VARS
var x_chat_elements = '<div id="messages-div"></div><div><textarea id="input-chat" autofocus></textarea></div>';
var x_chat_intake = "https://www.azwaldo.com/MentorsOnline/php/chat_intake.php";
var x_chat_server = "https://www.azwaldo.com/MentorsOnline/php/chat_server.php";
var dialogOpen, dialogBuilt;// Tracking chat div element's state; open or closed, built already or not yet built
//var username = "MentorsOnline.043";// Assign username (prepended to chat input); Temporary, pending login protocol for the tool 
var source, chat_send_btn, chat_input_text, chat_messages_div, chat_conx_btn, chat_disconx_btn, last_data;

/////////////////////  FUNCTIONS    ////////////////////////////////////////////
function init() {
    // This fxn is called conditionally on document.readyState eval (see last 
    // lines, this document); First, manage some data when window location is 
    // user's Dashboard at website	
    if ( window.location.href == "https://www.azwaldo.com/MentorsOnline/dashboard.php" ) {
        
        /*-- Accommodate user selection of lesson in Dashboard, if any 
             (User may be returning to Dashboard already logged in --*/
        chrome.storage.local.get('user', function (result) { 
            if ( result.user == "" ) {
                console.log('<init> user VAR IS EMPTY (read hidden id, request user data)');
                
                // New session, user has just signed in to site
                // Read user id from hidden field, request user info from server
                if ( document.getElementById('userID_hidden') ) {
                    
                    // Found hidden id, proceed...
                    var myUser = document.getElementById('userID_hidden').value;
                    
                    if ( myUser == "" ) console.log('<init> userID_hidden is empty');
                    if ( myUser === undefined ) console.log('<init> userID_hidden is undefined');
                    if ( myUser === null ) console.log('<init> userID_hidden is null');
                    
                    console.log('<init> setting storage.local(user): ' + myUser);
                    chrome.storage.local.set({ 'user': myUser }, function() {
                        //console.log('> init fxn: in dashboard, setting storage.local(user): ' + myUser);
                        requestUserData(myUser);
                        //reportLocalStorage();
                    });z
                    
                    /* NEED TO SET LOCAL STORAGE: SELECTED LESSON = MENTOR'S ASSIGNED LESSON*/
                    //selectLesson(selection)
                    
                    // Fetch hidden lesson id
                    var myAssignedLesson = document.getElementById('assigned_lesson').value;
                    console.log('<init> New session: myAssignedLesson: ' + myAssignedLesson);
                    
                    chrome.storage.local.set({'lesson': myAssignedLesson});
                    
                    
                    
                } else {
                    
                    // DID NOT FIND hidden id...
                    // (User may have bookmarked Dashboard, returning again after Logout)
                    console.log('<init> userID_hidden not found');
                    
                    var r = confirm("You have not signed in. Return to Home Page to login?");
                    if (r == true) {
                        window.location = "https://www.azwaldo.com/MentorsOnline/index.php";
                    } 
                    
                }
                
            } else {
            
                console.log('<init> storage.local not empty; user = ' + result.user);
                
                // Not a fresh login (returning to Dashboard, already signed in)
                // Check for user selection of lesson, compare with hidden lesson id
                var myAssignedLesson = document.getElementById('assigned_lesson').value;
                console.log('<init> myAssignedLesson: ' + myAssignedLesson);
                
                chrome.storage.local.get('lesson', function (result) { 
                    console.log('<init> storage.local lesson: ' + result.lesson);
                    var mySelectedLesson = result.lesson;
                    console.log('>>> mySelectedLesson: ' + mySelectedLesson);
                    
                    /*<<<<<<<<<------------                RETURN HERE         ---------------XXXXXXXXXXXXXXXXX*/
                    if ( mySelectedLesson != myAssignedLesson ) {
                        // User has selected a lesson other than assigned lesson during session
                        // Highlight that item in list
                        var lessons = document.getElementsByName('current_lesson');
                        for (var i = 0, length = lessons.length; i < length; i++) {
                            //console.log('lessons[' + i + '].value = ' + lessons[i].value);
                            if ( lessons[i].value == mySelectedLesson ) {
                                console.log('+ + + lessons[' + i + '].value == mySelectedLesson + + +');
                                lessons[i].checked = true;
                            } else {
                                lessons[i].checked = false;
                            }
                        }
                    }
                    
                });
                
            }
        });
        
        
        // LISTEN FOR USER SELECTION OF LESSON (RADIO BTNS)
        $('input[type="radio"]').on('change', function(e) {
            //http://stackoverflow.com/a/9618826
            //console.log(e.type);
            var lessons = document.getElementsByName('current_lesson');
            for (var i = 0, length = lessons.length; i < length; i++) {
                if (lessons[i].checked) {
                    //console.log("lessons selected: " + lessons[i].value);
                    lessons[i].onclick = selectLesson(this);
                    //break;
                }
            }
        });
        
    } else if ( window.location.href == "https://www.azwaldo.com/MentorsOnline/logout.php" ) {
        
        // USER HAS ELECTED TO LOG OUT WITHIN WEBSITE, CLEAR VARS FOR NEXT USER
        // EMPTY ALL CHROME.STORAGE VARIABLES	
        chrome.storage.local.set({'user': ""});
        chrome.storage.local.set({'mentor': ""});
        chrome.storage.local.set({'homepage': ""});
        chrome.storage.local.set({'lesson': ""});
        chrome.storage.local.set({'role': ""});
        
        // Can this application disable itself, resulting in "Enabled" box being unchecked?
        // See: https://developer.chrome.com/extensions/management#method-uninstallSelf
        // See: https://developer.chrome.com/extensions/management#method-setEnabled
        
        // Report local storage vars to console; verify user info is cleared
        reportLocalStorage();
        
        //alert('The MentorsOnline browser extension works ONLY if you are logged in to the website.\n\nTo disable the extension, uncheck "Enabled" in the Extensions control panel.\n\n(Use the "Install" link on this page to re-visit the installation guide.)');
      
    } else {
    
        // NOT IN USER'S DASHBOARD; GET USER ID FROM STORAGE.LOCAL AND REQUEST USER DATA
        chrome.storage.local.get('user', function (result) {
        
            console.log('<init> Not in user dashboard; storage.local(user) = ' + result.user);	
            
            if ( result.user === null ) {
                console.log('% % % -  UNEXPECTED RESULT: content.js    -% % %');
                console.log('% % % -     user var is null on init      -% % %');
            } else {
                reportLocalStorage();
            }
          
        });
          
    }
    
    /*// If user's selected lesson is not stored locally, default to mentors assigned lesson. 
      // Logout clears local storage; so, on tool init,
      // if no local storage...get mentor's assigned lesson
      
    chrome.storage.local.get('user', function (result) { 
        if ( result.user == "" ) console.log('chrome.storage.local result.user var is empty');
        if ( result.user === undefined ) console.log('chrome.storage.local result.user var is undefined');
        if ( result.user ) console.log('chrome.storage.local result.user: ' + result.user);	
    });*/
    
    // Insert user interface (dialog elements, transparent buttons)
    
    $("body").append(dialog_alpha);
    $("body").append(dialog_beta);
    $("body").append(dialog_gamma);
    $("body").append(dialog_chi);
    $("body").append('<div id="mo_btn_alpha"></div>');
    $("body").append('<div id="mo_btn_beta"></div>');
    $("body").append('<div id="mo_btn_gamma"></div>');
    $("body").append('<div id="mo_btn_delta"></div>');
    $("body").append('<div id="mo_btn_chi"></div>');
  
    // Attach click event handlers for UI elements 
    
    $("#mo_btn_alpha").click(function(){
        chrome.storage.local.get('lesson', function (result) { 
            console.log('#mo_btn_alpha click, storage.local > lesson: ' + result.lesson);
            openLessonDialog(result.lesson);
        });
    });
    
    $("#mo_btn_beta").click(function(){
        chrome.storage.local.get('user', function (result) { 
            console.log('#mo_btn_beta click, storage.local > user: ' + result.user);
            openBookmarkDialog(result.user);
        });
    });
    
    $("#mo_btn_gamma").click(function(){
        // PASS ID OF MENTOR, USER, OR LESSON WITH FXN CALL WHEN MODIFIED
        openCanvasLessonDialog();
    });
  
    // delta btn (orange) > opens home page
    $("#mo_btn_delta").click(function(){
        chrome.storage.local.get('homepage', function (result) { 
            console.log('chrome.storage.local.get finds homepage: ' + result.homepage);
            window.location = result.homepage;
        });
    });	
    
    // main btn (gray) > chat
    $("#mo_btn_chi").click(function(){
        openChatDialog();
    });
    
    //console.log( "(content.js) <init> complete..." );
    
    //reportLocalStorage();
    
};

function reportLocalStorage() {
	console.log("===Reporting ALL local storage items===");
	// Print out local storage area
	//chrome.storage.local.get(null, function(all) {
		//console.log(JSON.stringify(all));
	//});
	
	chrome.storage.local.get('user', function (result) { console.log('user: ' + result.user);	});
	chrome.storage.local.get('mentor', function (result) { console.log('mentor: ' + result.mentor);	});
	chrome.storage.local.get('homepage', function (result) { console.log('homepage: ' + result.homepage);	});
	chrome.storage.local.get('lesson', function (result) { console.log('lesson: ' + result.lesson);	});
	chrome.storage.local.get('role', function (result) { console.log('role: ' + result.role);	});
	
}

function requestUserData(id) {
    //console.log( "requestUserData fxn called...");
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
    
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          
            //console.log( "requestUserData fxn; xhttp.responseText: " + xhttp.responseText);
            
            // PARSE RESULTS
            var myDataObj = JSON.parse(xhttp.responseText);
            var userdata = myDataObj.userdata;
            //console.log( "userdata(stringified): " + JSON.stringify(userdata) );
            
            // ASSIGN VALUES TO CHROME.STORAGE VARIABLES	
            //chrome.storage.local.set({'user': id});
            chrome.storage.local.set({'mentor': userdata["mentorID"]});
            chrome.storage.local.set({'homepage': userdata["homepageURL"]});
            
            /*-- Accommodate user selection of lesson in Dashboard, if any 
                 (User may be returning to Dashboard already logged in --*/
            /*chrome.storage.local.get('lesson', function (result) { 
                if ( result.lesson == "" ) {
                    console.log('>>> requestUserData LESSON VAR IS EMPTY');
                    console.log('>>> setting storage.local: ' + userdata["currentLessonID"]);
                    chrome.storage.local.set({'lesson': userdata["currentLessonID"]});
                } else {
                    console.log('>>> requestUserData lesson: ' + result.lesson);
                    
                }
            });*/
            
            chrome.storage.local.set({'lesson': userdata["currentLessonID"]});
            chrome.storage.local.set({'role': userdata["userRole"]});
            
            reportLocalStorage();
          
        }
      
    };
    
    xhttp.open("POST", database_server, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("mode=getUserData&userID=" + id);
    
}

function selectLesson(selection) {
    
    //console.log( "selectLesson fxn called...");
    // User has selected a lesson in dashboard for loading into the tool
		var myLesson = selection.value;
		console.log( "selectLesson fxn sees selection ID: " + myLesson);
		
		//find userID, passed to database-server to store selection
		var myUser = document.getElementById('userID_hidden').value;/* READ VAR FROM STORAGE.LOCAL ?? ?? */
		console.log( "selectLesson fxn sees user: " + myUser);
				
		/*check if dialog is open; if so, just load...else load and open*/
		
		/*<<<<<<<<<------------                    RETURN HERE            --------------------XXXXXXXXXXXXXXXXX*/
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log( "selectLesson fxn; xhttp.responseText: " + JSON.stringify(xhttp.responseText));
				chrome.storage.local.set({'lesson': myLesson});
				
			};
		}
		xhttp.open("POST", database_server, true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		var params = "mode=selectLesson&userID=" + myUser + "&selectedLessonID=" + myLesson;
		xhttp.send(params);
		/*<<<<<<<<<------------                                           --------------------XXXXXXXXXXXXXXXXX*/
		
		
		
		// FETCH AND LOAD DATA 
		var params = "?requestLessonID=" + myLesson + "&user=" + myUser;
		console.log( "selectLesson params: " + params);
		
		$( "#alpha" ).load( lesson_server + params, function() {
			//var linkslist = document.getElementsByClassName("mo-alpha")[0];//element's classname as returned by server
			//$( "#alpha" ).data("title", "Mentor's Links");
			//console.log( "#alpha data: " + JSON.stringify( $( "#alpha" ).data("title") ));
			//$( "#alpha .mo-alpha" ).css({ "font-size": 'small'});
			//$( "#alpha .mo-alpha" ).css({ "text-align": 'left'});
			//$( "#alpha .mo-alpha" ).css({ "height": '290'});
			//$( "#alpha" ).css({ "z-index": '9999'});
		});
	
}

//scrapeSiteInfo evaluates page meta data; used in bookmark feature (mo_btn_beta click handler)
function scrapeSiteInfo() {

	var t = window.document.title;
	var u = window.location.href;
	var d, c, n, p, h, ch;
	//console.log( "url: " + u );
	
	// Description may be meta>name or meta>property
	//   sort through all meta tags, report oddballs in console
	//   post oddballs to DB for evaluation? 
	var metas = document.getElementsByTagName('meta'); 
	for (i=0; i<metas.length; i++) {
		c = metas[i].getAttribute("content");
		if (c) {
			n = metas[i].getAttribute("name");
			if (n) {
				if ( n === "description") d = c;
				else console.log("meta tag [" + i + "] " + n + "=" + c);
			} else {
				p = metas[i].getAttribute("property");
				if (p) {
					if ( p === "og:description" )	d = c;
					else console.log("meta tag [" + i + "] " + p + "=" + c);
				} else {
					console.log("meta tag [" + i + "] attribute NOT RECOGNIZED (neither name nor property)");
				}
			}
		} else {
			console.log( "meta tag [" + i + "] NO CONTENT: " + metas[i] );
			h = metas[i].getAttribute("http-equiv");
			if (h) {
				console.log("tag [" + i + "] http-equiv=" + h);
			} else {
				ch = metas[i].getAttribute("charset");
				if (ch) console.log("tag [" + i + "] charset=" + ch);
				else console.log( "(last test) meta tag [" + i + "] NOT RECOGNIZED: " + metas[i] );
			}
		}
	} 
	if (!d) d = "blank";
	return [t, u, d];
}


// Browser action communications
/*function browserActionClickResponse() {
	console.log('browser action clicked (message passing); content.js > fxn called');
}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : browserActionClickResponse());
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  }
);*/

// Chat fxns
var xhr = new XMLHttpRequest();
function sendMsg(){
    chat_send_btn.disabled = true;
    xhr.open("POST", x_chat_intake);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        console.log('xhr.onload event captured; xhr.responseText: ' + xhr.responseText);
        console.log('xhr.readyState: " + xhr.readyState + "; xhr.status: ' + xhr.status);
        if(xhr.readyState == 4 && xhr.status == 200) {
          console.log('onload > readystate: 4; status : 200');
          chat_send_btn.disabled = false;
          chat_input_text.value = "";
        }
    }
    
    xhr.onerror = function() {
        console.log('There was an error!');
    };
      /*<<<<<<<<<------------                    RETURN HERE            --------------------XXXXXXXXXXXXXXXXX*/
    var username = document.getElementById('username_hidden').value;/* READ VAR FROM STORAGE.LOCAL ?? ?? */
    console.log( "sendMsg fxn sees username: " + username);
  
    xhr.send( "username=" + username + "&text=" + chat_input_text.value );
    $('#chat_input_text').attr("placeholder", "");
}

function connect(){
	if(window.EventSource){
		console.log('connect fxn called, window.EventSource confirmed');
		source = new EventSource(x_chat_server);
		source.addEventListener("message", function(event){
			if(event.data != last_data && event.data != ""){
				console.log('source event captured (message)');
				//chat_messages_div.innerHTML += event.data+"<hr>";
				
				var newLI = document.createElement("li"); 
				var node = document.createTextNode(event.data); 
				newLI.appendChild(node); 
				document.getElementById("messages-div").appendChild(newLI);
        
        var objDiv = document.getElementById("messages-div");
        objDiv.scrollTop = objDiv.scrollHeight;
        //console.log('objDiv.scrollHeight: ' +objDiv.scrollHeight);
				
			}
			last_data = event.data;
		});
		chat_send_btn.disabled = false;
		//chat_conx_btn.disabled = true;
		//chat_disconx_btn.disabled = false;
    
      /*<<<<<<<<<------------                    RETURN HERE            --------------------XXXXXXXXXXXXXXXXX*/
    var username = document.getElementById('username_hidden').value;/* READ VAR FROM STORAGE.LOCAL ?? ?? */
    console.log( "connect fxn sees username: " + username);
		
		xhr.open("POST", x_chat_intake);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send("username="+username);
		
	} else {
		alert("event source does not work in this browser, author a fallback technology");
		// Program Ajax Polling version here or another fallback technology like flash
	}
}

function disconnect(){
    source.close();
    //chat_disconx_btn.disabled = true;
    //chat_conx_btn.disabled = false;
    chat_send_btn.disabled = true;
		console.log('disconnect selected; xhr.readyState: ' + xhr.readyState);
}

function resetMsg() {
	document.getElementById("input-chat").value = '';
	console.log('chat-reset-btn clicked');
}


// openLessonDialog CALLED BY CLICK HANDLER (init) for ALPHA BTN (red)
function openLessonDialog(id) {
	if ( !$("#alpha").dialog("instance") ) {
		
		console.log('openLessonDialog sees id: ' + id);
		
		// If selection was made in dashboard, overwrite var//<<--- REVISE TO USE database-server.php
		//if ( lesson != 0 ) lessonRequest = lesson + "?requestLessonID=" + lesson;
		//else lessonRequest = lesson + "?requestLessonID=" + lesson;
		var lessonRequest = lesson_server + "?requestLessonID=" + id;
		
		$( "#alpha" ).load( lessonRequest, function() {
			//var linkslist = document.getElementsByClassName("mo-alpha")[0];//element's classname as returned by server			//$( "#alpha" ).data("title", "Mentor's Links");//console.log( "#alpha data: " + JSON.stringify( $( "#alpha" ).data("title") ));//$( "#alpha .mo-alpha" ).css({ "font-size": 'small'});//$( "#alpha .mo-alpha" ).css({ "text-align": 'left'});//$( "#alpha .mo-alpha" ).css({ "height": '290'});	//$( "#alpha" ).css({ "z-index": '9999'});
		}).dialog({
			fontSize: "small", width: 500, height: 350, title: $('#alpha').data('title'), //will set dialog title
			position: { "my": "left top", "at": "left top", "of": window }
		});
		
		//http://stackoverflow.com/questions/18334307/how-do-i-replace-change-the-heading-text-inside-h1-h1-using-javascript
		//document.getElementById('title').getElementsByTagName('span')[0].innerHTML = 'Goodbye';
		//var myTitle = document.getElementById('alpha').getElementsByTagName('h1')[0].innerHTML;
		//$('#alpha span.ui-dialog-title').prop('title', myTitle); 
		
	} else if ( $("#alpha").dialog("isOpen") ) {
		$("#alpha").dialog("close");
	} else {
		$("#alpha").dialog("open");
	}
}

// openBookmarkDialog CALLED BY CLICK HANDLER (init) for BETA BTN (green) 
function openBookmarkDialog(id) {
  console.log('openBookmarkDialog called with id: ' + id);
	if ( !$("#beta").dialog("instance") ) {
		$( "#beta" ).dialog({
			width: 600,
			height: 450,
			title: "Bookmarking Tool", //will set dialog title
			position: {
				"my": "left top",
				"at": "left+50 top+50",
				"of": window
			}
		});
		
		// Grab website's info
		var siteData = scrapeSiteInfo();//vars returned in order: [t,u,d]
		console.log("siteData[0]: " + JSON.stringify(siteData[0]));
		
		// Sort meta info, pass to PHP file
		var e = document.getElementById("mo-bk-title");
		e.value = siteData[0];
		e = document.getElementById("mo-bk-url-div");
		e.innerHTML = "URL: " + siteData[1];
		e = document.getElementById("mo-bk-desc");
		
		// If no meta description provided by website, assign placeholder
		if ( siteData[2] != "blank" ) {
			e.value = siteData[2];
			console.log('site description: ' + siteData[2]);
		} else {
			e.placeholder = "Site provides no description.";
			console.log('site description found blank');
		}
		
		// If description is long, reset input element's height and set overflow scroll 
		/*if ( e.value.length > 34 ) {
			console.log('description longer than 34 chars...');
			e.style.height = "auto";
			e.style.overflow = "scroll";
		}*/
		
		
		$( "#mo-button-save" ).click(function() {

			var e = document.getElementById("mo-bk-title");
			var myTitle = e.value;

			e = document.getElementById("mo-bk-desc");
			var myDesc = e.value;
      
			e = document.getElementById("mo-bk-notes");
			var myNotes = e.value;
      
      console.log('myTitle: ' + myTitle);
      console.log('myDesc: ' + myDesc);
      console.log('myNotes: ' + myNotes);
			
			data = "userID=" + id;
			data += "&title=" + encodeURIComponent(myTitle);
			data += "&url=" + encodeURIComponent(siteData[1]);//This var cannot be altered by user
			data += "&description=" + encodeURIComponent(myDesc);
			data += "&notes=" + encodeURIComponent(myNotes);
      
      
			//console.log('data: ' + data);
			
			$("#beta").load( bookmark_server, data, function(responseTxt, statusTxt, xhr){
					if(statusTxt == "success")
							console.log('Bookmark success');
					if(statusTxt == "error")
							console.log('Error: ' + xhr.status + ': ' + xhr.statusText);
			});
			
		});	
	} else if ( $("#beta").dialog("isOpen") ) {
		$("#beta").dialog("close");
	} else {
		$("#beta").dialog("open");
	}
}

// openCanvasLessonDialog CALLED BY CLICK HANDLER (init) for GAMMA BTN (blue)  
function openCanvasLessonDialog() {
	if ( !$("#gamma").dialog("instance") ) {
		$( "#gamma" ).load( canvas_server, function() {
			//var lesson = document.getElementsByClassName("lesson")[0];
			//lesson.firstElementChild.style.display = 'none';
			//$( "#gamma" ).data("title", lesson.firstElementChild.innerHTML);
			//console.log( "#gamma data > title: " + JSON.stringify( $( "#gamma" ).data("title") ));
			//$( "#gamma .lesson" ).css({ "font-size": 'small'});
			//$( "#gamma .lesson" ).css({ "text-align": 'left'});
			//$( "#gamma .lesson" ).css({ "height": '290'});
			//$( "#gamma .lesson" ).css({ "z-index": '9999'});
		}).dialog({
			width: 500,
			height: 350,
			title: "Imported Lesson (Canvas API)", //will set dialog title
			position: {
				"my": "left top",
				"at": "left+100 top+100",
				"of": window
			}
		});		
	} else if ( $("#gamma").dialog("isOpen") ) {
		$("#gamma").dialog("close");
	} else {
		$("#gamma").dialog("open");
	}
}

// openChatDialog CALLED BY CLICK HANDLER (init) for main (gray)  
function openChatDialog() {
  
	// Was main btn clicked while chat panel is open?
	if (!dialogOpen) {
	
		$( "#chi" ).dialog({
			autoOpen: true,
			height: 450,
			width: 600,
			modal: false,
			title: "Public Chat", //will set dialog title
			position: {
				"my": "center top",
				"at": "center top+25",
				"of": window
			},		
			buttons: {
				"Send" : {
					text: "SEND",
					id: "chat-send-btn",
					click: function(){
						sendMsg();
					}   
				},
				"Reset" : {
					text: "RESET",
					id: "chat-reset-btn",
					click: function(){
						resetMsg();
					}
				}
			},
			close: function() {
				disconnect();
				dialogOpen = 0;
				//dialogReturning = 1;
			}
		});
		
		// Add chat fields if newly instantiating dialog element
		if (!dialogBuilt) {
			$( "#chi" ).append(x_chat_elements);
			dialogBuilt = 1;
		}
		
		chat_messages_div = document.getElementById("messages-div");
		chat_send_btn = document.getElementById("chat-send-btn");
		//chat_conx_btn = document.getElementById("conx-btn");
		//chat_disconx_btn = document.getElementById("disconx-btn");
		chat_input_text = document.getElementById("input-chat");
		
		connect();
		
		dialogOpen = 1;
		console.log('opening chat dialog; dialogOpen: ' + dialogOpen);
		
	} else {
		// Main btn click while chat is open, close chat
		console.log('closing chat dialog');
		disconnect();
		$( "#chi" ).dialog( "close" );
		dialogOpen = 0;
		
	}
	// Keep next two lines, pending local storage of position (eval window size on start?)
	//console.log('#chi outerHeight: ' + $( "#chi" ).outerHeight( true ));
	//console.log('#chi innerHeight: ' + $( "#chi" ).innerHeight());
}

document.onreadystatechange = function () {
  console.log('onreadystatechange >> document.readyState=' + document.readyState);	
}	

/*if ( document.readyState == "complete" ) {
	console.log('? ? UNEXPECTED: readyState==complete ? ?');
	console.log('? ? ?   (calling init fxn here)    ? ? ?');
	init();
} else if ( document.readyState == "interactive" ) {
	console.log('+ + + readyState == interactive + + +');
	console.log('+ + +  (calling init fxn here)  + + +');
	init();
} else {	
	console.log('? UNEXPECTED: document.readyState=' + document.readyState + ' ?');
	console.log('? ?   setting onreadystatechange handler  ? ?');	
	document.onreadystatechange = function () {
		if ((document.readyState === "interactive") || ( document.readyState === "complete" )) {
			console.log('onreadystatechange event fired, document.readyState: ' + document.readyState);	
			console.log('+ + +  (calling init fxn here)  + + +');
			init();
		}
	}	
}*/
if ( document.readyState == "complete" ) {
	console.log('? ?       UNEXPECTED RESULT       ? ?');
	console.log('? content.js > readyState==complete ?');
	console.log('? ?   (calling init fxn anyway)   ? ?');
	init();
} else {	
	//console.log('+ + + setting onreadystatechange handler + + +');	
	document.onreadystatechange = function () {
		if ( document.readyState === "complete" ) {
			//console.log('+ + +  onreadystatechange handler calling init + + +');
			init();
		}
	}	
}
//console.log( "(content.js) loaded..." );