/* ---------------- Native touch handling ---------------- */
var startLoc = null;
var contentName = parseInt(localStorage.getItem("currentbrand"));
var currentContentId = parseInt(localStorage.getItem("currentcontent"));

checkClickThrough();

document
  .getElementById("main_content")
  .addEventListener("touchmove", touchHandler, { passive: false });
document
  .getElementById("main_content")
  .addEventListener("touchstart", touchHandler, { passive: false });
function touchHandler(e) {
  if (e.type == "touchstart") {
    if (e.touches.length == 1) {
      // one finger touch
      var touch = e.touches[0];
      startLoc = { x: touch.pageX, y: touch.pageY };
    }
  } else if (e.type == "touchmove") {
    // allow pinch zoom
    if (e.touches.length > 1) {
      startLoc = null;
      return;
    }
    if (startLoc) {
      var touch = e.touches[0];
      if (
        Math.abs(startLoc.x - touch.pageX) > Math.abs(startLoc.y - touch.pageY)
      ) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
      startLoc = null;
    }
  }
}
/* ---------------- Presentation controls and navigation ---------------- */

$(document).ready(function () {
  var ua = navigator.userAgent;
  //var event = "touchstart";
  var event = ua.match(/Ipad/i) ? "touchstart" : "click";

  $(".left_arrow").click(function (event) {
    go_nav("b");
  });

  $(".right_arrow").click(function (event) {
    go_nav("f");
  });

  $(".slides").click(function () {
    var slideNum = $(this).index() + 1;
    console.log(slideNum);
    open_page("", slideNum);
  });

  $(".reference").removeClass("active");

  $(".reference").on("swipeleft swiperight", function (event) {
    event.stopPropagation();
  });

  $(".box_btn").bind("click", function () {
    $(".reference").toggleClass("active");
  });

  currentSlide();

  $("#main_content").swipe({
    swipeLeft: function (event, direction, distance, duration, fingerCount) {
      var page_id = parseInt($("#wrapper").attr("rel"));
      var last_page_id = $(".slides").length;
      var slide_jumper_open = $(".reference").hasClass("active");
      if (page_id == last_page_id + 1) {
        return;
      } else {
        go_nav("f");
      }
    },

    swipeRight: function (event, direction, distance, duration, fingerCount) {
      var page_id = parseInt($("#wrapper").attr("rel"));
      var slide_jumper_open = $(".reference").hasClass("active");

      if (page_id == 0) {
        return;
      } else {
        go_nav("b");
      }
    },

    //Default is 75px, set to 0 for demo so any distance triggers swipe
    threshold: 0,
  });
});

// Move backward or forward and notify the native presentation container.
function go_nav(direction) {
  var page_id = parseInt($("#wrapper").attr("rel"));

  var flag = 0;
  if (direction == "b") {
    if (page_id >= 0) {
      page_id = page_id - 1;
      //alert(page_id);
      //console.log(page_id);
      if (page_id == 2) {
        flag = 2;
      }
    }
    if (flag == 2) {
      localStorage.setItem("gotoNextPrevBrand", 2); //if one than next if 2 than prev
      //flag == 0;
      var objectData = {
        gotoNextPrevBrand: localStorage.getItem("gotoNextPrevBrand"),
        previousslide: localStorage.getItem("previousslide"),
        slideId: page_id,
      };
      var params = {
        query: objectData,

        type: "brandNavigation",
        callback: "checkLastPgFn",
      };
      setTimeout(function () {
        if (
          window.messageHandler &&
          typeof window.messageHandler.postMessage === "function"
        ) {
          window.messageHandler.postMessage(JSON.stringify(params));
        }
      }, 0); //pageswipe

    } else {
      localStorage.setItem("gotoNextPrevBrand", 0);
      var objectData = {
        gotoNextPrevBrand: localStorage.getItem("gotoNextPrevBrand"),
        previousslide: localStorage.getItem("previousslide"),
        slideId: page_id,
      };
      var params = {
        query: objectData,

        type: "brandNavigation",
        callback: "checkLastPgFn",
      };
      setTimeout(function () {
        if (
          window.messageHandler &&
          typeof window.messageHandler.postMessage === "function"
        ) {
          window.messageHandler.postMessage(JSON.stringify(params));
        }
      }, 0); //pageswipe
    }
  } else {
    if (page_id <= 3) {
      page_id = page_id + 1;
      //alert(page_id);
      if (page_id == 4) {
        flag = 1;
      }
    }
    if (flag == 1) {
      localStorage.setItem("gotoNextPrevBrand", 1); //if one than next if 2 than prev
      flag == 0;
      var objectData = {
        gotoNextPrevBrand: localStorage.getItem("gotoNextPrevBrand"),
        previousslide: localStorage.getItem("previousslide"),
        slideId: page_id,
      };
      var params = {
        query: objectData,

        type: "brandNavigation",
        callback: "checkLastPgFn",
      };
      setTimeout(function () {
        if (
          window.messageHandler &&
          typeof window.messageHandler.postMessage === "function"
        ) {
          window.messageHandler.postMessage(JSON.stringify(params));
        }
      }, 0); //pageswipe
    } else {
      localStorage.setItem("gotoNextPrevBrand", 0);
      var objectData = {
        gotoNextPrevBrand: localStorage.getItem("gotoNextPrevBrand"),
        previousslide: localStorage.getItem("previousslide"),
        slideId: page_id,
      };
      var params = {
        query: objectData,

        type: "brandNavigation",
        callback: "checkLastPgFn",
      };
      setTimeout(function () {
        if (
          window.messageHandler &&
          typeof window.messageHandler.postMessage === "function"
        ) {
          window.messageHandler.postMessage(JSON.stringify(params));
        }
      }, 0); //pageswipe
    }
  }

  $("#wrapper").attr("rel", page_id);
  resetZoom();
  var content = "";
  if (flag == 0) {
    var pg_content = set_pg_content(page_id);

    $("#zoom_container").html(pg_content);
  }

  checkClickThrough();
}

// Return the image-layer markup and stylesheet for the requested slide.
function set_pg_content(pg_id) {
  $(".reference").removeClass("active");
  currentSlide();
  var selectedContentPath = "";
  switch (pg_id) {
    case 1:
	content='<link rel="stylesheet" type="text/css" href="slide1/slide1.css" media="screen"/><div class="s1"><img src="slide1/s1.png"></div><div class="s2"><img src="slide1/s2.png"></div><video preload="auto" class="s3" id="s3" width="1080" height="810"><source src="slide1/s1.mp4" type="video/mp4"></video><div class="tapIt" onclick="tapIt()"></div>';
	break;
	case 2:
	content='<link rel="stylesheet" type="text/css" href="slide1/slide1.css" media="screen"/><div class="s1"><img src="slide2/s1.jpg" width="1080" height="810" alt=""></div>';
	break;
	case 3:
	content='<link rel="stylesheet" type="text/css" href="slide1/slide1.css" media="screen"/><div class="s1"><img src="slide3/s1.jpg" width="1080" height="810" alt=""></div>';
	break;
  }

  return content;
}

function showDiv() {
  document.getElementById("welcomeDiv").style.display = "block";
}
function showDiv2() {
  document.getElementById("welcomeDiv2").style.display = "block";
}

// Open a specific slide from the thumbnail drawer or an interactive hotspot.
function open_page(url, page_id) {
  localStorage.getItem("currentbrand");
  localStorage.getItem("currentcontent");
  localStorage.getItem("currentcontentbrandId");
  localStorage.getItem("current");
  localStorage.setItem("gotoNextPrevBrand", 0);

  var objectData = {
    gotoNextPrevBrand: localStorage.getItem("gotoNextPrevBrand"),
    previousslide: localStorage.getItem("previousslide"),
    slideId: page_id,
  };
  var params = {
    query: objectData,
    type: "brandNavigation",
    callback: "checkLastPgFn",
  };

  setTimeout(function () {
    if (
      window.messageHandler &&
      typeof window.messageHandler.postMessage === "function"
    ) {
      window.messageHandler.postMessage(JSON.stringify(params));
    }
  }, 0); //pageswipe

  $("#wrapper").attr("rel", page_id);
  resetZoom();
  var content = "";
  var pg_content = set_pg_content(page_id);

  $("#zoom_container").html(pg_content);

  checkClickThrough();
}

// Refresh the native click-through overlay for the active slide.
function checkClickThrough() {
  var currentslide = localStorage.getItem("currentslide");
  //alert(currentslide);
  document.getElementById("click_through").innerHTML = "";

  if (currentslide == 1) {
    document.getElementById("click_through").innerHTML = "";
  }
  if (currentslide == 2) {
    document.getElementById("click_through").innerHTML = "";
  }
}

function checkBtns(refNum) {
  switch (refNum) {
    case 1:
    open_page("", 1);
    break;
  }
}

// Highlight the active thumbnail and start its animation sequence.
function currentSlide() {
  var curr_id = parseInt($("#wrapper").attr("rel"));
  $(".slides").removeClass("active");
  $(".slides:nth-child(" + curr_id + ")").addClass("active");
}

var ln = 0;
function myconsole(msg) {
  var oldMsg = "</br>" + ln + ". " + $("#myconsole").html();
  ln++;
  $("#myconsole").html(msg + oldMsg);
}

// Build the timestamp format expected by the surrounding presentation system.
function currentTimeInDatabaseFormat() {
  //to get current time in dd-mm-yyyy hh:mm:ss
  var year = new Date().getFullYear();
  var month = new Date().getMonth();
  month = parseInt(month) + 1;
  if (month.toString().length == 1) {
    month = "0" + month;
  }

  var date = new Date().getDate();
  if (date.toString().length == 1) {
    date = "0" + date;
  }

  var hour = new Date().getHours();
  if (hour.toString().length == 1) {
    hour = "0" + hour;
  }

  var minutes = new Date().getMinutes();
  if (minutes.toString().length == 1) {
    minutes = "0" + minutes;
  }

  var seconds = new Date().getSeconds();
  if (seconds.toString().length == 1) {
    seconds = "0" + seconds;
  }

  var duration =
    year +
    "-" +
    month +
    "-" +
    date +
    "-" +
    hour +
    ":" +
    minutes +
    ":" +
    seconds;
  return duration;
}

$(document).ready(function () {
  $("body").on("click", ".touchbtn", function () {
    $(".right_arrow").trigger("click");
  });

  $(document).on("click", ".btnshow", function () {
    //alert('hi')
    $(".touchbtn").css("display", "block");
  });
});

/* ---------------- Pinch Zoom for slide content (touch + mouse) ---------------- */
(function () {
  var zoomEl = document.getElementById("zoom_container");
  var containerEl = document.getElementById("main_content");
  if (!zoomEl || !containerEl) return;
  var scale = 1;
  var minScale = 1;
  var maxScale = 3;
  var panX = 0;
  var panY = 0;
  var initialDistance = 0;
  var isPinching = false;
  var isPanning = false;
  var startPanX = 0;
  var startPanY = 0;
  var touchStartX = 0;
  var touchStartY = 0;

  function getDistance(t) {
    var dx = t[0].clientX - t[1].clientX;
    var dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getMidpoint(t) {
    var rect = containerEl.getBoundingClientRect();
    return {
      x: (t[0].clientX + t[1].clientX) / 2 - rect.left,
      y: (t[0].clientY + t[1].clientY) / 2 - rect.top,
    };
  }

  // Keep pan within the bounds of the scaled content, so you can
  // never drag past its edges and reveal empty space.
  function clampPan() {
    var w = containerEl.clientWidth;
    var h = containerEl.clientHeight;
    var scaledW = w * scale;
    var scaledH = h * scale;

    var minX = w - scaledW; // most negative allowed (content bigger than box)
    var maxX = 0;
    var minY = h - scaledH;
    var maxY = 0;

    if (scaledW <= w) {
      panX = 0;
    } else {
      panX = Math.min(maxX, Math.max(minX, panX));
    }

    if (scaledH <= h) {
      panY = 0;
    } else {
      panY = Math.min(maxY, Math.max(minY, panY));
    }
  }

  function zoomToward(px, py, newScale) {
    newScale = Math.max(minScale, Math.min(newScale, maxScale));
    var ratio = newScale / scale;
    panX = px - (px - panX) * ratio;
    panY = py - (py - panY) * ratio;
    scale = newScale;
    if (scale === 1) {
      panX = 0;
      panY = 0;
    }
    clampPan();
    applyTransform();
  }

  function applyTransform() {
    var transform =
      "translate3d(" + panX + "px," + panY + "px,0) scale(" + scale + ")";
    zoomEl.style.transform = transform;
    zoomEl.style.webkitTransform = transform;
  }

  window.resetZoom = function () {
    scale = 1;
    panX = 0;
    panY = 0;
    zoomEl.style.transform = "";
    zoomEl.style.webkitTransform = "";
  };
  window.getZoomScale = function () {
    return scale;
  };

  zoomEl.style.touchAction = "none";

  /* ---------------- TOUCH START ---------------- */
  zoomEl.addEventListener(
    "touchstart",
    function (e) {
      if (e.touches.length === 2) {
        isPinching = true;
        isPanning = false;
        initialDistance = getDistance(e.touches);
        e.preventDefault();
      } else if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        if (scale > 1) {
          startPanX = touchStartX - panX;
          startPanY = touchStartY - panY;
        }
      }
    },
    { passive: false },
  );

  /* ---------------- TOUCH MOVE ---------------- */
  zoomEl.addEventListener(
    "touchmove",
    function (e) {
      if (isPinching && e.touches.length === 2) {
        e.stopPropagation();
        if (e.cancelable) {
          e.preventDefault();
        }
        var d = getDistance(e.touches);
        var mid = getMidpoint(e.touches);
        var newScale = scale * (d / initialDistance);
        zoomToward(mid.x, mid.y, newScale);
        initialDistance = d;
        return;
      }

      if (scale > 1 && e.touches.length === 1) {
        var dx = e.touches[0].clientX - touchStartX;
        var dy = e.touches[0].clientY - touchStartY;
        if (Math.abs(dx) < Math.abs(dy)) {
          isPanning = true;
        }
        if (isPanning) {
          e.preventDefault();
          panX = e.touches[0].clientX - startPanX;
          panY = e.touches[0].clientY - startPanY;
          clampPan();
          applyTransform();
        }
      }
    },
    { passive: false },
  );

  /* ---------------- TOUCH END ---------------- */
  zoomEl.addEventListener("touchend", function (e) {
    if (e.touches.length < 2) {
      isPinching = false;
    }
    if (e.touches.length === 0) {
      isPanning = false;
      if (scale <= 1) {
        resetZoom();
      }
    }
  });

  /* ---------------- MOUSE WHEEL ZOOM (toward cursor) ---------------- */
  zoomEl.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault();
      var rect = containerEl.getBoundingClientRect();
      var px = e.clientX - rect.left;
      var py = e.clientY - rect.top;
      var delta = e.deltaY < 0 ? 0.15 : -0.15;
      zoomToward(px, py, scale + delta);
    },
    { passive: false },
  );

  /* ---------------- MOUSE DRAG PAN ---------------- */
  var mouseDown = false;
  var mouseStartX = 0;
  var mouseStartY = 0;
  zoomEl.addEventListener("mousedown", function (e) {
    if (scale <= 1) return;
    mouseDown = true;
    mouseStartX = e.pageX - panX;
    mouseStartY = e.pageY - panY;
    zoomEl.style.cursor = "grabbing";
  });
  document.addEventListener("mousemove", function (e) {
    if (!mouseDown) return;
    panX = e.pageX - mouseStartX;
    panY = e.pageY - mouseStartY;
    clampPan();
    applyTransform();
  });
  document.addEventListener("mouseup", function () {
    mouseDown = false;
    zoomEl.style.cursor = "";
  });
})();


/*--------------------- animation javascript -----------------------*/

function hit_pop1() {
	$('.hit_1').css("display","block");
	$('.hit_close1').css("display","block");
	$('.hit_pop1').css("display","none");
}

function hit_pop2() {
	$('.hit_2').css("display","block");
	$('.hit_close1').css("display","block");
	$('.hit_pop2').css("display","none");
}

function hit_pop3() {
	$('.hit_3').css("display","block");
	$('.hit_close1').css("display","block");
	$('.hit_pop3').css("display","none");
}

function hit_pop4() {
	$('.hit_4').css("display","block");
	$('.hit_close1').css("display","block");
	$('.hit_pop4').css("display","none");
}

function hit_pop5() {
	$('.hit_5').css("display","block");
	$('.hit_close1').css("display","block");
	$('.hit_pop5').css("display","none");
}

function hit_pop6() {
	$('.hit_6').css("display","block");
	$('.hit_close1').css("display","block");
	$('.hit_pop6').css("display","none");
}

function hit_pop7() {
	$('.hit_7').css("display","block");
	$('.hit_close1').css("display","block");
	$('.hit_pop7').css("display","none");
}

function hit_close1() {
	$('.hit_1').css("display","none");
	$('.hit_2').css("display","none");
	$('.hit_3').css("display","none");
	$('.hit_4').css("display","none");
	$('.hit_5').css("display","none");
	$('.hit_6').css("display","none");
	$('.hit_7').css("display","none");
	$('.hit_pop1').css("display","block");
	$('.hit_pop2').css("display","block");
	$('.hit_pop3').css("display","block");
	$('.hit_pop4').css("display","block");
	$('.hit_pop5').css("display","block");
	$('.hit_pop6').css("display","block");
	$('.hit_pop7').css("display","block");
	$('.hit_close1').css("display","none");
}

function tapIt() {
	$('.s2').css("display","none");
	$('.s3').css("display","block");
	document.getElementById("s3").play();
}