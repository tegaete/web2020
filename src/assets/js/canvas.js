color = "black";

window.addEventListener("load", ()=> {
   
    const canvas = document.querySelector("#gameCanvas");
    console.log("hello this is canvas.js");
    const ctx = canvas.getContext('2d');
    canvas.style.width ='100%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;


    //This should go on resize event:
    var rect = canvas.getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);
    //canvas.width  = parent.innerWidth;
    //canvas.height = parent.innerHeight;

    //variables
    let painting = false;

    function startPosition(e){
        painting = true;
        draw(e);
        console.log("start painting");
    }

    function finishedPosition(){
        painting = false;
        ctx.beginPath();
        
        console.log("finish painting");
    }

    function draw(e){
        if (!painting) return;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY -rect.top);
        //console.log("draw");
        
       // console.log("draw" + "  e.X=" + e.clientX + "  e.Y=" + e.clientY);

    }
    //EventListeners
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);

    function colorchange(){

    }



//color functions
    whiteblock = document.querySelector("#white");
    whiteblock.addEventListener("mousedown", whiteColor);
    function whiteColor(){
        color = "white";
    }
    document.querySelector("#black").addEventListener("mousedown", function(){color = "black";});
    document.querySelector("#blue").addEventListener("mousedown", function(){color = "blue";});
    document.querySelector("#red").addEventListener("mousedown", function(){color = "red";});
    document.querySelector("#darkgrey").addEventListener("mousedown", function(){color = "grey";});
    document.querySelector("#yellow").addEventListener("mousedown", function(){color = "yellow";});
    document.querySelector("#orange").addEventListener("mousedown", function(){color = "orange";});
    document.querySelector("#green").addEventListener("mousedown", function(){color = "green";});
    document.querySelector("#purple").addEventListener("mousedown", function(){color = "purple";});
    document.querySelector("#pink").addEventListener("mousedown", function(){color = "pink";});
    document.querySelector("#darkbrown").addEventListener("mousedown", function(){color = "#613613";});
    document.querySelector("#brown").addEventListener("mousedown", function(){color = "#7e481c";});
    
    
    
    document.querySelector("#clearCanvas").addEventListener("mousedown", function(){ctx.clearRect(0, 0, canvas.width, canvas.height);});
   
});


