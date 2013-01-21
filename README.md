Underscoreboard
===============

Your favorite (and potentially only) Underscore-themed, browser-based,
outcode-your-friends adventure!


What Is It?
-----------

Underscoreboard is a realtime coding game where you try to implement an underscore
function faster than an opponent. All your code is visible to your opponent (and
vice versa). A Mocha test suite will re-run itself as you type your code, guiding
you toward glory (or toward defeat).

**Note:** Some of underscore's functions are a bit meaty, so more advanced
functionality like contexts are trimmed out in places to make the game more
accessible to newer programmers.


Requirements
------------

To run the server, you'll need to install node on your machine using either your
package manager (brew, pacman, apt-get, etc.) or the official node installer.  You
can find sweet, sweet instructions on the [node.js](http://nodejs.org/) website.

You'll also need a few modules listed in package.json. You can install them all in
one fell swoop by issuing `npm install` at the command line.

To play, the only thing you'll need is a browser, some JavaScript experience, and
the willingness to have your self-esteem crushed by an experienced underscorer.

(Or to do the crushing.)


So Why the Hell'd You Make This?
--------------------------------

Really, this is a way to trick people into learning more advanced design patterns
(and hopefully, to have fun while doing it).

I think one of the easiest and best ways to learn how to program issuing to rewrite
well-written and useful libraries--the kind of libraries real programmers use on a
daily basis. (This approach worked for me, anyway.) Often, one of my biggest
challenges when sitting down to write a piece of code is knowing where to start.  I
think a realtime coding game like this helps neophytes by giving them the
opportunity to peek at what their peers are doing and use that as a kickstart when
they get stuck.


What's It Built On?
-------------------

Express and Socket.io, mostly. It also uses Ace and runs a Mocha test suite
(converted from Underscore's Qunit tests).


Demo
----

Real talk, girl--if a project doesn't include a live demo, almost nobody's gonna
check it out. Once I've got it to the point where I'm comfortable hosting it on a
server I control, you'll be able to find a working demo at
<http://underscoreboard.com>.


License
-------

This project is licensed under the MIT license. If you'd like to build on or use the
project and that doesn't work for you, let me know and we can work something out.

This application bundles the Ace editor [Ace](https://github.com/ajaxorg/ace) and a
slightly modified [Mocha](https://github.com/visionmedia/mocha). Please see each
project's GitHub profile for its licensing terms.
