var arrSurveyQuestions = {
   3: "What is the estimated VTE risk in this case profile?",
   4: "Which except the following options is recommended by ACCP for thromboprophylaxis in acutely ill hospitalized patient?",
   6: "Should pharmacological thromboprophylaxis be continued in this critically ill patient?",
   7: "Which of the following options is recommended for pharmacological thromboprophylaxis in critically ill patient?"
};
/*Code by android developers start here*/
var startLoc = null;
//var contentName = '152';
//step 1:-
var contentName = parseInt(localStorage.getItem("currentbrand"));
var currentContentId  = parseInt(localStorage.getItem('currentcontent'));
//ends
var currentContentNSlide ='';

//custom slides changes begins here....

//console.log("+++++currentContentId+++++++"+currentContentId+"+++++++contentName+++++++"+contentName);
	if (typeof(localStorage.getItem("currentcustomslideflag"))!='undefined' &&  localStorage.getItem("currentcustomslideflag") =='true'){
		var custcomslideid1=parseInt(localStorage.getItem("currentcontentcustomslideId"));
		//step 2:

		currentContentNSlide = currentContentId+"_"+contentName+"_"+custcomslideid1;
		//step 2 ends here
		localStorage.setItem("current",currentContentNSlide);
		localStorage.setItem("currentslide",custcomslideid1);

	}else{
		//step 3 :
		currentContentNSlide = currentContentId+"_"+contentName+"_"+'1';
		//step 3 ends here
		localStorage.setItem("current",currentContentNSlide);
		localStorage.setItem("currentslide",'1');
	}
checkClickThrough();

document.getElementById("main_content").addEventListener("touchmove", touchHandler, false);
document.getElementById("main_content").addEventListener("touchstart", touchHandler, false);
function touchHandler(e) {

	if (e.type == "touchstart") {

			 if( e.touches.length == 1 ) { // one finger touch
			 	var touch = e.touches[ 0 ];
			 	startLoc = { x : touch.pageX, y : touch.pageY };
			 }

			} else if (e.type == "touchmove") {
				if( startLoc ) {
					var touch = e.touches[ 0 ];

					if( Math.abs( startLoc.x - touch.pageX ) > Math.abs( startLoc.y - touch.pageY ) )
					{
						e.preventDefault();
					}
					startLoc = null;
				}

			}
		}
		/*Code by android developers ends here*/
		$(document).ready(function(){

			var ua = navigator.userAgent;
	//var event = "touchstart";
	var event = (ua.match(/Ipad/i)) ? "touchstart" : "click";


	$(".left_arrow").click(function(event) {
		go_nav('b');
	});

	$(".right_arrow").click(function(event) {
		go_nav('f');
	});

	$(".slides").click(function(){
		var slideNum =	$(this).index()+1;
		console.log(slideNum);
		open_page("",slideNum);

	});

	$(".reference").removeClass("active");

	$('.reference').on('swipeleft swiperight', function(event) {
		event.stopPropagation();
	});

	$(".box_btn").bind("click",function(){
		$(".reference").toggleClass("active");
	});

	currentSlide();

		$("#main_content").swipe({
	   swipeLeft:function(event, direction, distance, duration, fingerCount) {
		  //step 4:-
		console.log("swipeleft"+localStorage.getItem("currentslide"));
		localStorage.setItem("previousslide",localStorage.getItem("currentslide"));
		//step 4 ends here
		
		//alert("swipeleft");
		//myconsole("swipeleft");
		var page_id =  parseInt($("#wrapper").attr("rel"));
		//alert("swipeleft"+page_id);
		var last_page_id = $(".slides").length;
		var slide_jumper_open = $(".reference").hasClass("active");
		if(page_id == last_page_id+1)	{
			return
		} else{
			go_nav('f');
		}
	  },

	  swipeRight:function(event, direction, distance, duration, fingerCount) {
		  //step 5:-
		console.log("swiperight"+localStorage.getItem("currentslide"));
		localStorage.setItem("previousslide",localStorage.getItem("currentslide"));
		//step 5 ends here 
		
			//alert("swiperight");
		//myconsole("swiperight");
		var page_id =  parseInt($("#wrapper").attr("rel"));
		var slide_jumper_open = $(".reference").hasClass("active");

		if(page_id == 0){
			//console.log("First Slide");
			//myconsole("First Slide");
			return
		} else {
			go_nav('b');
		}

	  } ,

        //Default is 75px, set to 0 for demo so any distance triggers swipe
         threshold:0
	});


});

//step 6:-
function toCaptureTime(page_id){
	var currentSlideNo = page_id;
	var startTime = Date.now();
	
	//alert("===currentSlideNo===="+currentSlideNo);
	//alert("===startTime===="+startTime);
	var temp = localStorage.getItem(currentContentId+"_"+contentName+"_slideNo_"+currentSlideNo);
	if(temp == null){
		if (currentSlideNo!=0){
			localStorage.setItem(currentContentId+"_"+contentName+"_slideNo_"+currentSlideNo ,startTime);
			var startTimeInDBFormat = currentTimeInDatabaseFormat();
			localStorage.setItem(currentContentId+"_"+contentName+"_StartTime_"+currentSlideNo ,startTimeInDBFormat);
		}
}
else{
	var existingTime = localStorage.getItem(currentContentId+"_"+contentName+"_slideNo_"+currentSlideNo);
	var newTime = Date.now();
	var newSlideTime = (newTime - existingTime);
	var endTimeInDBFormat = currentTimeInDatabaseFormat();
    var EndTimeNext = localStorage.getItem(currentContentId+"_"+contentName+"_EndTime_"+currentSlideNo);
		//alert("===newSlideTime===="+newSlideTime);
	//alert("===EndTimeNext===="+EndTimeNext);
    console.log("++++++++EndTimeNext++++++++"+EndTimeNext+"++++++currentContentId+++"+currentContentId+"_"+contentName+"_EndTime_"+currentSlideNo);
   
   if(EndTimeNext == null){
	localStorage.setItem(currentContentId+"_"+contentName+"_totalTime_slideNo_"+currentSlideNo ,(newSlideTime/1000) );
	localStorage.setItem(currentContentId+"_"+contentName+"_EndTime_"+currentSlideNo ,endTimeInDBFormat);
	}

    if (typeof(localStorage.getItem('currentslide'))!='undefined' && localStorage.getItem('currentslide')!='' && localStorage.getItem('currentslide')>= currentSlideNo){
	var nextSlideNo = currentSlideNo;

    }else{
	var nextSlideNo = currentSlideNo + 1 ;
	
 } 
 
	if(nextSlideNo <= 10){//number 3 is number of total slides present
	// alert(nextSlideNo);
	var tempNext = localStorage.getItem(currentContentId+"_"+contentName+"_slideNo_"+nextSlideNo);

		if(tempNext == null){
			
			if (nextSlideNo!=0)	{
				var nextSlideStartTime =  Date.now();
				localStorage.setItem(currentContentId+"_"+contentName+"_slideNo_"+nextSlideNo ,nextSlideStartTime);
				localStorage.setItem(currentContentId+"_"+contentName+"_totalTime_slideNo_"+nextSlideNo ,0);
				var startTimeNextInDBFormat = currentTimeInDatabaseFormat();
				localStorage.setItem(currentContentId+"_"+contentName+"_StartTime_"+nextSlideNo ,startTimeNextInDBFormat);
			}
		}
	}
}

}
//step ends..

function go_nav(direction) {
var page_id =  parseInt($("#wrapper").attr("rel"));
			
		
var flag=0;
if(direction == 'b') {


	if(page_id >= 0){
		page_id = page_id - 1;
		//alert(page_id);
		//console.log(page_id);
		if(page_id == 0){
            flag=2;
        }
	}
	 if(flag == 2){
        localStorage.setItem("gotoNextPrevBrand" ,2);//if one than next if 2 than prev
        //flag == 0;
		var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };

	//window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe //pageswipe
	
		//window.location = "js-call:" + "1" + ":" + encodeURIComponent(JSON.stringify({query:'NODATA', type:'brandNavigation', callback:'checkLastPgFn'}));
    }else{
        localStorage.setItem("gotoNextPrevBrand" ,0);
		var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };

	//window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe //pageswipe
	}
	
}else {
	
	if(page_id <= 10){
		page_id = page_id + 1;
		//alert(page_id);
		if(page_id == 11){
            flag=1;
        }
	}
	    if(flag == 1){
        localStorage.setItem("gotoNextPrevBrand" ,1);//if one than next if 2 than prev
         flag == 0;
		 var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };


	//window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe //pageswipe
		 //window.location = "js-call:" + "1" + ":" + encodeURIComponent(JSON.stringify({query:'NODATA', type:'brandNavigation', callback:'checkLastPgFn'}));
    }else{
        localStorage.setItem("gotoNextPrevBrand" ,0);
		var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };

	//window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe //pageswipe
  
    }


}



$("#wrapper").attr("rel",page_id);

var content="";
if(flag==0){
var pg_content = set_pg_content(page_id);

	$("#main_content").html(pg_content);
}
	//console.log("pg : "+page_id);
	if(page_id==4){
		/* $(".box2").click(function(event) {
			open_page("",5)
		});
		$(".box3").click(function(event) {
			open_page("",6)
		});
		$(".box4").click(function(event) {
	 		open_page("",7)
	 	});
		$(".box5").click(function(event) {
	 		open_page("",8)
	 	});
		$(".box6").click(function(event) {
	 		open_page("",9)
	 	});
		$(".box7").click(function(event) {
	 		open_page("",10)
	 	});
		$(".box8").click(function(event) {
	 		open_page("",11)
	 	}); */
		
	}
	 checkClickThrough(page_id);
}

function set_pg_content(pg_id){
$(".reference").removeClass("active");
currentSlide();
var selectedContentPath='';
switch(pg_id){
	case 1:
	content='<link rel="stylesheet" type="text/css" href="slide1/slide1.css" media="screen"/><div class="s1"><img src="slide1/s1.jpg" width="1080" height="810" alt=""/></div>';
	break;
	case 2:
	content='<link rel="stylesheet" type="text/css" href="slide2/slide2.css" media="screen"/><div class="s1"><img src="slide2/s1.jpg" width="1080" height="810" alt=""/></div>';
	break;
	case 3:
	content='<link rel="stylesheet" type="text/css" href="slide3/slide3.css" media="screen"/><div class="vid0"><video autoplay onplay="onPlay0()" onended="onEnded0()" id="vid0" width="1080" height="810"><source src="slide3/s0.mp4" type="video/mp4"></video></div><div class="vid1"><video onplay="onPlay1()" onended="onEnded1()" id="vid1" width="1080" height="810"><source src="slide3/s1.mp4" type="video/mp4"></video></div><div class="vid2"><video onended="onEnded2()" id="vid2" width="1080" height="810"><source src="slide3/s2.mp4" type="video/mp4"></video></div><div class="options"><img src="slide3/s3.png"/></div><div class="select1"><img src="slide3/s4.png"/></div><div class="select2"><img src="slide3/s5.png"/></div><div class="select3"><img src="slide3/s6.png"/></div>';
	break;
	case 4:
	content='<link rel="stylesheet" type="text/css" href="slide4/slide4.css" media="screen"/><div class="vid1"><video autoplay onplay="onPlay1()" onended="onEnded1()" id="vid1" width="1080" height="810"><source src="slide4/s1.mp4" type="video/mp4"></video></div><div class="vid2"><video onended="onEnded2()" id="vid2" width="1080" height="810"><source src="slide4/s2.mp4" type="video/mp4"></video></div><div class="options"><img src="slide4/s3.png"/></div><div class="select1"><img src="slide4/s4.png"/></div><div class="select2"><img src="slide4/s5.png"/></div><div class="select3"><img src="slide4/s6.png"/></div><div class="select4"><img src="slide4/s7.png"/></div>';
	break;
	case 5:
	content='<link rel="stylesheet" type="text/css" href="slide5/slide5.css" media="screen"/><div class="s1"><img src="slide5/s1.jpg" width="1080" height="810" alt=""/></div>';
	break;
	case 6:
	content='<link rel="stylesheet" type="text/css" href="slide6/slide6.css" media="screen"/><div class="vid1"><video autoplay onplay="onPlay1()" onended="onEnded1()" id="vid1" width="1080" height="810"><source src="slide6/s1.mp4" type="video/mp4"></video></div><div class="vid2"><video onended="onEnded2()" id="vid2" width="1080" height="810"><source src="slide6/s2.mp4" type="video/mp4"></video></div><div class="options"><img src="slide6/s3.png"/></div><div class="select1"><img src="slide6/s4.png"/></div><div class="select2"><img src="slide6/s5.png"/></div>';
	break;
	case 7:
	content='<link rel="stylesheet" type="text/css" href="slide7/slide7.css" media="screen"/><div class="vid1"><video autoplay onplay="onPlay1()" onended="onEnded1()" id="vid1" width="1080" height="810"><source src="slide7/s1.mp4" type="video/mp4"></video></div><div class="vid2"><video onended="onEnded2()" id="vid2" width="1080" height="810"><source src="slide7/s2.mp4" type="video/mp4"></video></div><div class="options"><img src="slide7/s3.png"/></div><div class="select1"><img src="slide7/s4.png"/></div><div class="select2"><img src="slide7/s5.png"/></div><div class="select3"><img src="slide7/s6.png"/></div><div class="select4"><img src="slide7/s7.png"/></div>';
	break;
	case 8:
	content='<link rel="stylesheet" type="text/css" href="slide8/slide8.css" media="screen"/><div class="s1"><img src="slide8/s1.jpg" width="1080" height="810" alt=""/></div>';
	break;
	case 9:
	content='<link rel="stylesheet" type="text/css" href="slide9/slide9.css" media="screen"/><div class="s1"><img src="slide9/s1.jpg" width="1080" height="810" alt=""/></div>';
	break;
	case 10:
	content='<link rel="stylesheet" type="text/css" href="slide10/slide10.css" media="screen"/><div class="s1"><img src="slide10/s1.jpg" width="1080" height="810" alt=""/></div>';
	break;
}

return content;

}

function showDiv() {
   document.getElementById('welcomeDiv').style.display = "block";
}
function showDiv2() {
   document.getElementById('welcomeDiv2').style.display = "block";
}

function open_page(url,page_id){
	count3=2;
    count4=0;
	if (typeof(localStorage.getItem("currentslide"))!='undefined'){
		//to checked previous slide has god end time...
		var slideid=localStorage.getItem("currentslide");
		toCaptureTime(slideid);	
	}

	// toCaptureTime(page_id);
	 localStorage.setItem("currentslide",page_id);
	 currentContentNSlide = currentContentId+"_"+contentName+"_"+page_id;
	 localStorage.setItem("current",currentContentNSlide);
	//step 10 ends here
	 $("#wrapper").attr("rel",page_id);
	 var content="";
	 var pg_content = set_pg_content(page_id);

	 	$("#main_content").html(pg_content);

	/*  if(page_id==4){
		$(".box2").click(function(event) {
			open_page("",5)
		});
		$(".box3").click(function(event) {
			open_page("",6)
		});
		$(".box4").click(function(event) {
	 		open_page("",7)
	 	});
		$(".box5").click(function(event) {
	 		open_page("",8)
	 	});
		$(".box6").click(function(event) {
	 		open_page("",9)
	 	});
		$(".box7").click(function(event) {
	 		open_page("",10)
	 	});
		$(".box8").click(function(event) {
	 		open_page("",11)
	 	});
	 } */
	  checkClickThrough();
	}
var count3=2,count4=0;

function open_page2(url,page_id,count){
    count1=0;
    count3=page_id+count-2;
    count4=page_id+1;
	 // alert(page_id);
	if (typeof(localStorage.getItem("currentslide"))!='undefined'){
		var slideid=localStorage.getItem("currentslide");
		toCaptureTime(slideid);
	}
    count2=page_id;
    count1=page_id+count-1;

	localStorage.setItem("currentslide",page_id);
	currentContentNSlide = currentContentId+"_"+contentName+"_"+page_id;
	localStorage.setItem("current",currentContentNSlide);

	$("#wrapper").attr("rel",page_id);
	var content="";
	var pg_content = set_pg_content(page_id);
	$("#main_content").html(pg_content);
	checkClickThrough();
}

	function checkClickThrough(page_id){
	var currentslide=localStorage.getItem("currentslide");
	//alert(currentslide);
	document.getElementById("click_through").innerHTML='';
	
	if(page_id == 3){
		document.getElementById("click_through").innerHTML='<div class="blocker"></div><div class="vidPlay" onclick="vidPlay()"></div><div class="slide02_inline_wraper" id="buttons">\
		<div id="slide01_question01_choices01" class="control-group">\
			<label class="control control_radio"><div class="lbl_pos"></div><input type="radio" id="slide01_radio01_01" name="checkB01" value="Very Low Risk"/><div class="control_indicator" id="radio01" onclick="select1()"></div></label>\
			<label class="control control_radio"><div class="lbl_pos"></div><input type="radio" id="slide01_radio01_02" name="checkB01" value="Low Risk"/><div class="control_indicator" id="radio02" onclick="select2()"></div></label>\
			<label class="control control_radio"><div class="lbl_pos"></div><input type="radio" id="slide01_radio01_03" name="checkB01" value="High Risk"/><div class="control_indicator" id="radio03" onclick="select3();s3opt3()"></div></label>\
		</div>\
			<div class="submit_button" onclick="savedata(1,1,3,\'' + page_id + '\');endTime1(3);hidesubmitonclick();"></div>\
		</div>';
		
		$('#slide01_question01_choices01').delay(10).fadeIn();

		$(document).on("click touchstart", "#slide01_question01_choices01 input[name]", function(){
			if ($("input[name='checkB01']:checked").val()){
				var test = $(this).val();	
			}			
		});

		$(document).on("click", ".submit_button", function(){
			$('.slide01_submit_popup_content').fadeIn();
		});

		$(document).on("click", ".slide01_submit_popup_close_btn_mask", function(){
			$('.slide01_submit_popup_content').fadeOut();
		});
	}
	
	
	if(page_id == 4){
		document.getElementById("click_through").innerHTML='<div class="blocker"></div><div class="slide02_inline_wraper" id="buttons">\
		<div id="slide01_question01_choices01" class="control-group">\
			<label class="control control_radio"><div class="lbl_pos"></div><input type="radio" id="slide01_radio01_01" name="checkB01" value="Low Molecular Weight Heparin (LMWH)"/><div class="control_indicator" id="radio01" onclick="select1();s4opt1()"></div></label>\
			<label class="control control_radio"><div class="lbl_pos"></div><input type="radio" id="slide01_radio01_02" name="checkB01" value="Unfractionated Heparin (UFH)"/><div class="control_indicator" id="radio02" onclick="select2()"></div></label>\
			<label class="control control_radio"><div class="lbl_pos"></div><input type="radio" id="slide01_radio01_03" name="checkB01" value="Fondaparinux"/><div class="control_indicator" id="radio03" onclick="select3()"></div></label>\
			<label class="control control_radio"><div class="lbl_pos"></div><input type="radio" id="slide01_radio01_04" name="checkB01" value="Direct Acting Oral Anticoagulant (DOAC)"/><div class="control_indicator" id="radio04" onclick="select4()"></div></label>\
		</div>\
			<div class="submit_button" onclick="savedata(1,1,4,\'' + page_id + '\');endTime1(4);hidesubmitonclick();"></div>\
		</div>';
		
		$('#slide01_question01_choices01').delay(10).fadeIn();

		$(document).on("click touchstart", "#slide01_question01_choices01 input[name]", function(){
			if ($("input[name='checkB01']:checked").val()){
				var test = $(this).val();	
			}			
		});

		$(document).on("click", ".submit_button", function(){
			$('.slide01_submit_popup_content').fadeIn();
		});

		$(document).on("click", ".slide01_submit_popup_close_btn_mask", function(){
			$('.slide01_submit_popup_content').fadeOut();
		});
	}
	
	
	if(page_id == 6){
		document.getElementById("click_through").innerHTML='<div class="blocker"></div><div class="slide02_inline_wraper" id="buttons">\
		<div id="slide01_question01_choices01" class="control-group">\
			<label class="control control_radio"><div class="lbl_pos"></div><input type="radio" id="slide01_radio01_01" name="checkB01" value="Yes"/><div class="control_indicator" id="radio01" onclick="select1();s6opt1()"></div></label>\
			<label class="control control_radio"><div class="lbl_pos"></div><input type="radio" id="slide01_radio01_02" name="checkB01" value="No"/><div class="control_indicator" id="radio02" onclick="select2()"></div></label>\
		</div>\
			<div class="submit_button" onclick="savedata(1,1,6,\'' + page_id + '\');endTime1(6);hidesubmitonclick();"></div>\
		</div>';
		
		$('#slide01_question01_choices01').delay(10).fadeIn();

		$(document).on("click touchstart", "#slide01_question01_choices01 input[name]", function(){
			if ($("input[name='checkB01']:checked").val()){
				var test = $(this).val();	
			}			
		});

		$(document).on("click", ".submit_button", function(){
			$('.slide01_submit_popup_content').fadeIn();
		});

		$(document).on("click", ".slide01_submit_popup_close_btn_mask", function(){
			$('.slide01_submit_popup_content').fadeOut();
		});
	}
	
	
	if(page_id == 7){
		document.getElementById("click_through").innerHTML='<div class="blocker"></div><div class="slide02_inline_wraper" id="buttons">\
		<div id="slide01_question01_choices01" class="control-group">\
			<label class="control control_radio"><div class="lbl_pos"></div><input type="radio" id="slide01_radio01_01" name="checkB01" value="Low Molecular Weight Heparin (LMWH)"/><div class="control_indicator" id="radio01" onclick="select1()"></div></label>\
			<label class="control control_radio"><div class="lbl_pos"></div><input type="radio" id="slide01_radio01_02" name="checkB01" value="Unfractionated Heparin (UFH)"/><div class="control_indicator" id="radio02" onclick="select2()"></div></label>\
			<label class="control control_radio"><div class="lbl_pos"></div><input type="radio" id="slide01_radio01_03" name="checkB01" value="Low dose unfractionated heparin (LDUH)"/><div class="control_indicator" id="radio03" onclick="select3()"></div></label>\
			<label class="control control_radio"><div class="lbl_pos"></div><input type="radio" id="slide01_radio01_04" name="checkB01" value="All of the above"/><div class="control_indicator" id="radio04" onclick="select4();s7opt4()"></div></label>\
		</div>\
			<div class="submit_button" onclick="savedata(1,1,7,\'' + page_id + '\');endTime1(7);hidesubmitonclick();"></div>\
		</div>';
		
		$('#slide01_question01_choices01').delay(10).fadeIn();

		$(document).on("click touchstart", "#slide01_question01_choices01 input[name]", function(){
			if ($("input[name='checkB01']:checked").val()){
				var test = $(this).val();	
			}			
		});

		$(document).on("click", ".submit_button", function(){
			$('.slide01_submit_popup_content').fadeIn();
		});

		$(document).on("click", ".slide01_submit_popup_close_btn_mask", function(){
			$('.slide01_submit_popup_content').fadeOut();
		});
	}
	

}

	function checkBtns(refNum){
		switch(refNum){
		case 1:
		open_page('',1); //NA
		break;
		
		}
	}

	function currentSlide(){
		var curr_id =  parseInt($("#wrapper").attr("rel"));
		$(".slides").removeClass("active");
		$(".slides:nth-child("+curr_id+")").addClass("active");
	}

	var ln = 0;
	function myconsole(msg){

		var oldMsg = "</br>"+ln+". "+$("#myconsole").html();
		ln++
		$("#myconsole").html(msg+oldMsg);
	}

function currentTimeInDatabaseFormat(){//to get current time in dd-mm-yyyy hh:mm:ss
	var year = new Date().getFullYear();
	var month = new Date().getMonth();
		month = parseInt(month)+1;
	if(month.toString().length==1){
		month="0"+month;
	}

	var date = new Date().getDate();
	if(date.toString().length==1){
		date="0"+date;
	}

	var hour = new Date().getHours();
	if(hour.toString().length==1){
		hour="0"+hour;
	}

	var minutes = new Date().getMinutes();
	if(minutes.toString().length==1){
		minutes="0"+minutes;
	}

	var seconds = new Date().getSeconds();
	if(seconds.toString().length==1){
		seconds="0"+seconds;
	}

	var duration= year+"-"+month+"-"+date+"-"+hour + ":" + minutes + ":" + seconds;
	return duration;
}

// new js

$(document).ready(function(){
	$('body').on('click','.touchbtn',function(){
		$('.right_arrow').trigger( "click" );
	})

	$(document).on('click','.btnshow',function(){
//alert('hi')
		$('.touchbtn').css("display","block");
	})
})


/*--------------------- animation javascript -----------------------*/


function closewindowslide(currentslide)
{
	toCaptureTime(currentslide);
}
function endTime1(currentSlideNo){
		var existingTime = localStorage.getItem(currentContentId+"_"+contentName+"_slideNo_"+currentSlideNo);
		var newTime = Date.now();
		var newSlideTime = (newTime - existingTime);
		localStorage.setItem(currentContentId+"_"+contentName+"_totalTime_slideNo_"+currentSlideNo ,(newSlideTime/1000) );
		var endTimeInDBFormat = currentTimeInDatabaseFormat();
		localStorage.setItem(currentContentId+"_"+contentName+"_EndTime_"+currentSlideNo ,endTimeInDBFormat);

}

function hidesubmitonclick()
{
	$('.submit_button').css("display","none");
	$('#radio01').css("display","none");
	$('#radio02').css("display","none");
	$('#radio03').css("display","none");
	$('#radio04').css("display","none");
	goRight();
}

function goRight() {
	go_nav('f');
}

function savedata(answer,type,questionNumber,page_id) {	
	
	if(questionNumber == 3){
		var selectedAnswer1 = document.querySelector('input[name = "checkB01"]:checked').value;
		var varanswer = selectedAnswer1;
	}
	
	else if(questionNumber == 4){
		var selectedAnswer1 = document.querySelector('input[name = "checkB01"]:checked').value;
		var varanswer = selectedAnswer1;
	}
	
	else if(questionNumber == 6){
		var selectedAnswer1 = document.querySelector('input[name = "checkB01"]:checked').value;
		var varanswer = selectedAnswer1;
	}
	
	else if(questionNumber == 7){
		var selectedAnswer1 = document.querySelector('input[name = "checkB01"]:checked').value;
		var varanswer = selectedAnswer1;
	}
	
	var question = arrSurveyQuestions[questionNumber];
	//localStorage.setItem("surveyQuestion_"+currentContentId+"_"+contentName+"_"+questionNumber,question);
	//localStorage.setItem("surveyAnswer_"+currentContentId+"_"+contentName+"_"+questionNumber,varanswer);
	//alert(question+varanswer);
	
	
	var surveydata={
		"question": question,
        "answer": varanswer
    };
	
	var objectData={
		"gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id,
		 "data": `${JSON.stringify(surveydata)}`
         };
	  var params = {
	  "query" : objectData,
	  "type" : "additionalInfo",
	  "callback" : "checkLastPgFn"
	  };

	//window.messageHandler.postMessage(JSON.stringify(params));
}

function onEnded0() {
	$('.vidPlay').css("display","block");
}

function vidPlay() {
	$('.vidPlay').css("display","none");
	$(".vid1").css("display","block");
	document.getElementById("vid1").play();
}

function onPlay1() {
	setTimeout(function(){
		$('.options').css("display","block");
	}, 2500);
}

function onEnded1() {
	$('#radio01').css("display","block");
	$('#radio02').css("display","block");
	$('#radio03').css("display","block");
	$('#radio04').css("display","block");
}

function onEnded2() {
	$('.submit_button').css("display","block");
}

function select1() {
	$('.select1').css("display","block");
	$('.select2').css("display","none");
	$('.select3').css("display","none");
	$('.select4').css("display","none");
}

function select2() {
	$('.select1').css("display","none");
	$('.select2').css("display","block");
	$('.select3').css("display","none");
	$('.select4').css("display","none");
}

function select3() {
	$('.select1').css("display","none");
	$('.select2').css("display","none");
	$('.select3').css("display","block");
	$('.select4').css("display","none");
}

function select4() {
	$('.select1').css("display","none");
	$('.select2').css("display","none");
	$('.select3').css("display","none");
	$('.select4').css("display","block");
}

function s3opt3() {
	$(".vid2").css("display","block");
	document.getElementById("vid2").play();
}

function s4opt1() {
	$(".vid2").css("display","block");
	document.getElementById("vid2").play();
}

function s6opt1() {
	$(".vid2").css("display","block");
	document.getElementById("vid2").play();
}

function s7opt4() {
	$(".vid2").css("display","block");
	document.getElementById("vid2").play();
}