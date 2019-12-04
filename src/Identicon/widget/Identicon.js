define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "Identicon/widget/lib/pnglib",    
    "Identicon/widget/lib/identicon",    


], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent) {
    "use strict";

    return declare("Identicon.widget.Identicon", [ _WidgetBase ], {


        // Internal variables.
        _handles: null,
        _contextObj: null,
        _hash : "",       
        _cssClass: "",
        _image: null,

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            this._updateRendering();
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");
           
           this._contextObj = obj;
           this._resetSubscriptions(obj);
           this._updateRendering(obj, callback); // We're passing the callback to updateRendering to be called after DOM-manipulation
        },

        resize: function (box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        },


        _renderIdenticon : function(hash,cssClass){
            
            logger.debug(this.id + "._renderIdenticon");

            var options = {                
                background: [255, 255, 255, 255]       // rgba white                                
              };

            // create a base64 encoded PNG
            var data = new Identicon(hash, options).toString();
            
            dojoConstruct.empty(this.domNode);            
            this._image = dojoConstruct.create("img", {                
                src: "data:image/png;base64," + data,
                width: "36px",
                height: "36px",       
                class: cssClass,         
            });
            this.domNode.appendChild(this._image);            
        },

        // Reset subscriptions.
       _resetSubscriptions: function (obj) {
        logger.debug(this.id + "._resetSubscriptions");
        // Release handles on previous object, if any.
        this.unsubscribeAll();

        // When a mendix object exists create subscribtions.
        if (obj) {
            this.subscribe({
                guid: this._contextObj.getGuid(),
                callback: lang.hitch(this, function (guid) {
                    this._updateRendering(obj);
                })
            });

            
            }
        },

        // Rerender the interface.
        _updateRendering: function (obj, callback) {
            logger.debug(this.id + "._updateRendering");
        
            if (obj){      
                this._renderIdenticon(obj.get(this.hash),this.cssClass);    
            }
                
            this._executeCallback(callback, "_updateRendering"); // The callback, coming from update, needs to be executed, to let the page know it finished rendering
        },


        // Shorthand for running a microflow
        _execMf: function (mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["Identicon/widget/Identicon"]);
