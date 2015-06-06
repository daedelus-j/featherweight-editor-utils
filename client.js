'use strict';

var ClientUtils = require('./common');

ClientUtils.childOf = function childOf(el, parent) {
  do {
    if (el === parent) {
      return true;
    }
  } while (el = el.parentNode);

  return false;
};


ClientUtils.unwrap = function unwrap(element) {
  var range = document.createRange();
  range.setStartBefore(element.firstChild);
  range.setEndAfter(element.lastChild);
  var contents = range.extractContents();
  element.parentNode.insertBefore(contents, element);
  element.parentNode.removeChild(element);
};

/**
 * getLastTextNode
 *
 * @param {object HTMLElement} el html element
 * @return {object TextNode} the last text node in an html element
 */
ClientUtils.getLastTextNode = function getLastTextNode(el) {

  while (el !== null && el.nodeType !== 3) {
    el = el.childNodes[el.childNodes.length - 1];
  }

  return el;
};

/**
 * getDocumentHeight
 *
 * @return {number} height of the document
 */
ClientUtils.getDocumentHeight = function getDocumentHeight() {
  var D = document;
  return Math.max(
    D.body.scrollHeight, D.documentElement.scrollHeight,
    D.body.offsetHeight, D.documentElement.offsetHeight,
    D.body.clientHeight, D.documentElement.clientHeight
  );
};

/**
 * offsetTop
 *
 * @param {object HTMLElement} el dom element
 * @return {number} total top offset
 */
ClientUtils.offsetTop = function offsetTop(el) {
  var top = el.offsetTop;
  var tempEl = el.offsetParent;

  while (tempEl !== null) {
    top += tempEl.offsetTop;
    tempEl = tempEl.offsetParent;
  }

  return top;
};

ClientUtils.getStyle = function getStyle(el, styleName) {
  return window.getComputedStyle(el)
    .getPropertyValue(styleName);
};

/**
 * Takes an array of dom elements and removes a target class
 * @param  {String} className CSS class to be removed
 * @param  {Array}  children  dom elements to strip
 *
 */
ClientUtils.stripClass = function(className, children) {

  this.forEach.call(children, function(childEl) {
    if (childEl.classList.contains(className)) {
      childEl.classList.remove(className);
    }
  });

  return this;
};

ClientUtils.toNodes = function toNode(str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  return Array.prototype.slice.call(div.children, 0);
};

ClientUtils.toNode = function toNode(str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  return div.children[0];
};

ClientUtils.getJsonFromUrl = function getJsonFromUrl(str) {
  var query = str.split('?')[1];
  var data = query.split('&');
  var result = {};
  for (var i = 0; i < data.length; i++) {
    var item = data[i].split('=');
    result[item[0]] = unescape(item[1]);
  }
  return result;
};


// converts special characters (like <) into their escaped/encoded values (like &lt;).
// This allows you to show to display the string without the browser reading it as HTML.
ClientUtils.htmlSafeEntity = function htmlSafeEntity(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};


ClientUtils.closestByTag = function closestByTag(el, tag) {
  do {
    if (el.tagName.toLowerCase() === tag) {
      return el;
    }
  } while (el = el.parentNode);

  return null;
};


ClientUtils.closestByClass = function closestByClass(el, className) {
  do {
    if (el.classList && el.classList.contains(className)) {
      return el;
    }
    el = el.parentNode;
  } while (el && el.classList);

  return null;
};


/**
 * from http://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
 *
 * @param {object HTMLElement} contentEditableElement a contenteditable
 * enabled html element
 * @return {void}
 */
ClientUtils.setCaretAtEnd = function setCaretAtEnd(contentEditableElement) {

  //Create a range (a range is a like the selection but invisible)
  var range = document.createRange();

  //Select the entire contents of the element with the range
  range.selectNodeContents(contentEditableElement);

  //collapse the range to the end point. false means collapse
  //to end rather than the start
  range.collapse(false);
  //get the selection object (allows you to change selection)
  var selection = window.getSelection();
  //remove any selections already made
  selection.removeAllRanges();

  //make the range you have just created the visible selection
  selection.addRange(range);

};

ClientUtils.selectNode = function selectNode(node, opts) {
  var opts = opts || {
    collapse: true
  };

  var selection = window.getSelection();
  var range = document.createRange();

  // fucking webkit bug since 2007
  // https://bugs.webkit.org/show_bug.cgi?id=15256
  // workaround for selecting empty nodes
  if (node.nodeType !== 3 &&
    node.childNodes.length === 0) {
    node.innerHTML = '&#x200b;';
  }

  range.setStart(node, 0);
  range.setEnd(node, 0);

  selection.removeAllRanges();

  if (opts.collapse) {
    range.collapse();
  }

  selection.addRange(range);

};

ClientUtils.getCurrentElement = function getCurrentElement() {
  var el;
  if (document.selection) {
    el = document.selection.createRange(); // IE
  } else {
    el = window.getSelection().anchorNode;
  }
  return el;
};

ClientUtils.getSelectedHTML = function getSelectedHTML() {

  var value = {
    html: '',
    text: ''
  };

  if (typeof window.getSelection !== 'undefined') {

    var sel = window.getSelection();
    if (sel.rangeCount) {

      var container = document.createElement('div');

      for (var i = 0, len = sel.rangeCount; i < len; ++i) {
        container.appendChild(sel.getRangeAt(i).cloneContents());
      }
      if (/<|>/g.test(container.innerHTML)) {
        if (/<a /g.test(container.innerHTML)) {
          value.text = container.innerText;
        } else {
          value.html = container.innerHTML;
        }
      } else {
        value.text = container.innerText;
      }
    }
  } else if (typeof document.selection !== 'undefined') {

    if (document.selection.type === 'Text') {
      value.text = document.selection.createRange().htmlText;
    }
  }
  return value;
};

ClientUtils.getClosestEditorBlock = function getClosestEditorBlock(el) {

  var blocks = ['p', 'h1', 'h2', 'h3', 'figure', 'blockquote'];
  var mediaClass = '.media';
  var currTagName;

  if (el.nodeType === 3) {
    el = el.parentElement;
  }

  while (el) {
    if (el.nodeName === '#document') {
      break;
    }

    currTagName = el.tagName && el.tagName.toLowerCase();
    if (blocks.indexOf(currTagName) !== -1 ||
      el.classList.contains(mediaClass)) {
      return el;
    }
    el = el.parentNode;
  }

  return null;
};


ClientUtils.getClosestBlock = function getClosestBlock(el) {

  var blocks = ['p', 'div', 'h1', 'h2', 'figure', 'blockquote'];
  var currTagName;

  if (el.nodeType === 3) {
    el = el.parentElement;
  }

  while (el) {
    currTagName = el.tagName && el.tagName.toLowerCase();
    if (blocks.indexOf(currTagName) !== -1) {
      return el;
    }
    el = el.parentNode;
  }

  return null;
};

ClientUtils.insertAfter = function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode
    .insertBefore(newNode,
      referenceNode.nextSibling);
  return newNode;
};

ClientUtils.wrapSelectedTextNodes = function wrapSelectedTextNodes(element) {
  var textNodes = ClientUtils.getSelectedTextNodes();
  textNodes.forEach(function (node) {
    var wrapElement = element.cloneNode();
    wrapElement.textContent = node.textContent;
    node.parentNode.insertBefore(wrapElement, node.nextSibling);
    node.remove();
  });
};

ClientUtils.getSelectedTextNodes = function getSelectedTextNodes() {
  var selection = window.getSelection();
  var range = selection.getRangeAt(0);
  var parentNode = range.commonAncestorContainer;
  var startNode = range.startContainer;
  var endNode = range.endContainer;
  var endOffset = range.endOffset;
  var pastSelectionStart = false;
  var reachedSelectionEnd = false;
  var textNodes = [];

  function isValidSelectedTextNode(node) {
    return node.nodeType == 3 && pastSelectionStart && !reachedSelectionEnd && node.nodeValue;
  };

  function getTextNodes(node) {
    if(node == startNode) {
      pastSelectionStart = true;
    } else if(node == endNode) {
      // Split endNode at endOffset to only return textNodes
      // that are actually in selection
      node.splitText(endOffset);
      textNodes.push(node);
      reachedSelectionEnd = true;
    } else if(isValidSelectedTextNode(node)) {
      textNodes.push(node);
    }

    for(var i = 0; !reachedSelectionEnd && i < node.childNodes.length; ++i) {
      getTextNodes(node.childNodes[i]);
    }
  };

  getTextNodes(parentNode);
  return textNodes;
};

module.exports = ClientUtils;
