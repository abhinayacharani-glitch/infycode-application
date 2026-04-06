import React, { useState, useEffect, useRef } from "react";
import "./Testimonals.css";

function Testimonals(){

const original = [
{
name:"Akash",
role:"Student",
img:"https://randomuser.me/api/portraits/men/32.jpg",
text:"There is nothing more important than continuous learning and improving your skills."
},
{
name:"Jeevan",
role:"Student",
img:"https://randomuser.me/api/portraits/men/44.jpg",
text:"Learning new skills consistently helps build a strong and successful career."
},
{
name:"Srinivas",
role:"Student",
img:"https://randomuser.me/api/portraits/men/46.jpg",
text:"With the right guidance and practice, anyone can achieve their goals."
},
{
name:"Chandra",
role:"Student",
img:"https://randomuser.me/api/portraits/men/55.jpg",
text:"A great learning experience with practical knowledge and expert support."
}
];

/* duplicate cards for seamless loop */
const testimonials=[...original,...original,...original];

const [index,setIndex]=useState(original.length);
const trackRef=useRef(null);


/* AUTO SCROLL */
useEffect(()=>{

const interval=setInterval(()=>{
setIndex(prev=>prev+1);
},2000);

return()=>clearInterval(interval);

},[]);


/* HANDLE INVISIBLE RESET */
useEffect(()=>{

const track=trackRef.current;

if(index>=original.length*2){
setTimeout(()=>{
track.style.transition="none";
setIndex(original.length);
},600);
}

track.style.transition="transform 0.6s ease";

},[index,original.length]);


/* ARROWS */

const next=()=>{
setIndex(prev=>prev+1);
};

const prev=()=>{
setIndex(prev=>prev-1);
};


return(

<section id="testimonials" className="testimonials">

<h2>Testimonials</h2>

<div className="testimonial-wrapper">

<button className="arrow left" onClick={prev}>❮</button>

<div
ref={trackRef}
className="testimonial-track"
style={{transform:`translateX(-${index*33.33}%)`}}
>

{testimonials.map((t,i)=>{

let cls="testimonial-card dim";

if(i===index){
cls="testimonial-card active";
}

return(

<div className={cls} key={i}>

<div className="student-info">

<img src={t.img} alt="student"/>

<div>
<h3>{t.name}</h3>
<p className="role">{t.role}</p>
</div>

</div>

<p className="text">{t.text}</p>

<div className="stars">★★★★★</div>

</div>

);

})}

</div>

<button className="arrow right" onClick={next}>❯</button>

</div>

</section>

);

}

export default Testimonals;