README_MO-044.txt 
MentorsOnline Browser Extension 
V. 0.44 **The Chopper** - Demo for WebRangers Project
Building a stripped down version of theTool, repurposed for collaboration
------------------------------------------------------------------------
  Button					Function
	------					--------
	alpha (red)			
	beta  (green)		
	gamma (blue)		
	beta  (orange)  
	chi   (gray)		
------------------------------------------------------------------------
MAJOR FEATURES
TBD
--------
MAJOR CHANGES
A. Styles
  - PHP now 
B. Implemented init fxn, 
C. Implemented use of chrome.local.storage to pass vars across domains
D. Added UI element: Home button (mentor assigns homepage URL) 
E. Assigned high z-index to UI elements (extension.css)<-See ISSUES[3]
--------
ISSUES
1. widgets get lost on Twitter scroll (also on page reload?)
2. cross-tab messaging for persistent Config State of UI 
    Lesson/Unit content, 
    last DIVs open, 
    localStorage chrome.storage “content scripts can directly access 
    user data without the need for a background page”
3. Optimization
    request (.load) modal content on launch of extension?
    When to cache?
4. extension. sprite image files not loading (for close button): 
    "Failed to load resource: the server responded with a status of 
    404 (Not Found)"
Referring to files bg images info at developer.chrome.com 
5. Updating Mentor Status and Notifications data - many user actions can 
    prompt a server request for updates; but, does this increase bandwidth 
    substantially, unnecessarily?
6. Tracking the User
    User time on task -
    Does a student’s performance on an end-of-Unit vocab quiz correlate 
        to their total time in “session”?
    Can we display for the teacher the average time per link, per lesson, 
        spent by each user?
    Store data in client pending exit, other major event to minimize 
        server requests? 
7. Monitoring the System - observe the time needed for a behaviour 
    to occur; for example:
        Average Response time to HTTP Requests
------------------------------------------------------------------------
Backburner
Mentor's Dashboard 
    Add form to change homepage URL
    Add form to change pass key
Test: Does JS change to dialog element in one tab affect same element in other tab??
site_footer.php: DISPLAY ALL SESSION VARS only if userID is less than X (Lebowskis)
Create DevAdmin Dashboard
    button: clear all storage.local values
    btn: show all students active in last five minutes
generate list of single use passkeys?? (expire after time period, or once used) 
change mentorID to userID in DB links table (affects: database, php, tool )
    in tool: Bookmarking
    bookmark.php 
    request-current-lesson.php 
    dashboard.php
    viewlinks.php (if not obsolete)
    viewlessons.php (if not obsolete)
Consider: Hide lesson select buttons if new user
    New Button (Mentors Only): Display Current Lesson for All Students
    add responsive styles to stylesheet (make site readable for handhelds)
    Consider grabbing more robust profile in Bookmarking scrape, possibly fetch 
    document.doctype
    document.domain
    document.lastModified
    meta author
    article:published_time (The Open Graph protocol)
    article:modified_time
    (other OG items?)
    URLs for testing scrape
        https://azwaldo.com/wordpress/2016/07/17/every-teacher-a-curriculum-designer/ 
        http://www.flaticon.com/ 
        https://paulund.co.uk/html5-placeholder 
Bookmarking: Possible features
    option: "Open in Dashboard" (send scraped info as params)
    option: add to lesson (drop-down list of teacher's lessons) 
    option: add to unit (drop-down list of teacher's units)
    option: create announcement on 'save' 
    option: post to chat room (as announcement) instead of SAVE ("In class, we discussed XYZ, here is a page…")
    option: if both desc and og:desc found, "Alternate Description Available" (checkbox? radio btn?)
    db entry to also include:
        submitted by:
        date submitted:
Design for homeschooling
Teacher option to disable chat for any student (from Jason Teel)
Lesson sharing  (import to my class, allow import)
Invite mentors to class (multiple mentors)
KickStarter 6 Tips 
Visit Evernote:
    Who might be willing to field a few browser extension design questions? Knowing that Evernote has its headquarters in Redwood City, California, does the Austin office have local outreach as its mission?
    Is the backend written in Python?
    Once next demo video is done, holler via email: dev.evernote.com app/mya 
    email>evernote; evernote has reminders;
scrape and sort meta-tags, accumulate/curate > wordCloud generator
Opera/Safari Version
