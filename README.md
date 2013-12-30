Chrome Extension Reloader
=========================

This extension allows users of Google Chrome to reload an extension with a single click on a button.  
At the options page, a simple yet effective interface provides a quick way to change the "active extension" (the extension which is reloaded upon click of the browser action button).

The button can also be clicked using Ctrl + Shift + E (to change this, go to `chrome://extensions/`, and click on "Keyboard Shortcuts")

To use the extension after cloning the repository, follow the following steps:

1. Visit `chrome://extensions/`
2. Enable Developer mode.
3. Click on `Load unpacked`extension`
4. Select the Chrome-Extension-Reloader subdirectory (containing the `manifest.json`).

Server reload
=============

This extension can be set up to reload based on the response of a GET request. Just enable it in the options and add a url. If the server returns `1` then reload, otherwise do nothing.

Published at Stack overflow: [How do I auto-reload a Chrome extension I'm developing?][1]

  [1]: http://stackoverflow.com/a/9645435/938089?how-do-i-auto-reload-a-chrome-extension-im-developing
