# Introduction

This widget wraps the https://github.com/stewartlord/identicon.js library so that you can use identicons in your Mendix apps. Identicons are quite useful
to replace those boring default user images in case the user does not have an image yet. It does not need to be a user of course.

# How can you use it

The identicon widget expects a hash of at least 15 characters. Additionally you can also set the CSS class for the image itself.

The easiest way of working is:

* Create a non persistent entity with a string attribute to put the hash in. 
* Then drop the identicon in a dataview and fill the string attribute of the non persistent entity using the "CommunityCommons.Hash" java action
* Optionally set the image CSS class for the image that the widget will generate

That's it!


