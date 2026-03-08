const TERM_FONT = 10;
const LICENSES = {
  "wtfpl": "https://www.wtfpl.net/about/",

  "cc-by-1.0": "https://spdx.org/licenses/CC-BY-1.0.html",
  "cc-by-2.0": "https://spdx.org/licenses/CC-BY-2.0.html",
  "cc-by-2.5": "https://spdx.org/licenses/CC-BY-2.5.html",
  "cc-by-3.0": "https://spdx.org/licenses/CC-BY-3.0.html",
  "cc-by-4.0": "https://spdx.org/licenses/CC-BY-4.0.html",
  "cc-by": "https://spdx.org/licenses/CC-BY-4.0.html",

  "cc-by-nc-1.0": "https://spdx.org/licenses/CC-BY-NC-1.0.html",
  "cc-by-nc-2.0": "https://spdx.org/licenses/CC-BY-NC-2.0.html",
  "cc-by-nc-2.5": "https://spdx.org/licenses/CC-BY-NC-2.5.html",
  "cc-by-nc-3.0": "https://spdx.org/licenses/CC-BY-NC-3.0.html",
  "cc-by-nc-4.0": "https://spdx.org/licenses/CC-BY-NC-4.0.html",
  "cc-by-nc": "https://spdx.org/licenses/CC-BY-NC-4.0.html",

  "cc-by-nc-nd-1.0": "https://spdx.org/licenses/CC-BY-NC-ND-1.0.html",
  "cc-by-nc-nd-2.0": "https://spdx.org/licenses/CC-BY-NC-ND-2.0.html",
  "cc-by-nc-nd-2.5": "https://spdx.org/licenses/CC-BY-NC-ND-2.5.html",
  "cc-by-nc-nd-3.0": "https://spdx.org/licenses/CC-BY-NC-ND-3.0.html",
  "cc-by-nc-nd-4.0": "https://spdx.org/licenses/CC-BY-NC-ND-4.0.html",
  "cc-by-nc-nd": "https://spdx.org/licenses/CC-BY-NC-ND-4.0.html",

  "cc-by-nc-sa-1.0": "https://spdx.org/licenses/CC-BY-NC-SA-1.0.html",
  "cc-by-nc-sa-2.0": "https://spdx.org/licenses/CC-BY-NC-SA-2.0.html",
  "cc-by-nc-sa-2.5": "https://spdx.org/licenses/CC-BY-NC-SA-2.5.html",
  "cc-by-nc-sa-3.0": "https://spdx.org/licenses/CC-BY-NC-SA-3.0.html",
  "cc-by-nc-sa-4.0": "https://spdx.org/licenses/CC-BY-NC-SA-4.0.html",
  "cc-by-nc-sa": "https://spdx.org/licenses/CC-BY-NC-SA-4.0.html",

  "cc-by-nd-1.0": "https://spdx.org/licenses/CC-BY-ND-1.0.html",
  "cc-by-nd-2.0": "https://spdx.org/licenses/CC-BY-ND-2.0.html",
  "cc-by-nd-2.5": "https://spdx.org/licenses/CC-BY-ND-2.5.html",
  "cc-by-nd-3.0": "https://spdx.org/licenses/CC-BY-ND-3.0.html",
  "cc-by-nd-4.0": "https://spdx.org/licenses/CC-BY-ND-4.0.html",
  "cc-by-nd": "https://spdx.org/licenses/CC-BY-ND-1.0.html",

  "cc-by-sa-1.0": "https://spdx.org/licenses/CC-BY-SA-1.0.html",
  "cc-by-sa-2.0": "https://spdx.org/licenses/CC-BY-SA-2.0.html",
  "cc-by-sa-2.5": "https://spdx.org/licenses/CC-BY-SA-2.5.html",
  "cc-by-sa-3.0": "https://spdx.org/licenses/CC-BY-SA-3.0.html",
  "cc-by-sa-4.0": "https://spdx.org/licenses/CC-BY-SA-4.0.html",
  "cc-by-sa": "https://spdx.org/licenses/CC-BY-SA-4.0.html",

  "cc0-1.0": "https://spdx.org/licenses/CC0-1.0.html",
  "cc0": "https://spdx.org/licenses/CC0-1.0.html",
};

const fileListEl = document.getElementById('fileList')
const statusRight = document.getElementById('statusRight')
const pathTitle = document.getElementById('pathTitle')

const previewContainer = document.getElementById('previewContainer')
const previewPlayer = document.getElementById('previewPlayer')
const previewTitle = document.getElementById('previewTitle')
const downloadLink = document.getElementById('downloadLink')
const srcLink = document.getElementById('srcLink')
const previewComment = document.getElementById('previewComment')
const previewTags = document.getElementById('previewTags')
const previewOrigAuthors = document.getElementById('origAuthors')
const previewAuthors = document.getElementById('authors')
const previewLicense = document.getElementById('previewLicense')
const dirPreview = document.getElementById('dirPreview')

const burger = document.getElementById('burger')
const leftPanel = document.getElementById('leftPanel')
const overlay = document.getElementById('overlay')

let files = []
let selected = 0
let header = ""
let cwd = ""

function breadcrumb() {
  const path = 'openascii' + window.location.pathname;
  console.log(path)
  const segments = path.split('/').filter(seg => seg);
  let cumulativePath = '/';
  const breadcrumbHtml = segments.map((seg, index) => {
    if (index > 0) {
      cumulativePath += `${seg}/`;
    }
    const isLast = index === segments.length - 1;
    let href = cumulativePath + location.search;
    return isLast
      ? `<span>${seg}</span>`
      : `<a href="${href}">${seg}</a>`;
  }).join('/');
  pathTitle.innerHTML = breadcrumbHtml;
}

breadcrumb();

function getBase() {
  return window.location.pathname + window.location.search;
}

function getStorageKey() {
  return 'lastAnchor:' + encodeURIComponent(getBase());
}

// Store or remove the hash based on its presence
function storeHash(hash) {
  try {
    if (hash && hash !== '#' && hash !== '') {
      localStorage.setItem(getStorageKey(), hash.slice(1));
    } else {
      // localStorage.removeItem(getStorageKey());
    }
  } catch (e) {
    // localStorage unavailable (private browsing, etc.) – silently ignore
  }
}

let player = null;

function demoFiles() {
  return [
    {name: "..", type: "dir"},
    {name: ".", type: "dir"},
  ]
}

async function loadMAN(url, targetElement) {
  url = window.location.origin + url
  try {
    const response = await fetch(url, {cache: 'no-cache'});
    if (!response.ok) {
      targetElement.textContent = `HTTP error! status: ${response.status}`
    } else {
      const cont = document.createElement('div')
      cont.className = "man"
      cont.innerHTML = await response.text();
      targetElement.appendChild(cont)
      // targetElement.innerHTML = await response.text();
      if (header != "") {
        const bigElements = document.querySelectorAll('big');
        const target = Array.from(bigElements).find(el =>
          normalize(el.textContent) === header
        );
        if (target) {
          target.classList.add("header-selected")
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        header = ""
      }
    }
  } catch (error) {
    targetElement.innerHTML = `Error loading content: ${error.message}`;
  }
}

function filterFiles(files) {
  if (files.length < 1) {
    return demoFiles()
  }
  const params = new URLSearchParams(window.location.search);
  const authorParam = params.get('author');
  if (!authorParam) return files;

  const normalize = (str) => str.toLowerCase().replace(/\s+/g, '_');
  const normalizedQuery = normalize(authorParam);

  return files.filter((file) => {
    const hasAuthors = file.hasOwnProperty('authors');
    const hasOrigAuthors = file.hasOwnProperty('origAuthors');

    // Files without any author keys are always kept
    if (!hasAuthors && !hasOrigAuthors) return true;

    if (hasAuthors && Array.isArray(file.authors)) {
      if (file.authors.some(author => normalize(author) === normalizedQuery)) {
        return true;
      }
    }

    // Check 'origAuthors' array if it exists
    if (hasOrigAuthors && Array.isArray(file.origAuthors)) {
      if (file.origAuthors.some(author => normalize(author) === normalizedQuery)) {
        return true;
      }
    }

    // No matching author found
    return false;
  });
}

function addLicenseLinks(files) {
  files.forEach((f) => {
    if (Object.hasOwn(f, 'license') && !Object.hasOwn(f, 'licenseLink')) {
      const l = f.license.toLowerCase();
      if (Object.hasOwn(LICENSES, l)) {
        f.licenseLink = LICENSES[l];
      } else {
        const url = new URL("https://duckduckgo.com");
        url.searchParams.append("q", `${f.license} license`);
        f.licenseLink = url.toString();
      }
    }
  })
}

async function loadFiles() {
  try {
    const r = await fetch('./files.json', {cache: 'no-cache'})
    if (!r.ok) throw 0
    files = filterFiles(await r.json())
  } catch {
    files = demoFiles()
  }
  addLicenseLinks(files)

  // if there's an anchor, try to autoselect that entry
  const anchor = decodeURIComponent(location.hash.slice(1) || "")
  if (anchor) {
    const name = anchor.split('/').pop()
    const idx = files.findIndex(f => f.name === name)
    if (idx >= 0) selected = idx
  }

  render()
  openSelection()
}

function render() {
  fileListEl.innerHTML = ""
  files.forEach((f, i) => {
    const el = document.createElement('div')
    el.className = "item " + (
      f.type === 'dir' ? 'dir' : (f.type === 'man' ? 'man' : '')
    ) + (i === selected ? ' selected' : '')
    el.textContent = f.name + (f.sec ? '(' + f.sec + ')' : '')
    el.onclick = () => {
      if (f.type === 'dir') {
        location.href = f.name + location.search;
      }
      selected = i;
      render();
      openSelection();
    }
    fileListEl.appendChild(el)
  })
  statusRight.textContent = (selected + 1) + "/" + files.length
  ensureSelectedVisible()
}

function normalize(str) {
  return str.toLowerCase().replace(/\s+/g, '');
}

function ensureSelectedVisible() {
  const el = fileListEl.querySelector('.item.selected')
  if (el) el.scrollIntoView({block: 'nearest'})
}

async function openSelection() {
  if (player) {
    player.dispose();
  }
  const f = files[selected]
  if (!f) return

  // Set title
  if (f.type === 'dir') {
    previewTitle.textContent = f.name + ' (dir)'
  } else if (f.type === 'man') {
    previewTitle.textContent = f.name + '(' + f.sec + ') man'
  } else if (f.title) {
    previewTitle.textContent = f.title
  } else {
    previewTitle.textContent = f.name
  }
  updateURLHashForSelection()
  updatePageTitle()

  previewAuthors.innerHTML = ""
  if (f.authors && f.authors.length > 0) {
    f.authors.forEach((a, i) => {
      const li = document.createElement('li')
      li.textContent = a
      previewAuthors.appendChild(li)
    })
  }

  previewOrigAuthors.innerHTML = ""
  if (f.origAuthors && f.origAuthors.length > 0) {
    f.origAuthors.forEach((a, i) => {
      const li = document.createElement('li')
      li.textContent = a
      previewOrigAuthors.appendChild(li)
    })
  }

  if (f.license && f.license.length > 0) {
    previewLicense.textContent = f.license
    // TODO: Add built-in licence name to source mapping
    previewLicense.setAttribute("href", f.licenseLink ? f.licenseLink : "https://github.com/asciimoth/3a/blob/main/3a.md#license-key");
  } else {
    previewLicense.textContent = ""
    previewLicense.setAttribute("href", "");
  }

  downloadLink.setAttribute("href", f.data ? f.data : "");
  srcLink.setAttribute("href", f.src ? f.src : "");
  previewComment.textContent = f.comment
  previewTags.textContent = f.tags

  previewPlayer.textContent = ""
  previewPlayer.setAttribute("href", "");
  if (f.preview) {
    let animation = true;
    if (Object.hasOwn(f, 'animation')) {
      animation = f.animation;
    }
    if (f.cols) {
      previewPlayer.style.maxWidth = `${TERM_FONT * f.cols}px`;
    }
    player = AsciinemaPlayer.create(f.preview, previewPlayer, {
      loop: animation,
      autoPlay: true,
      fit: "width",
      cols: f.cols,
      rows: f.rows,
      theme: 'custom'
    });
  }


  dirPreview.innerHTML = ""
  if (f.type === 'dir') {
    try {
      const dirPath = (cwd ? cwd + '/' : '') + f.name
      const r = await fetch(dirPath + '/files.json')
      if (!r.ok) throw 0
      const files = await r.json()
      dirPreview.textContent = ''
      files.forEach((f, i) => {
        const el = document.createElement('div')
        el.className = "item " + (f.type === 'dir' ? 'dir' : '')
        el.textContent = f.name
        dirPreview.appendChild(el)
      })
    } catch {
      dirPreview.textContent = '[void]'
    }
  } else if (f.type === "man") {
    const el = document.createElement('div')
    loadMAN(f.path, dirPreview)
  } else {
    dirPreview.textContent = ''
  }
}

function updateURLHashForSelection() {
  const f = files[selected]
  if (!f) return
  const full = (cwd ? cwd + '/' : '') + f.name
  const hash = encodeURIComponent(full)
  history.replaceState(null, '', '#' + hash)
  storeHash(window.location.hash);
}

function updatePageTitle() {
  const f = files[selected]
  document.title = f ? f.name : 'Open Ascii'
}

function goUp() {
  const pathname = window.location.pathname
  if (pathname === '/' || pathname === '') {
    return;
  }

  // Compute parent path (remove last segment)
  let parentPath = pathname.replace(/\/[^/]*\/?$/, '');
  // if (pathname === '') pathname = '/';

  console.log(pathname, parentPath)

  // Check if previous page is the parent(same origin & path)
  const referrer = document.referrer;
  if (referrer) {
    try {
      const referrerUrl = new URL(referrer);
      if (referrerUrl.origin === window.location.origin && (
        referrerUrl.pathname === parentPath ||
        referrerUrl.pathname === (parentPath + "/")
      )) {
        // Came from parent -> go back in history
        history.back();
        return;
      }
    } catch (e) {
      // Ignore invalid referrer URLs
      console.log(e);
    }
    return;
  }

  if (parentPath === '') parentPath = '/';
  location.href = parentPath + location.search;
}

function move(d) {
  let selected_old = selected;
  if (d === 'top') selected = 0
  if (d === 'bottom') selected = Math.max(0, files.length - 1)
  if (d === 'down') selected = Math.min(files.length - 1, selected + 1)
  if (d === 'up') selected = Math.max(0, selected - 1)
  if (selected != selected_old) {
    render()
    openSelection()
  }
}

function onKey(e) {
  const k = e.key
  if (k === 'PageUp' || k === 'g' || k === 'п') {e.preventDefault(); move('top')}
  else if (k === 'PageDown' || k === 'G' || k === 'П') {e.preventDefault(); move('bottom')}
  else if (k === 'ArrowDown' || k === 'j' || k === 'о') {e.preventDefault(); move('down')}
  else if (k === 'ArrowUp' || k === 'k' || k === 'л') {e.preventDefault(); move('up')}
  else if (k === 'Enter' || k === 'l' || k === 'ArrowRight' || k === ' ' || k === 'д') {
    const f = files[selected]
    if (f.type === 'dir') {
      // navigate into directory
      // location.href = f.name

      const currentParams = new URLSearchParams(location.search);
      const targetUrl = new URL(f.name, location.origin + location.pathname);

      // Merge current params into target's search params
      for (let [key, value] of currentParams) {
        targetUrl.searchParams.set(key, value);
      }

      location.href = targetUrl.toString();
    }
  } else if (k === 'ArrowLeft' || k === 'h' || k === 'р') {
    // nav back
    goUp();
  } else if (k === 'J' || k === 'О') {
    previewContainer.scrollBy({top: 50, behavior: 'smooth'}); // down
  } else if (k === "K" || k === 'Л') {
    previewContainer.scrollBy({top: -50, behavior: 'smooth'}); // up
  } else if (k === "d" || k === "D" || k === 'в' || k === 'В') {
    if (downloadLink.attributes.href.value != '') {
      downloadLink.click();
    }
  } else if (k === "s" || k === 'ы') {
    if (srcLink.attributes.href.value != '') {
      srcLink.click();
    }
  } else if (k === "S" || k === 'Ы') {
    if (srcLink.attributes.href.value != '') {
      srcLink.target = '_blank';
      srcLink.rel = 'noopener noreferrer';
      srcLink.click();
      window.focus();
      srcLink.target = "";
      srcLink.rel = "";
    }
  } else if (k === "o" || k === 'щ') {
    window.open(window.location.href, '_blank');
  }
}

window.addEventListener('keydown', onKey)

burger?.addEventListener('click', () => {
  leftPanel.classList.toggle('open')
  overlay.classList.toggle('show')
})

overlay?.addEventListener('click', () => {
  leftPanel.classList.remove('open')
  overlay.classList.remove('show')
})


function handleAnchor() {
  if (location.hash) {
    const u = location.hash.slice(1).split("~")
    if (u.length > 1) {
      header = normalize(u[1])
    } else {
      header = ""
    }
    const anchor = decodeURIComponent(u[0])
    const name = anchor.split('/').pop()
    const idx = files.findIndex(f => f.name === name)
    if (idx >= 0) {selected = idx; render(); openSelection()}
  } else {
    // No hash – check if we have a stored hash for this page
    try {
      const stored = localStorage.getItem(getStorageKey());
      if (stored) {
        // this will trigger a 'hashchange' event
        window.location.hash = stored;
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }
}

window.addEventListener('load', handleAnchor);
window.addEventListener('hashchange', handleAnchor);

loadFiles()
