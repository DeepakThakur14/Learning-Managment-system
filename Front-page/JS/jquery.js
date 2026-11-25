/* LearnX dedicated jQuery and AJAX syllabus content. Loaded before learning-content.js. */
(function (global) {
  "use strict";
  global.LearnXTopicContent = global.LearnXTopicContent || {};
  global.LearnXTopicContent.jquery = {
    "Introduction to jQuery": {
      definition: "jQuery is a JavaScript library that provides concise methods for selecting DOM elements, handling events, applying effects and making asynchronous requests.",
      points: ["Include the jQuery library before code that uses $ or jQuery.", "The $ function selects elements using CSS selector syntax.", "Use ready handlers when code must wait until the DOM is available.", "Modern browser APIs can replace many jQuery tasks, but jQuery remains useful in projects that already depend on it."],
      example: "$(function () {\n  $(\"#showMessage\").on(\"click\", function () {\n    $(\"#message\").text(\"Welcome to LearnX\");\n  });\n});",
      practice: "Create a small page with a button and message area. Use jQuery ready, a selector and a click handler to update the message.",
      check: "Confirm that jQuery loads before your script and that the selector matches exactly one intended element.",
      videoUrl: "https://www.youtube.com/results?search_query=jQuery+introduction+selectors+events+tutorial"
    },
    "jQuery DOM Manipulation": {
      definition: "jQuery DOM manipulation methods read or change elements, text, attributes, classes and page structure through a selected jQuery collection.",
      points: ["text() reads or sets text safely as text.", "html() reads or sets markup and should not receive untrusted HTML.", "addClass(), removeClass() and toggleClass() manage CSS classes.", "append(), prepend(), before() and after() insert content at different positions."],
      example: "$(\"#courseTitle\").text(\"HTML Essentials\");\n$(\".course-card\").addClass(\"is-highlighted\");\n$(\"#courseList\").append($(\"<li>\").text(\"New course\"));",
      practice: "Build a course list where a button adds a new course item and another button toggles a highlighted class.",
      check: "Use text() for untrusted text, avoid inserting untrusted HTML and verify that repeated clicks do not create unwanted duplicates.",
      videoUrl: "https://www.youtube.com/results?search_query=jQuery+DOM+manipulation+append+text+html+classes"
    },
    "jQuery Syntax": {
      definition: "A typical jQuery statement selects one or more elements and then calls a method on the resulting jQuery collection.",
      points: ["The basic pattern is $(selector).action().", "Selectors commonly use CSS syntax such as #id, .class and element names.", "Method chaining applies multiple operations to the same collection.", "The document-ready shorthand is $(function () { ... })."],
      example: "$(\".notice\").addClass(\"visible\").slideDown(200);",
      practice: "Write five jQuery statements using an ID selector, class selector, element selector, method chaining and a ready handler.",
      check: "Check selector spelling, matching elements and method order.",
      videoUrl: "https://www.youtube.com/results?search_query=jQuery+syntax+selectors+method+chaining"
    },
    "jQuery Selectors": {
      definition: "jQuery selectors identify DOM elements using CSS-style selector expressions and return a collection on which jQuery methods can operate.",
      points: ["Use #id for an element ID and .class for a class.", "Use element selectors such as p or button.", "Use descendant and attribute selectors for more specific matching.", "Use .length to inspect how many elements matched."],
      example: "const $pending = $(\".task[data-status='pending']\");\nconsole.log($pending.length);",
      practice: "Select all pending tasks, all buttons inside a course card and the element with a given ID. Display each match count.",
      check: "Verify each selector against the actual HTML and handle empty selections.",
      videoUrl: "https://www.youtube.com/results?search_query=jQuery+selectors+CSS+selectors+tutorial"
    },
    "jQuery Events": {
      definition: "jQuery event methods attach handlers to browser events such as click, submit, change, keyup and focus.",
      points: ["Use on() to register event handlers.", "Use off() to remove handlers when appropriate.", "The event object provides information about the event.", "Use preventDefault() when a form or link's default action should be stopped."],
      example: "$(\"#signupForm\").on(\"submit\", function (event) {\n  event.preventDefault();\n  $(\"#status\").text(\"Form checked\");\n});",
      practice: "Add click and submit handlers to a small registration form and show a status message without reloading the page.",
      check: "Ensure handlers are not attached repeatedly and that default behavior is prevented only when needed.",
      videoUrl: "https://www.youtube.com/results?search_query=jQuery+events+on+click+submit+event+delegation"
    },
    "jQuery Effects": {
      definition: "jQuery effects provide simple animated transitions such as show, hide, toggle, fade and slide operations.",
      points: ["show() and hide() change element visibility.", "toggle() switches between visible and hidden states.", "fadeIn(), fadeOut(), slideDown() and slideUp() animate transitions.", "Keep animations short and respect reduced-motion preferences in accessible interfaces."],
      example: "$(\"#details\").slideToggle(250);",
      practice: "Create an FAQ accordion where each question button expands or collapses its answer with a slide effect.",
      check: "Test repeated clicks, keyboard operation and whether the final visibility state remains correct.",
      videoUrl: "https://www.youtube.com/results?search_query=jQuery+effects+show+hide+fade+slide+tutorial"
    },
    "jQuery Traversing": {
      definition: "jQuery traversing methods move through relationships in the DOM from a selected element to its parents, children, siblings or filtered descendants.",
      points: ["parent() and parents() move upward.", "children() and find() move downward.", "siblings(), next() and prev() move across related elements.", "closest() finds the nearest ancestor matching a selector."],
      example: "$(\".remove-task\").on(\"click\", function () {\n  $(this).closest(\".task-row\").remove();\n});",
      practice: "Create a list of task rows and use closest() to remove only the row containing the clicked remove button.",
      check: "Confirm traversal starts from the correct element and does not remove a parent container accidentally.",
      videoUrl: "https://www.youtube.com/results?search_query=jQuery+DOM+traversing+parent+children+closest+find"
    },
    "Event Handling in jQuery": {
      definition: "jQuery event handling includes direct and delegated handlers, event propagation, event data and controlling default browser actions.",
      points: ["Direct handlers are attached to elements that currently exist.", "Delegated handlers use a parent and selector to handle matching descendants added later.", "Event bubbling allows a parent handler to receive descendant events.", "Use event.target and event.currentTarget to distinguish the original target from the handler element."],
      example: "$(\"#taskList\").on(\"click\", \".complete-task\", function (event) {\n  event.preventDefault();\n  $(this).closest(\"li\").toggleClass(\"completed\");\n});",
      practice: "Add task items dynamically and use one delegated click handler on the list to mark new and existing tasks complete.",
      check: "Add a task after the handler is registered and verify that the delegated handler still works.",
      videoUrl: "https://www.youtube.com/results?search_query=jQuery+delegated+event+handling+on+off"
    },
    "Introduction to AJAX": {
      definition: "AJAX is a browser technique for requesting or sending data asynchronously and updating part of a page without a full-page reload.",
      points: ["AJAX means Asynchronous JavaScript and XML, though JSON is now common.", "A request is sent while the current page remains active.", "The server responds with data and a status code.", "The UI should represent loading, success, empty and error states."],
      example: "$(\"#loadCourses\").on(\"click\", function () {\n  $(\"#status\").text(\"Loading courses…\");\n});",
      practice: "Sketch the request and response flow for a course search and identify the UI states the learner should see.",
      check: "Distinguish asynchronous partial-page updates from a traditional full-page navigation.",
      videoUrl: "https://www.youtube.com/results?search_query=AJAX+introduction+asynchronous+JavaScript+tutorial"
    },
    "Traditional vs. AJAX Model": {
      definition: "A traditional web interaction commonly navigates to a new server-rendered page, while an AJAX interaction requests data in the background and updates a selected page region.",
      points: ["Traditional navigation often replaces the current document.", "AJAX can update only the part of the interface that needs new data.", "AJAX requires explicit loading, error and accessibility feedback.", "Both approaches still rely on HTTP requests and server responses."],
      example: "Compare clicking a normal link to a course page with searching for courses and replacing only the results list using an asynchronous request.",
      practice: "Create a two-column comparison of traditional navigation and an AJAX-powered search, including user experience and error handling.",
      check: "Do not describe AJAX as a different transport protocol; it is a technique built on browser request APIs.",
      videoUrl: "https://www.youtube.com/results?search_query=traditional+web+model+vs+AJAX+model"
    },
    "jQuery Ajax": {
      definition: "jQuery's $.ajax() method configures an asynchronous HTTP request and provides callbacks or promise-style methods for handling its result.",
      points: ["Specify the request URL and HTTP method.", "Use dataType to describe the expected response format when appropriate.", "Handle success and failure paths.", "Avoid placing secrets in frontend code or trusting remote data without validation."],
      example: "$.ajax({ url: \"https://dummyjson.com/users?limit=5\", method: \"GET\", dataType: \"json\" })\n  .done(data => console.log(data.users))\n  .fail((xhr, status, error) => console.error(status, error));",
      practice: "Use $.ajax() to request a public JSON collection, render a short list and show a useful error message if the request fails.",
      check: "Inspect the HTTP status, parse the expected data shape and handle network errors.",
      videoUrl: "https://www.youtube.com/results?search_query=jQuery+AJAX+get+post+ajax+method+tutorial"
    }
  };
})(window);
