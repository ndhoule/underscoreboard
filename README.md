Underscoreboard
===============

Your favorite (and potentially only) Underscore-themed, browser-based,
outcode-your-friends adventure!


What Is It?
-----------

Underscoreboard is a coding game where you try to implement an underscore function
faster than an opponent. All your code is visible to your opponent as you type it
(and vice versa). A test suite re-runs itself as you type your code, guiding you
toward either glory or defeat.


Demo
----

Real talk, girl--if a project doesn't include a live demo, almost nobody's gonna
check it out. You can find a working demo at <https://underscoreboard.heroku.com>.


Installation
------------

First, make sure you have installed [Node.js](http://nodejs.org/). Next, clone down
the repo and install its local dependencies (listed in `package.json`):

``
git clone https://github.com/ndhoule/underscoreboard.git
cd underscoreboard/
npm install --production
``

To run the server, start it with node:

``
node app/main.js
``

### Development

This project uses Grunt heavily to automate a lot of the crappy work. I use it to
compile files using r.js, to run specs, to lint files, to compile Sass files, and
all sorts of other fun stuff. (If you're not already familiar with Grunt--it's
similar to rake, but for JavaScript.)

#### Dependencies

To install all dev dependencies, run:

``
gem install sass
npm install
sudo npm install -g grunt
``

Optionally, run `./git-hooks.sh` to install pre-commit testing hooks. This will
automatically lint your files and run the testing suite before each commit and
prevent a commit if either throws an error.

#### Common Grunt Tasks

`grunt dev`: Hints and builds (but doesn't minify/uglify) client JS and Sass.
Uglifying and minifying source takes a while, so this rules for development.

`grunt test`: Hints code and runs the project's test suite.

`grunt dist`: Hints, builds, minifies, and uglifies client code. Run this before
committing any changes.

If you want to run a specific task, you can run any task listed in `Gruntfile.js` by
executing `grunt task` at the command line, where `task` is the name of the job you
want to run (e.g. `grunt buster` or `grunt jshint:all`).

App Structure
-------------

There are a lot of nested folders and files in this app, so here's a quick overview
of how everything fits together:

``
.                 <br />
├── Gruntfile.js  <br />
├── app           <br />
│   ├── main.js   <br />
│   └── public    <br />
│       ├── js    <br />
│       └── mocha <br />
├── assets        <br />
│   ├── js        <br />
│   └── sass      <br />
├── package.json  <br />
└── spec          <br />

``

`Gruntfile.js`: A settings file for Grunt. Tells it where to find stuff and defines
what tasks we can run using the `grunt` command.

`app`: All server-oriented stuff lives in here. This includes the `public`
directory, which represents the client-facing root directory of the server.

`app/main.js`: This is the starting point for launching the server.

`app/public`: This is the root directory for the web server. All client-accessible
files go in here.

`public/js`: Compiled client-side JavaScript lives in here. Ace source also is
included here so we can dynamically load any library files (e.g. themes) that weren't
compiled in at build time.

`public/mocha`: This folder contains the specs that test user code as they write it.

`assets`: Uncompiled client assets go in here. Grunt tasks compile this source using
r.js and the Sass compiler.

`package.json`: This file contains metadata describing the project.

`spec`: This is where all the specs/tests for the project live.


Why'd You Make This?
--------------------

Really, this is a way to trick people into getting comfortable writing significant
amounts of code. Underscore is a great teaching tool owing to how useful and
important the functions it offers are.

One of biggest blockers for new programmers is is knowing where to start. My hope is
that a peer-driven coding game like this helps beginners by giving them the
opportunity to peek at what their peers are doing and use that as a kickstart when
they get stuck.




License
-------

This project is
[licensed](https://raw.github.com/ndhoule/underscoreboard/master/LICENSE-MIT) under
the MIT license.
