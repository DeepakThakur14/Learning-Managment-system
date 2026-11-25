/* LearnX dedicated APIs and Endpoints syllabus content. */
(function (global) {
  "use strict";
  global.LearnXTopicContent = global.LearnXTopicContent || {};
  global.LearnXTopicContent.api = {
    "Making HTTP Requests with JavaScript": {
      definition: "An HTTP request asks a server to perform an operation on a resource. Browser JavaScript can send requests with Fetch or XMLHttpRequest.",
      points: ["A request includes a method, URL and optional headers or body.", "GET commonly reads data; POST commonly submits data; PUT or PATCH updates; DELETE removes.", "HTTPS protects data in transit between the browser and server.", "The response contains a status code, headers and sometimes a body."],
      example: "const response = await fetch(\"https://dummyjson.com/users?limit=5\", { method: \"GET\" });\nif (!response.ok) throw new Error(`HTTP ${response.status}`);\nconst users = await response.json();",
      practice: "Make a GET request to a public test API, display the returned records and show loading and error states.",
      check: "Check response.ok, handle rejected requests and avoid assuming every response contains valid JSON.",
      videoUrl: "https://www.youtube.com/results?search_query=JavaScript+HTTP+requests+methods+headers+status+codes"
    },
    "AJAX with XMLHttpRequest": {
      definition: "XMLHttpRequest (XHR) is a browser API for sending HTTP requests and receiving responses asynchronously or synchronously; asynchronous requests are the normal choice for web interfaces.",
      points: ["Create an XMLHttpRequest instance.", "Call open() with a method and URL.", "Listen for load, error and timeout events and inspect status.", "Call send() to start the request; parse responseText when the response format is JSON."],
      example: "const xhr = new XMLHttpRequest();\nxhr.open(\"GET\", \"https://dummyjson.com/users?limit=5\");\nxhr.onload = () => {\n  if (xhr.status >= 200 && xhr.status < 300) {\n    const data = JSON.parse(xhr.responseText);\n    console.log(data.users);\n  } else console.error(\"HTTP error\", xhr.status);\n};\nxhr.onerror = () => console.error(\"Network error\");\nxhr.send();",
      practice: "Build a button that loads a small JSON response with XMLHttpRequest and renders the result into a page element.",
      check: "Handle load and network errors, check the HTTP status and guard JSON.parse against malformed responses.",
      videoUrl: "https://www.youtube.com/results?search_query=JavaScript+XMLHttpRequest+AJAX+tutorial"
    },
    "Fetch API": {
      definition: "The Fetch API is a promise-based browser interface for making HTTP requests and working with Response objects.",
      points: ["fetch() returns a Promise that resolves to a Response when a response is received.", "A network failure rejects the promise, but HTTP 404 or 500 responses normally do not.", "Check response.ok or response.status before treating the request as successful.", "Read a response body with json(), text() or another body reader; a body should be consumed once."],
      example: "const response = await fetch(\"https://dummyjson.com/users?limit=5\");\nif (!response.ok) throw new Error(`Request failed: ${response.status}`);\nconst data = await response.json();\nconsole.log(data.users);",
      practice: "Fetch a list of users or courses, render the names and display a friendly message when the request fails.",
      check: "Test success, HTTP error, offline/network error and empty response scenarios.",
      videoUrl: "https://www.youtube.com/results?search_query=JavaScript+Fetch+API+beginner+tutorial"
    },
    "Using Fetch API": {
      definition: "Using Fetch API involves configuring request options, awaiting the response, checking its status, parsing the body and updating the interface safely.",
      points: ["Pass method, headers and body through the options object.", "Send JSON with a Content-Type header and JSON.stringify().", "Use try/catch to handle network or parsing errors.", "Use textContent or DOM APIs to render untrusted response values safely."],
      example: "const response = await fetch(\"https://dummyjson.com/posts/add\", {\n  method: \"POST\",\n  headers: { \"Content-Type\": \"application/json\" },\n  body: JSON.stringify({ title: \"LearnX practice\", userId: 1 })\n});\nif (!response.ok) throw new Error(\"Request failed\");\nconst result = await response.json();",
      practice: "Create a form that sends a JSON POST request to a public test API and displays the returned object.",
      check: "Confirm the method, headers, serialized body and response status are correct.",
      videoUrl: "https://www.youtube.com/results?search_query=JavaScript+Fetch+API+GET+POST+headers+JSON"
    },
    "Third-Party Libraries": {
      definition: "A third-party library is code maintained outside the application that provides reusable functionality and is included through a package manager or a hosted script.",
      points: ["Check the library's official documentation and maintenance status.", "Use a pinned, trusted version and review its license.", "Load scripts in the correct order and avoid unnecessary dependencies.", "Never include secret API keys in browser-side code."],
      example: "<script src=\"https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js\"></script>\n<script src=\"JS/jquery.js\"></script>",
      practice: "Choose one small library relevant to this syllabus, document why it is needed, how it is loaded and what alternatives exist.",
      check: "Verify the source, version, license, loading order and whether the page still works if the CDN is unavailable.",
      videoUrl: "https://www.youtube.com/results?search_query=JavaScript+third+party+libraries+CDN+NPM+basics"
    },
    "Handling Responses": {
      definition: "Handling an HTTP response means checking its status and headers, parsing its body, validating the data shape and presenting success or error feedback.",
      points: ["Check response.ok and response.status.", "Use the correct parser for JSON, text or other content types.", "Validate required properties before rendering.", "Show meaningful loading, empty, success and failure states."],
      example: "try {\n  const response = await fetch(\"https://dummyjson.com/users?limit=5\");\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  const data = await response.json();\n  if (!Array.isArray(data.users)) throw new Error(\"Unexpected response format\");\n  console.log(data.users);\n} catch (error) { console.error(error.message); }",
      practice: "Build a response handler that distinguishes successful data, an empty list, an HTTP error and a network error.",
      check: "Do not assume a successful network request guarantees a valid application data structure.",
      videoUrl: "https://www.youtube.com/results?search_query=JavaScript+Fetch+API+response+error+handling+JSON"
    },
    "JSON Server": {
      definition: "JSON Server is a development tool that can expose a JSON file as a simple REST-style API for prototyping and practising HTTP requests.",
      points: ["Store sample records in a db.json file.", "Run JSON Server as a local development process.", "Use generated endpoints to practise GET, POST, PUT, PATCH and DELETE.", "JSON Server is a learning and prototyping tool, not a substitute for production authentication or a secure database."],
      example: "/* db.json */\n{ \"courses\": [{ \"id\": 1, \"title\": \"HTML Essentials\" }] }\n\n/* Example request */\nfetch(\"http://localhost:3000/courses\").then(r => r.json()).then(console.log);",
      practice: "Create a db.json file containing course records, run JSON Server and perform GET and POST requests from a browser page.",
      check: "Verify the local server is running, use the correct endpoint and confirm that changes persist in the JSON data file.",
      videoUrl: "https://www.youtube.com/results?search_query=JSON+Server+REST+API+beginner+tutorial"
    }
  };
})(window);
