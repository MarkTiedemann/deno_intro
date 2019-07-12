// TODO: Refactor and clean-up.

document.addEventListener("DOMContentLoaded", () => {
  let lastSlide = window.lastSlide;
  let slideNumber = parseInt(location.hash.slice(1)) || 0;
  let slide = document.getElementById(`s${slideNumber}`);
  location.hash = "#" + slideNumber;
  slide.style.display = "block";

  let shift = false;
  let meta = false;

  window.onhashchange = event => {
    let hashNumber = parseInt(location.hash.slice(1));
    if (Number.isNaN(hashNumber)) return;
    if (hashNumber < 0 || hashNumber > lastSlide) return;
    if (hashNumber != slideNumber) {
      slideNumber = hashNumber;
      slide.style.display = "none";
      slide = document.getElementById(`s${slideNumber}`);
      location.hash = "#" + slideNumber;
      slide.style.display = "block";
    }
  };

  document.onkeydown = event => {
    switch (event.key) {
      case "ArrowLeft":
        slide.style.display = "none";
        slideNumber--;
        slide = document.getElementById(`s${slideNumber}`);
        if (slide == null) {
          slideNumber = lastSlide;
          slide = document.getElementById(`s${lastSlide}`);
        }
        location.hash = "#" + slideNumber;
        slide.style.display = "block";
        break;
      case "ArrowRight":
        slide.style.display = "none";
        slideNumber++;
        slide = document.getElementById(`s${slideNumber}`);
        if (slide == null) {
          slideNumber = 0;
          slide = document.getElementById("s0");
        }
        location.hash = "#" + slideNumber;
        slide.style.display = "block";
        break;
      case "Shift":
        shift = true;
        break;
      case "Meta":
        meta = true;
        break;
      case "o":
        if (meta && shift) {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }
        break;
    }
  };

  document.onkeyup = event => {
    switch (event.key) {
      case "Shift":
        shift = false;
        break;
      case "Meta":
        meta = false;
        break;
    }
  };
});
