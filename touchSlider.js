let prev = document.querySelector('#prev');//Previous Button
let next = document.querySelector('#next');//Next Button
let slides = document.querySelectorAll('.slide');//List of slides
let container = document.querySelector('#container');
//right = right slide 
//left = left slide
//current = current slide
//sToRemove = slide whose visible property has to be removed
let right,left,current,sToRemove;

prev.addEventListener('click',moveLeft);
next.addEventListener('click',moveRight);

//Initialization Function
function initial(){
	current = 0;
	right = (current+1)%slides.length;
	left = (current-1+slides.length)%slides.length;
	console.log('Initialization :'+left+" "+current+" "+right);// 3 0 1
	slides[right].classList.add('translateR');
	slides[left].classList.add('translateL');
	slides[current].classList.add('visible');
}

initial();

function moveLeft(){

	/*Buttons has been made disabled so that user by making multiple clicks in small time can't 
	disrupt functionality of transition.*/
	prev.disabled=true;
	next.disabled=true;

	//shifting right slide to middle 
	slides[right].classList.remove('translateR');

	//shifting current slide to right
	slides[current].classList.add('translateR');

	//shifting left slide to current position. This will be shown to user
	slides[left].classList.add('visible');
	slides[left].classList.remove('translateL');

	//This slide is actually present at middle but hidden so shift it to left
	slides[(left-1+slides.length)%slides.length].classList.add('translateL');

	sToRemove = current;
	set();//After transition: enable buttons and make sToRemove slide invisible

	right = current;
	current = left;
	left = (left-1+slides.length)%slides.length;

	console.log('slides updated :'+left+" "+current+" "+right);
}

function moveRight(){
	prev.disabled=true;
	next.disabled=true;

	//shifting left slide to middle
	slides[left].classList.remove('translateL');

	//shifting current slide to left
	slides[current].classList.add('translateL');

	//shifting right slide to current position. This will be shown to user
	slides[right].classList.add('visible');
	slides[right].classList.remove('translateR');

	//This slide is actually present at middle but hidden so shift it to right
	slides[(right+1)%slides.length].classList.add('translateR');

	sToRemove = current;
	set();//After transition: enable buttons and make sToRemove slide invisible

	left = current;
	current = right;
	right = (right+1)%slides.length;
	console.log('slides updated :'+left+" "+current+" "+right);
}

function set(){
	setTimeout(function(){
		slides[sToRemove].classList.remove('visible');
		prev.disabled=false;
		next.disabled=false;
		console.log('removed');
	},301);
}



//Handling touch events-------------------------------------------------------
container.addEventListener('touchstart', start,{passive:true});
container.addEventListener('touchend', end, {passive:true});

let startX, startTime, elapsedTime, dist, allowedTime = 1000, swipeDist = 70;
/*
	startX - x-position where touch starts
	startTime - start time of touch
	dist - distance swiped
	allowedTime - upper bound of time ; time must not go beyond this
	swipeDist - distance that must be swiped
*/

function start(e){
	var touchObj = e.changedTouches[0];
    	dist = 0;
    	startX = touchObj.clientX;
    	startTime = new Date().getTime(); // record time when finger first makes contact with surface
}

function end(e){
	var touchObj = e.changedTouches[0];
	elapsedTime = new Date().getTime() - startTime; // get time elapsed
    	dist = touchObj.clientX - startX; // get total dist traveled by finger while in contact with surface
    	if(dist>=0){
 	   	var swiperight = (elapsedTime <= allowedTime && dist >= swipeDist);
	}
	else{
    		var swipeleft = (elapsedTime <= allowedTime && Math.abs(dist) >= swipeDist);
    	}
    if(swiperight){
	//removing event lisetenrs till function completes
	container.removeEventListener('touchstart', start,{passive:true});
	container.removeEventListener('touchend', end, {passive:true});
    	moveLeft();
	setTimeout(()=>{
    		container.addEventListener('touchstart', start,{passive:true});
		container.addEventListener('touchend', end, {passive:true});
    	},301)
    }
    else if(swipeleft){
	//removing event lisetenrs till function completes
	container.removeEventListener('touchstart', start,{passive:true});
	container.removeEventListener('touchend', end, {passive:true});
    	moveRight();
	setTimeout(()=>{
    		container.addEventListener('touchstart', start,{passive:true});
		container.addEventListener('touchend', end, {passive:true});
    	},301)
    }
}
