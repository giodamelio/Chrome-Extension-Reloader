function something_happened(cb) {
    "use strict";
    chrome.management.getAll(function(result) {
        var cur;
        document.body.innerHTML = 
        'Click "Set" to activate the extension reloader for the selected extension. Click again to undo.<br>' + 
        'Chrome extensions are alphabetically sorted, unpacked on top. Hover over the rows to see the ID.<br><br>' +
        '<strong>Reload on server response.</strong><br>' +
        '<input type="checkbox" id="serverEnabled" /><input type="text" id="server" value="http://127.0.0.1:1337/"/><br>' +
        'Send a simple GET request to this address, if the response is "1" then reload, otherwise do nothing.<br>' +
        '<br><table><thead><th colspan="2"></th><th>name &emsp; version</th></tr></thead><tbody>' + 
        result
        .sort(function(x, y) {
            return x.name.localeCompare(y.name);
        })
        .map(function(extensionInfo) {
            var id = extensionInfo.id;
            var enabled = extensionInfo.enabled;
            var name = htmlspecialchars(extensionInfo.name);
            var version = extensionInfo.version;
            var description = htmlspecialchars(extensionInfo.description);
            return '<tr id="' + id + '" class="' + (enabled ? 'active' : 'inactive') + '" title="' + id + '\n\n' + description + '">' + 
                '<td><img src="chrome://extension-icon/' + id + '/32/1"></td>' + 
                '<td><button>Set</button><button>Reload</button><button>Disable</button></td>' + 
                '<td>' + name + ' &emsp; ' + version + '</td>' + 
                '</tr>';
        }).join('\n') + '</tbody></table>';
        
        cur = document.getElementById(localStorage.getItem('id'));
        if (cur) cur.className += ' affected';
        // Highlight self
        cur = document.getElementById(chrome.i18n.getMessage("@@extension_id"));
        if (cur) {
            cur.className += ' self';
            cur.addEventListener('click', function(e) {
                if (!confirm('After the extension has disabled itself, ' + 
                             'you have to enable it manually via chrome://extensions' + 
                             '\nContinue?')) e.preventDefault(), e.stopPropagation();
            }, false);
        }
        cb()
    });
}

chrome.management.onDisabled.addListener(something_happened);
chrome.management.onEnabled.addListener(something_happened);
chrome.management.onInstalled.addListener(something_happened);
chrome.management.onUninstalled.addListener(something_happened);

something_happened(function() { // Paint the initial items
    serverEnabled = document.getElementById("serverEnabled");
    
    // Check the checkbox if the setting is in localStorage
    if (localStorage["serverEnabled"] == "true") {
        serverEnabled.checked = "checked";
    }

    // Check to see if the server option is enabled
    serverEnabled.onclick = function() {
        if (serverEnabled.checked) {
            localStorage["serverEnabled"] = true
        } else {
            localStorage["serverEnabled"] = false
        }
    }

    // Set the server address
    server = document.getElementById("server");
    localStorage["server"] = server.value
}); 

document.body.addEventListener('click', function(event) {
    var but = event.target, tr, tmp, i;
    if (but.nodeName.toUpperCase() === 'BUTTON') {
        tr = but.parentNode.parentNode;
        // parent = <td>, parent = <tr>
        
        if (but.textContent === 'Reload') {
            reloadExtension(tr.id);
        } else if (but.textContent === 'Disable') {
            chrome.management.setEnabled(tr.id, false);
        } else if (/\baffected\b/.test(tr.className)) {
            tr.className = tr.className.replace(/\baffected\b/g, '');
            localStorage.removeItem('id');
            chrome.browserAction.setTitle({title:'Reload extension'});
        } else if(but.textContent === 'Set') {
            tmp = document.getElementsByClassName('affected');
            for (i=0; i<tmp.length; i++) {
                tmp[i].className = tmp[i].className.replace(/\baffected\b/g, '');
            }
            tr.className += ' affected';
            localStorage.setItem('id', tr.id);
            chrome.browserAction.setTitle({title:'Reload extension:\n' + tr.lastChild.textContent});
        }
    }
}, false);

function reloadExtension(id) {
    chrome.management.setEnabled(id, false, function() {
        chrome.management.setEnabled(id, true);
    });
}
function htmlspecialchars(text) {
    return (text?text+'':'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g, '&quot;').replace(/'/g,'&#34;');
};
