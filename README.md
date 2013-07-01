# Underscoreboard

Your favorite (and potentially only) Underscore-themed, browser-based,
outcode-your-friends adventure!

## What Is It?

Underscoreboard is a coding game where you try to implement an underscore
function faster than an opponent. All your code is visible to your opponent as
you type it (and vice versa). A test suite re-runs itself as you type your
code, guiding you toward either glory or defeat.

## Demo

Real talk, girl: If a project doesn't include a live demo, nobody's gonna check
it out. You can find a working demo at <http://underscoreboard.com>.

## Why'd You Make This?

Really, this is a way to trick people into getting comfortable writing
significant amounts of code. Underscore is a great teaching tool owing to how
useful and important the functions it offers are.

One of biggest blockers for new programmers is is knowing where to start. My
hope is that a peer-driven coding game like this helps beginners by giving them
the opportunity to peek at what their peers are doing and use that as a
kickstart when they get stuck.

## Getting Started

What follows are instructions on how to run and develop Underscoreboard. If you
don't have interest in either of those, you can stop reading here.

### Installation

First, make sure you have installed [Node.js](http://nodejs.org/). Next, clone
the repo and install its local dependencies (listed in `package.json`):

```shell
git clone https://github.com/ndhoule/underscoreboard.git
cd underscoreboard/
npm install --production
```

To run the server, build the client-side JavaScript and start the server:

```shell
grunt dist
node app/main.js
```

### Development

To install all dev dependencies, run:

```shell
gem install sass
npm install
sudo npm install -g grunt-cli phantomjs karma
```

Optionally, run `./git-hooks.sh` to install pre-commit testing hooks. This will
automatically lint your files and run tests before you're permitted to commit.
Override these hooks by passing `git commit` the `-n` flag.

### Grunt Tasks

This project uses Grunt to automate a lot of the crappy work, like compiling
files using r.js, running specs, linting files, and compiling Sass files.

`grunt dev`: Lints and builds (but doesn't minify/uglify) client JS and Sass.

`grunt test`: Lints code and runs the project's test suite.

`grunt dist`: Lints, builds, minifies, and uglifies client code. Run this
before deploying to ensure you don't deploy unminified source.

### App Structure

Here's a quick overview of the key components (some removed from tree):

    .
    ├── app
    │   ├── main.js
    │   └── public
    │       ├── js
    │       └── mocha
    ├── assets
    ├── Gruntfile.js
    ├── karma.conf.js
    ├── package.json
    └── test

`app`: All server-oriented stuff lives in here. This includes the `public`
directory, which represents the client-facing root directory of the server.

`app/main.js`: This is the starting point for launching the server.

`app/public`: The root directory for the web server. All world-accessible
files go in here.

`public/js`: Compiled client-side JavaScript. Ace source also is included here
so we can dynamically load any library files (e.g. themes) that weren't
compiled in at build time.

`public/mocha`: Contains the specs run against user code in the browser.

`assets`: Uncompiled client assets. Grunt tasks compile this source.

`Gruntfile.js`: A settings file for Grunt. Tells it where to find stuff and
defines the tasks we can run using `grunt`.

`karma.conf.js`: Configuration for running Karma (test suite) against the
project's specs. Works in conjunction with `test/main-test.js`, which sets up
Require.js to work with spec files.

`package.json`: Project metadata and dependencies.

`test`: Tests for the project.

## License

This project is released under the
[MIT License](https://raw.github.com/ndhoule/underscoreboard/master/LICENSE-MIT).
