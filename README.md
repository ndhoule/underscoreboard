Underscoreboard
===============

Your favorite JavaScript-themed, browser-based, outcode-your-friends adventure!


What Is It?
-----------

Underscoreboard is a realtime coding game where you try to implement an underscore
function faster than an opponent. All your code is visible to your opponent (and
vice versa). A Jasmine test suite will re-run itself as you type your code, guiding
you toward glory (or toward defeat).


Status
-----

Basic client code syncing and test running works, but don't count on anything else
working. Sessions aren't implemented, the concept of rooms doesn't yet exist, and
I'm sure there are a few dragons inside.

Plus, it's the first big project I've ever coded. If that's not enough to scare you
away, I don't know what will.


Requirements
------------

To run the server, you'll need to install node on your machine using either your
package manager (brew, pacman, apt-get, etc.) or the official node installer.  You
can find sweet, sweet instructions on the [node.js](http://nodejs.org/) website.
(Jeez, I can't do *everything* for you.)

You'll also need a few modules listed in package.json. You can install them all in
one fell swoop by issuing `npm install` at the command line.

To play, the only thing you'll need is a browser, some JavaScript experience, and
the willingness to have your self-esteem crushed by an experienced underscorer.  (Or
to do the crushing.)


Writing Underscore? Isn't That Hard?
------------------------------------

Yes! Some of underscore's functions can be pretty intimidating, especially for
beginners. Since Underscoreboard is intended to provide a somewhat gentle
introduction for newcomers, the test suite doesn't test more advanced functionality
like contexts.


What's It Built On?
-------------------

On Express and uses Socket.io. It also uses Ace and runs a Jasmine test suite
(converted from Underscore's Qunit tests).


So Why the Hell'd You Make This?
--------------------------------

Really, this is a way to trick people into learning more advanced design patterns
(and hopefully, to have fun while doing it).

I think one of the easiest and best ways to learn how to program issuing to rewrite
well-written and useful libraries--the kind of libraries real programmers use on a
daily basis. (This approach has worked for me, anyway.) One of the common stumbling
blocks I've observed among other programming students is knowing where to start.
Ideally, a realtime coding game like this helps neophytes by giving them the
opportunity to peek at what their peers are doing and use that as a kickstart when
they get stuck.


Demo
----

Real talk, girl--if a project doesn't include a live demo, almost nobody's gonna
check it out. Once I've got it to the point where I'm comfortable hosting it on a
server I control, you'll be able to find a working demo at
<http://underscoreboard.com>.


License
-------

This project is licensed under the MIT license.

I've included [Ace](https://github.com/ajaxorg/ace) and a slightly modified version
of) [Jasmine](https://github.com/pivotal/jasmine) in this project. Jasmine is
licensed under the MIT license, and Ace is licensed under the BSD license.

Special mention: the Jasmine test suite is based on the official Underscore test
suite. I rewrote them in Jasmine, but they should be considered to be licensed under
the original
[license](https://github.com/documentcloud/underscore/blob/master/LICENSE).

