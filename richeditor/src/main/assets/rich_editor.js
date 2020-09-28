/**
 * Copyright (C) 2017 Wasabeef
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* jshint esversion: 6 */

/* Helper Function */
// https://stackoverflow.com/questions/111529/how-to-create-query-parameters-in-javascript
function encodeQueryData(data) {
  const ret = [];
  for (var d in data) {
    if ({}.hasOwnProperty.call(data, d)) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
  }
  return "?" + ret.join('&');
}

const RE = {};

RE.currentSelection = {
  startContainer: 0,
  startOffset: 0,
  endContainer: 0,
  endOffset: 0,
};

RE.editor = document.getElementById('editor');

document.addEventListener('selectionchange', function addEventListener() {
  RE.backuprange();
  RE.selectionChange();
});


// Initializations
RE.textChange = function textChange() {
  Android.textChange(RE.getText(), RE.getHtml());
};

RE.selectionChange = function selectionChange() {
  // query all the commands for this range.
  const isBold = document.queryCommandState('bold');
  const isItalic = document.queryCommandState('italic');
  const isUnderline = document.queryCommandState('underline');
  const isStrikethrough = document.queryCommandState('strikeThrough');
  const isUnorderedList = document.queryCommandState('insertUnorderedList');
  const isOrderedList = document.queryCommandState('insertOrderedList');

    // For some reason queryCommandState is returning false for these two commands.
    //    const isSubscript     = document.queryCommandState("subscript");
    //    const isSuperscript   = document.queryCommandState("superscript");

  // So instead, i am using these alternative.
    var selection = window.getSelection();
    var nodes = [];
    var parentElement = selection.getRangeAt(0).startContainer.parentElement;
    nodes.push(parentElement); // grab an array of all nodes of the curent selection
    while(parentElement.parentNode) {
      nodes.unshift(parentElement.parentNode);
      parentElement = parentElement.parentNode;
    }

    const lowerCasedTagNamesOfNodes = nodes.map(function(el) {
      var tagName = el.tagName;
      if (tagName !== undefined) {
          return tagName.toLowerCase();
      }
    });

    const isSuperscript = lowerCasedTagNamesOfNodes.includes("sup");
    const isSubscript   = lowerCasedTagNamesOfNodes.includes("sub");

    const enabledFormatTypes = {
        isBold:          isBold,
        isItalic:        isItalic,
        isUnderline:     isUnderline,
        isStrikethrough: isStrikethrough,
        isSuperscript:   isSuperscript,
        isSubscript:     isSubscript,
        isUnorderedList: isUnorderedList,
        isOrderedList:   isOrderedList
    }
    const querystring = encodeQueryData(enabledFormatTypes);
    Android.selectionChange(querystring, RE.getText());
};

RE.setHtml = function setHtml(contents) {
  RE.editor.innerHTML = decodeURIComponent(contents.replace(/\+/g, '%20'));
};

RE.getHtml = function getHtml() {
  // removes unnecessary extra <br> tags on the beggining and end of the html string.
  const trimmedHTML = RE.editor.innerHTML.replace(/^( |<br>)*(.*?)( |<br>)*$/, '$2');
  return trimmedHTML;
};

RE.getText = function getText() {
  // trim to remove space on start and end of the text
  return RE.editor.innerText.trim();
};

RE.setBaseTextColor = function setBaseTextColor(color) {
  RE.editor.style.color = color;
};

RE.setBaseFontSize = function setBaseFontSize(size) {
  RE.editor.style.fontSize = size;
};

RE.setPadding = function setPadding(left, top, right, bottom) {
  RE.editor.style.paddingLeft = left;
  RE.editor.style.paddingTop = top;
  RE.editor.style.paddingRight = right;
  RE.editor.style.paddingBottom = bottom;
};

RE.setBackgroundColor = function setBackgroundColor(color) {
  document.body.style.backgroundColor = color;
};

RE.setBackgroundImage = function setBackgroundImage(image) {
  RE.editor.style.backgroundImage = image;
};

RE.setWidth = function setWidth(size) {
  RE.editor.style.minWidth = size;
};

RE.setHeight = function setHeight(size) {
  RE.editor.style.height = size;
};

RE.setTextAlign = function setTextAlign(align) {
  RE.editor.style.textAlign = align;
};

RE.setVerticalAlign = function setVerticalAlign(align) {
  RE.editor.style.verticalAlign = align;
};

RE.setPlaceholder = function setPlaceholder(placeholder) {
  RE.editor.setAttribute('placeholder', placeholder);
};

RE.setInputEnabled = function setInputEnabled(inputEnabled) {
  RE.editor.contentEditable = String(inputEnabled);
};

RE.undo = function undo() {
  document.execCommand('undo', false, null);
};

RE.redo = function redo() {
  document.execCommand('redo', false, null);
};

RE.setBold = function setBold() {
  document.execCommand('bold', false, null);
};

RE.setItalic = function setItalic() {
  document.execCommand('italic', false, null);
};

RE.setSubscript = function setSubscript() {
  document.execCommand('subscript', false, null);
};

RE.setSuperscript = function setSuperscript() {
  document.execCommand('superscript', false, null);
};

RE.setStrikeThrough = function setStrikeThrough() {
  document.execCommand('strikeThrough', false, null);
};

RE.setUnderline = function setUnderline() {
  document.execCommand('underline', false, null);
};

RE.setBullets = function setBullets() {
  document.execCommand('insertUnorderedList', false, null);
};

RE.setNumbers = function setNumbers() {
  document.execCommand('insertOrderedList', false, null);
};

RE.setTextColor = function setTextColor(color) {
  RE.restorerange();
  document.execCommand('styleWithCSS', null, true);
  document.execCommand('foreColor', false, color);
  document.execCommand('styleWithCSS', null, false);
};

RE.setTextBackgroundColor = function setTextBackgroundColor(color) {
  RE.restorerange();
  document.execCommand('styleWithCSS', null, true);
  document.execCommand('hiliteColor', false, color);
  document.execCommand('styleWithCSS', null, false);
};

RE.setFontSize = function setFontSize(fontSize) {
  document.execCommand('fontSize', false, fontSize);
};

RE.setHeading = function setHeading(heading) {
  document.execCommand('formatBlock', false, '<h'+heading+'>');
};

RE.setIndent = function setIndent() {
  document.execCommand('indent', false, null);
};

RE.setOutdent = function setOutdent() {
  document.execCommand('outdent', false, null);
};

RE.setJustifyLeft = function setJustifyLeft() {
  document.execCommand('justifyLeft', false, null);
};

RE.setJustifyCenter = function setJustifyCenter() {
  document.execCommand('justifyCenter', false, null);
};

RE.setJustifyRight = function setJustifyRight() {
  document.execCommand('justifyRight', false, null);
};

RE.setBlockquote = function setBlockquote() {
  document.execCommand('formatBlock', false, '<blockquote>');
};

RE.insertImage = function insertImage(url, alt) {
  var html = '<img src="' + url + '" alt="' + alt + '" />';
  RE.insertHTML(html);
};

RE.insertHTML = function insertHTML(html) {
  RE.restorerange();
  document.execCommand('insertHTML', false, html);
};

RE.insertLink = function insertLink(url, title) {
  RE.restorerange();
  const sel = document.getSelection();
  if (sel.toString().length === 0) {
    document.execCommand("insertHTML",false,"<a href='"+url+"'>"+title+"</a>");
  } else if (sel.rangeCount) {
    const el = document.createElement('a');
    el.setAttribute('href', url);
    el.setAttribute('title', title);

    const range = sel.getRangeAt(0).cloneRange();
    range.surroundContents(el);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  RE.textChange();
};

RE.setTodo = function setTodo(text) {
  var html = '<input type="checkbox" name="'+ text +'" value="'+ text +'"/> &nbsp;';
  document.execCommand('insertHTML', false, html);
};

RE.prepareInsert = function prepareInsert() {
  RE.backuprange();
};

RE.backuprange = function backuprange() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    RE.currentSelection = {
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset,
    };
  }
};

RE.restorerange = function restorerange() {
  const selection = window.getSelection();
  selection.removeAllRanges();
  const range = document.createRange();
  range.setStart(RE.currentSelection.startContainer, RE.currentSelection.startOffset);
  range.setEnd(RE.currentSelection.endContainer, RE.currentSelection.endOffset);
  selection.addRange(range);
};

RE.enabledEditingItems = function enabledEditingItems(e) {
  const items = [];
  if (document.queryCommandState('bold')) {
    items.push('bold');
  }
  if (document.queryCommandState('italic')) {
    items.push('italic');
  }
  if (document.queryCommandState('subscript')) {
    items.push('subscript');
  }
  if (document.queryCommandState('superscript')) {
    items.push('superscript');
  }
  if (document.queryCommandState('strikeThrough')) {
    items.push('strikeThrough');
  }
  if (document.queryCommandState('underline')) {
    items.push('underline');
  }
  if (document.queryCommandState('orderedList')) {
    items.push('orderedList');
  }
  if (document.queryCommandState('unorderedList')) {
    items.push('unorderedList');
  }
  if (document.queryCommandState('justifyCenter')) {
    items.push('justifyCenter');
  }
  if (document.queryCommandState('justifyFull')) {
    items.push('justifyFull');
  }
  if (document.queryCommandState('justifyLeft')) {
    items.push('justifyLeft');
  }
  if (document.queryCommandState('justifyRight')) {
    items.push('justifyRight');
  }
  if (document.queryCommandState('insertHorizontalRule')) {
    items.push('horizontalRule');
  }
  const formatBlock = document.queryCommandValue('formatBlock');
  if (formatBlock.length > 0) {
    items.push(formatBlock);
  }

  window.location.href = "re-state://" + encodeURI(items.join(','));
};

RE.focus = function focus() {
  const range = document.createRange();
  range.selectNodeContents(RE.editor);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  RE.editor.focus();
};

RE.blurFocus = function blurFocus() {
  RE.editor.blur();
};

RE.removeFormat = function removeFormat() {
  document.execCommand('removeFormat', false, null);
};

// Event Listeners
RE.editor.addEventListener('input', RE.textChange);
RE.editor.addEventListener('keyup', function addEventListener(e) {
  const KEY_LEFT = 37; const
    KEY_RIGHT = 39;
  if (e.which === KEY_LEFT || e.which === KEY_RIGHT) {
    RE.enabledEditingItems(e);
  }
});
RE.editor.addEventListener('click', RE.enabledEditingItems);
RE.editor.addEventListener('paste', function addEventListener(evt) {
  evt.preventDefault();
  const plain = Clipboard.getText();
  RE.insertHTML(plain);
});
