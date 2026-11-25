/* LearnX topic learning content: notes, video resources, 50 assignments and quizzes per topic.
   Video links open topic-specific YouTube results. They are not represented as verified single videos. */
(function (global) {
  'use strict';

  const NOTES = {
    'Fundamentals of Web Architecture': {
      definition: 'Web architecture describes how a browser, web server, application logic and data storage work together to deliver a website or web application.',
      points: ['The browser sends an HTTP or HTTPS request.', 'A server receives the request and returns a response.', 'Application code may read or update data before the response is sent.', 'HTML structures content, CSS presents it and JavaScript adds behavior.'],
      example: 'When a learner opens a course page, the browser requests the page, the application loads course information and the browser renders the result.',
      practice: 'Draw and explain the request–response flow for a student opening a lesson page.',
      check: 'Identify the browser, server, application logic and data store in your diagram.'
    },
    'Web Development Roles': {
      definition: 'Web development work is commonly divided into frontend development, backend development, full-stack development, design and quality assurance.',
      points: ['Frontend developers build the browser-facing interface.', 'Backend developers implement server-side logic and data access.', 'Full-stack developers work across frontend and backend layers.', 'UI/UX designers plan usable interfaces; QA engineers test behavior and quality.'],
      example: 'For an LMS, frontend work includes the course catalog, backend work includes enrollment processing, and QA checks registration and lesson completion.',
      practice: 'Create a responsibility matrix for a small team building a course enrollment page.',
      check: 'Make sure each responsibility is assigned to the role that performs it.'
    },
    'Setting Up the Environment': {
      definition: 'A development environment is the set of tools and project settings used to write, run, inspect and maintain code.',
      points: ['Install a code editor and a supported browser.', 'Create a clear folder structure for HTML, CSS, JavaScript and assets.', 'Use a local development server for consistent relative paths.', 'Inspect the browser console and Network panel when debugging.'],
      example: 'Open the project root in VS Code and run the homepage through Live Server rather than opening a nested file from an unrelated folder.',
      practice: 'Prepare a small project with index.html, CSS/style.css and JS/app.js, then run it locally.',
      check: 'Verify that the stylesheet, script and image requests return successfully.'
    },
    'HTML Basics': {
      definition: 'HTML (HyperText Markup Language) defines the structure and meaning of content displayed by a web browser.',
      points: ['An HTML document has a doctype, html, head and body.', 'Elements are written using tags and may contain text or other elements.', 'The head contains metadata and linked resources.', 'The body contains the content shown on the page.'],
      example: '<!doctype html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>My page</title></head>\n<body><h1>Hello, LearnX</h1><p>My first page.</p></body>\n</html>',
      practice: 'Build a semantic personal profile page with a heading, paragraph, image and link.',
      check: 'Validate the document structure and provide meaningful alternative text for the image.'
    },
    'HTML Syntax and Documentation': {
      definition: 'HTML syntax defines how elements, attributes, nesting and comments are written so browsers can interpret a document consistently.',
      points: ['Use opening and closing tags for non-void elements.', 'Nest elements according to the document structure.', 'Quote attribute values.', 'Use comments to explain non-obvious markup and consult HTML documentation for valid attributes.'],
      example: '<a href="https://example.com" target="_blank" rel="noopener">Open example</a>',
      practice: 'Correct a deliberately malformed HTML fragment and explain each correction.',
      check: 'Check nesting, quoted attributes, required attributes and valid element usage.'
    },
    'HTML Tags and HTML Elements': {
      definition: 'An HTML element is the complete structural unit, usually consisting of a start tag, content and end tag; a tag is the markup token that identifies it.',
      points: ['Elements can be block-level or inline in their default rendering behavior.', 'Some elements are void and do not have closing tags.', 'Elements can contain text, attributes and nested elements.', 'Choose elements based on meaning, not only appearance.'],
      example: '<p class="intro">The paragraph element contains this text.</p>',
      practice: 'Create a page using headings, paragraphs, links, images and lists, choosing an appropriate element for each part.',
      check: 'Ensure each element communicates the intended meaning and is correctly nested.'
    },
    'Semantic HTML': {
      definition: 'Semantic HTML uses elements whose names communicate the role of the content, improving structure, accessibility and maintainability.',
      points: ['Use header, nav, main, section, article, aside and footer where appropriate.', 'Use buttons for actions and anchors for navigation.', 'Keep heading levels in a logical hierarchy.', 'Do not choose a semantic element only because of its default visual style.'],
      example: '<main><article><h1>Course overview</h1><p>Course description...</p></article></main>',
      practice: 'Refactor a page built from generic div elements into a meaningful semantic layout.',
      check: 'Confirm that landmarks and heading order make sense without relying on visual styling.'
    },
    'CSS Box Model': {
      definition: 'The CSS box model describes how content, padding, borders and margins determine an element’s rendered size and spacing.',
      points: ['Content is the inner text or media area.', 'Padding creates space inside the border.', 'Border surrounds content and padding.', 'Margin creates space outside the border; box-sizing changes how declared dimensions are calculated.'],
      example: '.card { box-sizing: border-box; width: 320px; padding: 16px; border: 1px solid #ddd; margin: 12px; }',
      practice: 'Build three cards with different padding, borders and margins, then compare their total rendered widths.',
      check: 'Use the browser box model inspector and explain the effect of border-box.'
    },
    'CSS Selectors': {
      definition: 'CSS selectors identify the HTML elements to which a set of style declarations should apply.',
      points: ['Type selectors target elements by tag name.', 'Class selectors target reusable class values.', 'ID selectors target a unique identifier.', 'Combinators and pseudo-classes describe relationships and states.'],
      example: '.course-card h2 { color: #4338ca; }\nbutton:hover { opacity: .9; }',
      practice: 'Style a course catalog using type, class, descendant, child and pseudo-class selectors.',
      check: 'Inspect which elements match each selector and avoid unnecessary specificity.'
    },
    'Flexbox Basics': {
      definition: 'Flexbox is a one-dimensional CSS layout system for arranging items along a row or column and controlling their alignment and distribution.',
      points: ['display:flex creates a flex container.', 'flex-direction controls the main axis.', 'justify-content distributes items along the main axis.', 'align-items aligns items on the cross axis; gap adds consistent spacing.'],
      example: '.toolbar { display:flex; align-items:center; justify-content:space-between; gap:1rem; }',
      practice: 'Build a responsive navigation bar with a logo, links and action buttons using Flexbox.',
      check: 'Test wrapping, alignment and spacing at narrow viewport widths.'
    },
    'CSS Grid Basics': {
      definition: 'CSS Grid is a two-dimensional layout system that controls rows and columns for page regions and component layouts.',
      points: ['display:grid creates a grid container.', 'grid-template-columns defines column tracks.', 'gap controls spacing between tracks.', 'minmax() and repeat() help create flexible responsive grids.'],
      example: '.course-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1.25rem; }',
      practice: 'Create a responsive course-card grid that changes its number of columns with available space.',
      check: 'Verify that cards do not overflow and remain readable on mobile screens.'
    },
    'JavaScript Basics': {
      definition: 'JavaScript is a programming language used in browsers to add behavior, process data and respond to user interactions.',
      points: ['Variables store values.', 'Expressions and operators produce results.', 'Conditions and loops control execution.', 'Functions package reusable behavior.'],
      example: 'const courseName = "HTML Essentials";\nif (courseName) { console.log(`Learning: ${courseName}`); }',
      practice: 'Write a small script that reads a learner name and prints a personalized welcome message.',
      check: 'Test normal input, empty input and unexpected values.'
    },
    'DOM': {
      definition: 'The Document Object Model represents an HTML document as a tree of objects that JavaScript can inspect and modify.',
      points: ['The document object is the entry point.', 'Selectors find elements in the document.', 'Properties and methods can update content and attributes.', 'Event listeners respond to user actions.'],
      example: 'const heading = document.querySelector("h1");\nheading.textContent = "Welcome to LearnX";',
      practice: 'Build a small interactive checklist that adds and removes items through DOM methods.',
      check: 'Handle missing elements safely and use textContent for plain text.'
    },
    'Event Loop': {
      definition: 'The JavaScript event loop coordinates the call stack with task queues so asynchronous callbacks can run when the stack is clear.',
      points: ['Synchronous code runs on the call stack.', 'Asynchronous operations are handled by host APIs or runtime facilities.', 'Promise callbacks use the microtask queue.', 'The event loop schedules queued work when the stack is empty.'],
      example: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");',
      practice: 'Predict and explain the output order of code using synchronous statements, a timer and a resolved promise.',
      check: 'Distinguish the call stack, task queue and microtask queue.'
    },
    'Promises': {
      definition: 'A Promise represents the eventual completion or failure of an asynchronous operation and its resulting value.',
      points: ['A promise is pending, fulfilled or rejected.', 'then() handles fulfillment.', 'catch() handles rejection.', 'finally() runs after settlement; returning a value from then() creates a new promise in the chain.'],
      example: 'fetch("/api/courses").then(response => { if (!response.ok) throw new Error("Request failed"); return response.json(); }).then(data => console.log(data)).catch(error => console.error(error));',
      practice: 'Write a promise chain that loads course data, handles an HTTP error and displays a useful message.',
      check: 'Handle rejected promises and check the HTTP response status.'
    },
    'Async/Await': {
      definition: 'Async/await is syntax for writing promise-based asynchronous code in a sequential style.',
      points: ['An async function always returns a promise.', 'await pauses that async function until a promise settles.', 'Use try/catch to handle rejected promises.', 'await does not block the entire browser thread.'],
      example: 'async function loadCourses() {\n  try { const response = await fetch("/api/courses"); if (!response.ok) throw new Error("Request failed"); return await response.json(); }\n  catch (error) { console.error(error); }\n}',
      practice: 'Convert a promise chain into an async function and show loading, success and error states.',
      check: 'Ensure errors are caught and the returned data is awaited.'
    },
    'Fetch API': {
      definition: 'The Fetch API provides a promise-based interface for making HTTP requests and reading responses in JavaScript.',
      points: ['fetch() starts a request and returns a promise.', 'A Response object provides status and headers.', 'Call json() or another body reader to parse the response.', 'Check response.ok because HTTP error statuses do not automatically reject the fetch promise.'],
      example: 'const response = await fetch("https://dummyjson.com/users?limit=5");\nif (!response.ok) throw new Error("HTTP error");\nconst data = await response.json();',
      practice: 'Fetch a small JSON collection, render the results and show an error message if the request fails.',
      check: 'Check response.ok, parse the body once and handle network errors.'
    },
    'AJAX': {
      definition: 'AJAX is a technique for exchanging data with a server asynchronously so part of a page can update without a full-page navigation.',
      points: ['The browser sends a request in the background.', 'The server returns data, commonly JSON.', 'JavaScript updates the relevant page region.', 'AJAX describes a technique and can be implemented with XMLHttpRequest or Fetch.'],
      example: 'Load a list of courses in the background and update only the course-list element after the response arrives.',
      practice: 'Create a search interface that requests matching records and updates a results area without reloading the page.',
      check: 'Handle loading, empty, success and failure states.'
    }
  };

  const MODULE_GUIDANCE = {
    html: 'HTML provides document structure and meaning. Focus on valid nesting, appropriate elements, meaningful attributes and accessibility.',
    css: 'CSS controls presentation and layout. Focus on the cascade, selector behavior, box sizing, layout flow and responsive behavior.',
    javascript: 'JavaScript controls application behavior. Focus on data types, predictable logic, functions, events and testing edge cases.',
    dom: 'DOM work connects JavaScript to the document. Focus on selecting the correct node, updating it safely and responding to events.',
    async: 'Asynchronous JavaScript coordinates work that completes later. Focus on execution order, promise states, error handling and UI feedback.',
    jquery: 'jQuery offers concise APIs for selecting elements, handling events and effects, while AJAX exchanges data asynchronously.',
    api: 'HTTP APIs exchange data between clients and servers. Focus on methods, status codes, response parsing and failure handling.',
    general: 'Connect the concept to a real web application, understand its purpose, and practise explaining and applying it.'
  };

  function groupFor(moduleTitle, topic) {
    const s = `${moduleTitle} ${topic}`.toLowerCase();
    if (/api|endpoint|http request|fetch|xmlhttprequest|json server/.test(s)) return 'api';
    if (/jquery|ajax/.test(s)) return 'jquery';
    if (/async|event loop|callback|promise/.test(s)) return 'async';
    if (/dom|object-oriented|oops|event mechanics|array method/.test(s)) return 'dom';
    if (/javascript|\bjs\b|function|prototype|constructor|regexp|scope|operator|loop|hoisting|strict mode|boolean|string|array|object/.test(s)) return 'javascript';
    if (/html|iframe|semantic|tag|element|attribute|heading|paragraph|table|dropdown|quotation|list|block|layout|form|charset|entity|frame|head/.test(s)) return 'html';
    if (/css|flexbox|grid|bootstrap|responsive|media quer|pseudo|tooltip|gradient|shadow|border|padding|typography|animation|transform|transition|selector|box model|position|filter/.test(s)) return 'css';
    return 'general';
  }

  function buildContent(lesson, moduleTitle) {
    const topic = lesson.title;
    const group = groupFor(moduleTitle, topic);
    const externalNotes = (global.LearnXTopicContent && global.LearnXTopicContent[group]) || {};
    const base = externalNotes[topic] || NOTES[topic] || null;
    const generic = {
      html: `${topic} is part of HTML document authoring. Learn the element or document feature, the attributes it supports, where it belongs in the page structure and how it affects meaning and accessibility.`,
      css: `${topic} is a CSS styling or layout concept. Learn the relevant property or selector, understand how it interacts with the cascade and box model, and test the result at different viewport sizes.`,
      javascript: `${topic} is a JavaScript language concept. Learn its syntax, the values or objects it works with, the situations where it is useful and how to test normal and edge-case behavior.`,
      dom: `${topic} connects JavaScript logic with objects, collections or the browser document. Learn the relevant API or pattern, practise it with a small interface and handle missing or unexpected values.`,
      async: `${topic} is part of asynchronous JavaScript. Learn how execution is scheduled, how results or errors are represented and how to keep the interface responsive while work completes.`,
      jquery: `${topic} is part of jQuery or AJAX programming. Learn the API syntax, the elements or request lifecycle it operates on and how to handle success, failure and repeated interactions.`,
      api: `${topic} is used when JavaScript communicates with a service. Learn the request/response flow, data format, status handling and safe rendering of returned data.`,
      general: `${topic} is a web development topic in ${moduleTitle}. Understand its purpose, the problem it solves, the main steps involved and how it fits into a complete website.`
    }[group];
    const definition = base?.definition || generic;
    const points = base?.points || [
      `Understand the purpose and terminology of ${topic}.`,
      `Identify the syntax, tools or workflow used for ${topic}.`,
      `Connect ${topic} with the other concepts in ${moduleTitle}.`,
      'Test your work with a simple example and inspect the result in the browser.'
    ];
    const example = base?.example || `Practice idea: create a small web page or JavaScript example that demonstrates “${topic}”. Add comments explaining the important steps and test the result in your browser.`;
    const practice = base?.practice || `Create a small practical exercise that demonstrates ${topic}. Explain the problem, show your implementation and describe one improvement you made.`;
    const check = base?.check || `Check that your example correctly demonstrates ${topic}, works with valid input and has no browser console errors.`;
    return {
      topic, moduleTitle, group, definition, points, example, practice, check,
      videoUrl: base?.videoUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic} ${moduleTitle} tutorial for beginners`)}`,
      docsUrl: group === 'html' ? 'https://developer.mozilla.org/en-US/docs/Web/HTML' : group === 'css' ? 'https://developer.mozilla.org/en-US/docs/Web/CSS' : group === 'api' || group === 'async' ? 'https://developer.mozilla.org/en-US/docs/Web/API' : 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
    };
  }

  const ACTIONS = [
    ['Explain', 'Write a clear explanation of {topic}, including its purpose, where it is used and one limitation.'],
    ['Build', 'Build a small working example that demonstrates {topic}. Include readable code and a short usage guide.'],
    ['Compare', 'Compare {topic} with a closely related concept from this module. Give at least three meaningful differences.'],
    ['Debug', 'Create or use a faulty example involving {topic}, identify at least three defects and submit the corrected version.'],
    ['Apply', 'Apply {topic} to a realistic course-platform interface. Describe the user problem and demonstrate the result.'],
    ['Test', 'Prepare test cases for {topic}: normal input, boundary input and invalid input. Record expected and actual results.'],
    ['Refactor', 'Improve an existing example of {topic} for readability, maintainability and accessibility without changing its intended behavior.'],
    ['Document', 'Create concise technical notes for {topic}, including terminology, syntax, a worked example and common mistakes.'],
    ['Extend', 'Extend a basic {topic} example with one additional requirement and explain how your change works.'],
    ['Mini project', 'Create a mini-project centered on {topic}. Include a working demonstration, source files and a short reflection.']
  ];
  const VARIANTS = [
    'Keep the solution beginner-friendly and explain each important step.',
    'Use a LearnX course page as the practical scenario.',
    'Include keyboard accessibility and meaningful labels where relevant.',
    'Check the result on both desktop and mobile screen sizes.',
    'Include one edge case, a test result and a short conclusion.'
  ];

  function getAssignments(lesson, moduleTitle) {
    const topic = lesson.title;
    const tasks = [];
    ACTIONS.forEach((action, ai) => VARIANTS.forEach((variant, vi) => {
      const n = ai * VARIANTS.length + vi + 1;
      tasks.push({
        id: `${lesson.id}-task-${String(n).padStart(2, '0')}`,
        number: n,
        title: `${String(n).padStart(2, '0')}. ${action[0]}: ${topic}`,
        type: action[0],
        instructions: action[1].replaceAll('{topic}', topic) + ' ' + variant,
        deliverable: 'Submit your source file(s), a screenshot or test evidence, and a brief explanation.',
        difficulty: n <= 15 ? 'Beginner' : n <= 35 ? 'Intermediate' : 'Challenge'
      });
    }));
    return tasks;
  }

  function buildQuiz(lesson, moduleTitle) {
    const c = buildContent(lesson, moduleTitle);
    const topic = lesson.title;
    const wrongDescriptions = [
      'A visual-only change that does not affect the document or application behavior.',
      'A database operation that runs without any browser or web-page involvement.',
      'A browser feature that should be used without checking its result or errors.'
    ];
    const practiceDistractors = [
      'Change unrelated page colors without checking the requested behavior.',
      'Copy code from another topic without adapting or testing it.',
      'Remove validation and ignore errors so the example appears shorter.'
    ];
    const questions = [
      { question: `Which statement best describes ${topic}?`, options: [c.definition, ...wrongDescriptions], answer: 0, explanation: c.definition },
      { question: `Which activity is the strongest practical demonstration of ${topic}?`, options: [c.practice, ...practiceDistractors], answer: 0, explanation: c.practice },
      { question: `Which check is specifically recommended when practising ${topic}?`, options: [c.check, 'Only check whether the page has a colorful background.', 'Skip testing if the code looks familiar.', 'Assume all browsers and inputs behave identically.'], answer: 0, explanation: c.check },
      { question: `Which set of study points is most relevant to ${topic}?`, options: [c.points.slice(0, 2).join(' '), 'Focus only on unrelated course ratings and profile pictures.', 'Avoid learning the terminology or testing any example.', 'Change multiple unrelated files without understanding their purpose.'], answer: 0, explanation: c.points.slice(0, 2).join(' ') },
      { question: `What should a good submission about ${topic} include?`, options: ['A working example, an explanation and evidence that it was tested.', 'Only a title with no implementation or explanation.', 'An unrelated program copied without attribution.', 'A screenshot of the editor without showing the result.'], answer: 0, explanation: 'A useful submission demonstrates the topic, explains the implementation and includes evidence of testing.' }
    ].map((q, i) => {
      const shift = (topic.length + i * 3) % q.options.length;
      const rotated = q.options.map((_, index) => q.options[(index + shift) % q.options.length]);
      return { id: `${lesson.id}-quiz-q${i + 1}`, ...q, options: rotated, answer: (q.answer - shift + q.options.length) % q.options.length };
    });
    return {
      id: `${lesson.id}-quiz`, title: `${topic} — Topic Quiz`, passingScore: 60,
      description: `Five questions to check your understanding of ${topic}. Review the lesson notes before attempting.`,
      questions
    };
  }

  function readStore(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch (_) { return {}; }
  }
  function writeStore(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function getSubmission(studentId, lessonId, assignmentId) {
    const all = readStore('learnx_topic_assignment_submissions');
    return all[`${studentId}:${lessonId}:${assignmentId}`] || null;
  }
  function saveSubmission(studentId, lessonId, assignment, answer) {
    const all = readStore('learnx_topic_assignment_submissions');
    const key = `${studentId}:${lessonId}:${assignment.id}`;
    all[key] = { studentId, lessonId, assignmentId: assignment.id, title: assignment.title, answer, status: 'Submitted', submittedAt: new Date().toISOString() };
    writeStore('learnx_topic_assignment_submissions', all);
    return all[key];
  }
  function saveQuizAttempt(studentId, lessonId, quiz, answers, score) {
    const all = readStore('learnx_topic_quiz_attempts');
    const key = `${studentId}:${lessonId}`;
    const attempts = all[key] || [];
    const total = quiz.questions.length;
    const result = { studentId, lessonId, quizId: quiz.id, score, total, percentage: Math.round(score / total * 100), attemptedAt: new Date().toISOString(), answers };
    attempts.unshift(result);
    all[key] = attempts.slice(0, 20);
    writeStore('learnx_topic_quiz_attempts', all);
    return result;
  }
  function getLatestQuizAttempt(studentId, lessonId) {
    const all = readStore('learnx_topic_quiz_attempts');
    return (all[`${studentId}:${lessonId}`] || [])[0] || null;
  }

  global.LearnXLearningContent = { buildContent, getAssignments, buildQuiz, getSubmission, saveSubmission, saveQuizAttempt, getLatestQuizAttempt };
})(window);
