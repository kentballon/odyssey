(function () {
  var STORAGE_KEY = "findings-theme";
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");

  function apply(theme) {
    root.setAttribute("data-theme", theme);
  }

  function stored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function save(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage unavailable, ignore */
    }
  }

  var saved = stored();
  if (saved === "light" || saved === "dark") {
    apply(saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    apply("light");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      save(next);
    });
  }
})();
