window.addEventListener("load", () => {
    initSite();
});

function runLater(fn){
    if("requestIdleCallback" in window){
        requestIdleCallback(fn);
    } else {
        setTimeout(fn,300);
    }
}

function initSite(){
    initTheme();
    initNav();

    // Delay non-critical stuff
    runLater(initReveal);
    runLater(initTypewriter);
    runLater(initScrollbar);
    runLater(initVideo);
    initLoader();
}
function initTheme(){
    const html = document.documentElement;
    requestAnimationFrame(()=>{
        const savedTheme = localStorage.getItem("theme") || "light";
        html.setAttribute("data-theme", savedTheme);
    });

    const toggle = document.getElementById("darkModeToggle");
    if(!toggle) return;

    toggle.addEventListener("click",()=>{
        const current = html.getAttribute("data-theme");
        const next = current==="dark"?"light":"dark";
        html.setAttribute("data-theme",next);
        localStorage.setItem("theme",next);
    });
}
function initNav(){
    const navToggle = document.getElementById("navToggle");
    const nav = document.querySelector("header nav");
    if(!navToggle || !nav) return;

    const body = document.body;

    const overlay=document.createElement("div");
    overlay.className="nav-overlay";
    document.body.appendChild(overlay);

    function toggleNav(){
        navToggle.classList.toggle("active");
        nav.classList.toggle("active");
        overlay.classList.toggle("active");
        body.classList.toggle("nav-open");
    }

    function closeNav(){
        navToggle.classList.remove("active");
        nav.classList.remove("active");
        overlay.classList.remove("active");
        body.classList.remove("nav-open");
    }

    navToggle.addEventListener("click",toggleNav);
    overlay.addEventListener("click",closeNav);

    document.querySelectorAll(".nav-link a").forEach(link=>{
        link.addEventListener("click",closeNav);
    });

    document.addEventListener("keydown",(e)=>{
        if(e.key==="Escape" && nav.classList.contains("active")) closeNav();
    });

    let resizeTimer;
    window.addEventListener("resize",()=>{
        clearTimeout(resizeTimer);
        resizeTimer=setTimeout(()=>{
            if(window.innerWidth>=768) closeNav();
        },250);
    });
}
function initLoader(){
    const loader=document.querySelector("#loader");
    if(!loader) return;

    loader.classList.add("loader-hidden");
    document.body.classList.add("loaded");
    loader.addEventListener("transitionend",()=>loader.remove());
}
function initReveal(){
    const elements=document.querySelectorAll(".reveal");
    if(!elements.length) return;

    const observer=new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    },{threshold:.15});

    elements.forEach(el=>observer.observe(el));
}

function initTypewriter(){
    const el=document.getElementById("typewriter");
    if(!el) return;

    const words=JSON.parse(el.getAttribute("data-words"));
    let wordIndex=0,charIndex=0,isDeleting=false,isPaused=true;

    function type(){
        if(isPaused) return;
        const word=words[wordIndex];

        if(isDeleting){
            el.textContent=word.substring(0,charIndex-1);
            charIndex--;
        }else{
            el.textContent=word.substring(0,charIndex+1);
            charIndex++;
        }

        let speed=isDeleting?50:150;

        if(!isDeleting && charIndex===word.length){
            isDeleting=true;
            speed=2000;
        }else if(isDeleting && charIndex===0){
            isDeleting=false;
            wordIndex=(wordIndex+1)%words.length;
            speed=250;
        }

        setTimeout(type,speed);
    }

    document.addEventListener("visibilitychange",()=>{
        if(document.hidden){
            isPaused=true;
        }else{
            isPaused=false;
            type();
        }
    });

    const observer=new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                isPaused=false;
                type();
            }else{
                isPaused=true;
            }
        });
    },{threshold:.1});

    observer.observe(el);
}
function initScrollbar(){
    const scrollbar=document.getElementById("custom-scrollbar");
    if(!scrollbar) return;

    const header=document.querySelector("header");
    const footer=document.querySelector("footer");

    let scrollTimeout;
    let ticking=false;

    const update=()=>{
        const vh=window.innerHeight;
        const total=document.documentElement.scrollHeight;
        const scrollY=window.scrollY;
        const headerH=header?header.offsetHeight:0;

        const rect=footer?footer.getBoundingClientRect():null;
        const footerVis=(rect && rect.top<vh)?vh-rect.top:0;

        const track=vh-headerH-footerVis;
        const ratio=vh/total;
        const handle=Math.max(track*ratio,40);

        const max=total-vh;
        const percent=max>0?Math.min(scrollY/max,1):0;
        const travel=track-handle;
        const pos=percent*travel;

        scrollbar.style.top=`${headerH}px`;
        scrollbar.style.height=`${handle}px`;
        scrollbar.style.transform=`translate3d(0,${pos}px,0)`;

        scrollbar.classList.add("visible");
        clearTimeout(scrollTimeout);
        scrollTimeout=setTimeout(()=>{
            scrollbar.classList.remove("visible");
        },1200);

        ticking=false;
    };

    const tick=()=>{
        if(!ticking){
            requestAnimationFrame(update);
            ticking=true;
        }
    };

    window.addEventListener("scroll",tick,{passive:true});
    window.addEventListener("resize",tick);
    tick();
}
function initVideo(){
    const video=document.getElementById("bg-video");
    if(!video) return;

    const saveData=navigator.connection && navigator.connection.saveData;
    const isMobile=window.innerWidth<768;

    if(!isMobile && !saveData){
        video.innerHTML=`<source src="./video/web-bg-video.mp4" type="video/mp4">`;
        video.load();
    }
}
