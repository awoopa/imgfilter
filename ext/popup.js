document.addEventListener('DOMContentLoaded', () => {
  // Load previous state of settings
  chrome.storage.sync.get(null, (store) => {
    // Load button toggles
    if (store['blockEpileptic']) {
      document.getElementById('blockEpileptic').checked = true
    } else {
      document.getElementById('blockEpileptic').checked = false
    }

    if (store['blockNSFW']) {
      document.getElementById('blockNSFW').checked = true
    } else {
      document.getElementById('blockNSFW').checked = false
    }

    // Load blacklist items
    if (store['blacklist']) {
      const reverseBlacklist = store['blacklist'].reverse();
      const tableBody = document.getElementById('blacklistTableBody');

      for (let i = 0; i < reverseBlacklist.length; i++) {
        prependRowToTable(tableBody, reverseBlacklist[i]);
      }
    }
  });


  // Add event listeners for button toggles
	document.getElementById('blockEpileptic').addEventListener('click', () => {
    const blockEpilepticChecked = document.getElementById('blockEpileptic').checked
    chrome.storage.sync.set({'blockEpileptic': blockEpilepticChecked});
	});

  document.getElementById('blockNSFW').addEventListener('click', () => {
    const blockEpilepticChecked = document.getElementById('blockNSFW').checked
    chrome.storage.sync.set({'blockNSFW': blockEpilepticChecked});
  });

  // Add event listeners for new blacklist items
  document.getElementById('addBlacklistItem').addEventListener('keyup', () => {
    // Check if event is enter key
    if (event.keyCode !== 13) {
      return
    }

    // Read blacklist item and clear entry field
    const blacklistItem = document.getElementById('addBlacklistItem').value;
    document.getElementById('addBlacklistItem').value = '';

    // Save new blacklist item to Chrome local storage
    chrome.storage.sync.get(null, (store) => {
      blacklist = store['blacklist'];
      if (blacklist == null) {
        blacklist = [];
      }

      if (blacklist.includes(blacklistItem)) {
        return;
      }

      // Add new blacklist item to table
      const tableBody = document.getElementById('blacklistTableBody');
      prependRowToTable(tableBody, blacklistItem);
      
      blacklist.unshift(blacklistItem);
      chrome.storage.sync.set({'blacklist': blacklist});
    });
  });
});

function prependRowToTable(table, rowText) {
  const row = document.createElement('tr');
  const cell = document.createElement('td');
  const cellText = document.createTextNode(rowText);
  const removeButton = document.createElement('div');

  removeButton.innerHTML = '<span aria-hidden="true">&times;</span>';
  removeButton.classList.add('removeButton');
  removeButton.id = cellText;

  cell.appendChild(cellText);
  cell.appendChild(removeButton);
  row.appendChild(cell);
  table.prepend(row);

  removeButton.addEventListener('click', () => {
    deleteBlacklistItem(table, rowText);
  });
}

function deleteBlacklistItem(table, textToDelete) {
  for (var i = 0, row; row = table.rows[i]; i++) {
    let rowText = row.children[0].textContent;
    rowText = rowText.slice(0, -1).trim();
    
    if (rowText === textToDelete) {
      table.deleteRow(i);

      chrome.storage.sync.get(null, (store) => {
        let blacklist = store['blacklist'];
        blacklist = blacklist.filter(e => e !== textToDelete)
        chrome.storage.sync.set({'blacklist': blacklist});
      });
    }
  }
}
