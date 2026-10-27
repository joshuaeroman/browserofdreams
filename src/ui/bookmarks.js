import { BOOKMARK_FOLDERS } from "../data/bookmarks.js";
import { els } from "./dom.js";
import { applyEraTheme } from "../core/era.js";

var onNavigate = null;
var openMenu = null;
var docCloser = null;

function closeMenu() {
  if (openMenu && openMenu.el && openMenu.el.parentNode) {
    openMenu.el.parentNode.removeChild(openMenu.el);
  }
  if (openMenu && openMenu.anchor) {
    openMenu.anchor.setAttribute("aria-expanded", "false");
  }
  openMenu = null;
  if (docCloser) {
    document.removeEventListener("click", docCloser, true);
    document.removeEventListener("keydown", docCloser, true);
    docCloser = null;
  }
}

function openBookmark(item) {
  closeMenu();
  if (!item || !item.url) return;
  if (els.urlInput) els.urlInput.value = item.url;
  if (els.dateInput) els.dateInput.value = item.date;
  applyEraTheme(item.date);
  if (onNavigate) {
    onNavigate(item.url, item.date, { pushHistory: true, forceReload: false });
  }
}

function placeMenu(menu, anchor) {
  var rect = anchor.getBoundingClientRect();
  var margin = 8;
  menu.style.visibility = "hidden";
  menu.style.left = "0px";
  menu.style.top = "0px";
  var width = menu.offsetWidth;
  var height = menu.offsetHeight;
  var left = rect.left;
  if (left + width > window.innerWidth - margin) {
    left = Math.max(margin, window.innerWidth - width - margin);
  }
  var top = rect.bottom + 2;
  if (top + height > window.innerHeight - margin && rect.top > height) {
    top = rect.top - height - 2;
  }
  menu.style.left = left + "px";
  menu.style.top = top + "px";
  menu.style.visibility = "visible";
}

function attachCloser(anchor) {
  docCloser = function(ev) {
    if (ev.type === "keydown") {
      if (ev.key === "Escape") closeMenu();
      return;
    }
    if (openMenu && openMenu.el && openMenu.el.contains(ev.target)) return;
    if (anchor && anchor.contains(ev.target)) return;
    closeMenu();
  };
  document.addEventListener("click", docCloser, true);
  document.addEventListener("keydown", docCloser, true);
}

function showMenu(anchor, build) {
  if (openMenu && openMenu.anchor === anchor) {
    closeMenu();
    return;
  }
  closeMenu();
  var menu = document.createElement("div");
  menu.className = "bookmark-menu";
  menu.setAttribute("role", "menu");
  build(menu);
  document.body.appendChild(menu);
  placeMenu(menu, anchor);
  anchor.setAttribute("aria-expanded", "true");
  openMenu = { el: menu, anchor: anchor };
  attachCloser(anchor);
}

function addItemButton(parent, item) {
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "bookmark-menu-item";
  btn.setAttribute("role", "menuitem");
  btn.textContent = item.label;
  btn.title = item.url + " · " + item.date;
  btn.addEventListener("click", function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    openBookmark(item);
  });
  parent.appendChild(btn);
}

function showFolder(anchor, folder) {
  showMenu(anchor, function(menu) {
    for (var i = 0; i < folder.items.length; i++) {
      addItemButton(menu, folder.items[i]);
    }
  });
}

export function openAllBookmarksMenu(anchor) {
  if (!anchor) return;
  showMenu(anchor, function(menu) {
    menu.classList.add("bookmark-menu-all");
    for (var f = 0; f < BOOKMARK_FOLDERS.length; f++) {
      var folder = BOOKMARK_FOLDERS[f];
      var heading = document.createElement("div");
      heading.className = "bookmark-menu-heading";
      heading.textContent = folder.name;
      menu.appendChild(heading);
      for (var i = 0; i < folder.items.length; i++) {
        addItemButton(menu, folder.items[i]);
      }
    }
  });
}

export function renderBookmarks(navigate) {
  onNavigate = navigate;
  var bar = document.getElementById("bookmarks-bar");
  if (!bar) return;
  bar.innerHTML = "";
  var title = document.createElement("span");
  title.className = "bookmarks-title";
  title.textContent = "Bookmarks:";
  bar.appendChild(title);

  for (var f = 0; f < BOOKMARK_FOLDERS.length; f++) {
    (function(folder) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bookmark-chip bookmark-folder";
      btn.setAttribute("aria-haspopup", "menu");
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = folder.name;
      btn.title = folder.items.length + " bookmarks";
      btn.addEventListener("click", function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        showFolder(btn, folder);
      });
      bar.appendChild(btn);
    })(BOOKMARK_FOLDERS[f]);
  }
}
