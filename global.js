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
    if (page_id <= 1) {
      page_id = page_id + 1;
      //alert(page_id);
      if (page_id == 2) {
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
	content='<link rel="stylesheet" type="text/css" href="slide1/slide1.css" media="screen"/><div class="video0"><video preload="auto" autoplay poster="slide1/Poster.png" onplay="onPlay0()" onended="onEnded0()" id="video0" width="1080" height="810"><source src="slide1/Part0.mp4" type="video/mp4"></video></div><div class="video1"><video preload="auto" loop onplay="onPlay1()" onended="onEnded1()" id="video1" width="1080" height="810"><source src="slide1/Part1.mp4" type="video/mp4"></video></div><div class="flash1"><img src="slide1/flash1.png"></div><div class="video2"><video preload="auto" onplay="onPlay2()" onended="onEnded2()" id="video2" width="1080" height="810"><source src="slide1/Part2.mp4" type="video/mp4"></video></div><div class="flash2"><img src="slide1/flash2.png"></div><div class="video3"><video preload="auto" onended="onEnded3()" id="video3" width="1080" height="810"><source src="slide1/Part3.mp4" type="video/mp4"></video></div><div class="video4"><video preload="auto" onended="onEnded4()" id="video4" width="1080" height="810"><source src="slide1/Part4.mp4" type="video/mp4"></video></div><div class="button1" onclick="playVid1()"></div><div class="button2" onclick="playVid2()"></div><div class="button3" onclick="playVid3()"></div><div class="pat1"><img src="slide1/pat1.png"></div><div class="pat2"><img src="slide1/pat2.png"></div><div class="pat3"><img src="slide1/pat3.png"></div><div class="pat4"><img src="slide1/pat4.png"></div><div class="pat5"><img src="slide1/pat5.png"></div><div class="pat6"><img src="slide1/pat6.png"></div><div class="pat7"><img src="slide1/pat7.png"></div><div class="pat8"><img src="slide1/pat8.png"></div><div class="pat9"><img src="slide1/pat9.png"></div><div class="pat10"><img src="slide1/pat10.png"></div><div class="pat11"><img src="slide1/pat11.png"></div><div class="pat12"><img src="slide1/pat12.png"></div><div class="pat13"><img src="slide1/pat13.png"></div><div class="button4" onclick="playMet()"></div><div class="met1"><img src="slide1/met1.png"></div><div class="met2"><img src="slide1/met2.png"></div><div class="met3"><img src="slide1/met3.png"></div><div class="button5" onclick="playVid4()"></div>';
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

/*--------------------------Javascript Animation-----------------------------*/

function onPlay0() {
	$('.button1').css("display","none");
	setTimeout(function(){ 
		$('.flash1').css("display","block");
		$('.button2').css("display","block");
	}, 7000);
	document.getElementById("video0").play();
}

function playVid1() {
	$('.button1').css("display","none");
	setTimeout(function(){ 
		$('.flash1').css("display","block");
		$('.button2').css("display","block");
	}, 7000);
	document.getElementById("video0").play();
}

function onEnded0() {
	$(".video0").css("display","none");
	var vid = document.getElementById("video0");
	vid.pause();
	vid.currentTime = 0;
	$(".video1").css("display","block");
	document.getElementById("video1").play();
}

function playVid2() {
	$('.button1').css("display","none");
	$('.button2').css("display","none");
	$('.flash1').css("display","none");
	$(".video1").css("display","none");
	
	var vid0 = document.getElementById("video0");
	vid0.pause();
	vid0.currentTime = 0;
	
	var vid1 = document.getElementById("video1");
	vid1.pause();
	vid1.currentTime = 0;
	
	$(".video2").css("display","block");
	document.getElementById("video2").play();
}

function onPlay2() {
	setTimeout(function(){
		$('.button3').css("display","block");
		$('.flash2').css("display","none");
	}, 25000);
}

function playVid3() {
	$('.button1').css("display","none");
	$('.button2').css("display","none");
	$('.button3').css("display","none");
	$('.flash').css("display","none");
	$(".video2").css("display","none");
	var vid = document.getElementById("video2");
	vid.pause();
	vid.currentTime = 0;
	$(".video3").css("display","block");
	document.getElementById("video3").play();
}

function onEnded3() {
	$('.pat1, .pat2, .pat3, .pat4, .pat5, .pat6, .pat7, .pat8, .pat9, .pat10, .pat11, .pat12, .pat13').css("display","block");
	setTimeout(function(){ 
		$('.button4').css("display","block");
	}, 6000);
}

function playMet() {
	$('.button4').css("display","none");
	$('.button5').css("display","block");
	$('.met1, .met2, .met3').css("display","block");
}

function playVid4() {
	$('.button5').css("display","none");
	$(".video3").css("display","none");
	var vid = document.getElementById("video3");
	vid.pause();
	vid.currentTime = 0;
	$(".video4").css("display","block");
	document.getElementById("video4").play();
}