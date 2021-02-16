function shine() {

    setInterval(() => {
        if (document.querySelector("#SpecialLink").className == "nav-link text-danger") { document.querySelector("#SpecialLink").className = "nav-link" }
        else { document.querySelector("#SpecialLink").className = "nav-link text-danger" }
    }, 1000);
}
function Newhobby() {
    hobby = prompt("Add a new hobby");
    //console.log(hobby);
    //If nothing is entered, hobby is "" instead of null
    if (hobby == "") {
        return;
    }
    let li = document.createElement("li");
    let node = document.createTextNode(hobby);
    li.appendChild(node);

    let last = document.querySelector("#Hobbies ul").lastChild;
    document.querySelector("#Hobbies ul").insertBefore(li, last);

}
function toggle(ele) {
    dis = document.querySelector(ele).style.display;
    //console.log(dis);
    if (dis == "") {
        document.querySelector(ele).style.display = "none";
    }
    else {
        document.querySelector(ele).style.display = "";
    }
}
function Scroll() {

    //get the current height and round it up
    current = Math.ceil(window.scrollY);
    height = document.body.clientHeight;
    //height=window.innerHeight;
    progress = (current / height) * 100;
    //console.log(progress);
    if (current + window.innerHeight >= height) {
        //alert("bottom reached");
        document.querySelector(".progress-bar").innerHTML = "100%";
        document.querySelector(".progress-bar").attributes[2] = 100;
        document.querySelector(".progress-bar").style = "width: 100%";
    }
    else {
        // change the progress bar
        //document.querySelector("#test").innerHTML=progress;
        document.querySelector(".progress-bar").innerHTML = Math.round(progress) + "%";
        //aria-valuenow
        document.querySelector(".progress-bar").attributes[2] = Math.round(progress);
        //style (length of bar)
        document.querySelector(".progress-bar").style = "width: " + Math.round(progress) + "%"
    }

}


function Align() {

    //get current text-align
    let align = document.querySelector("section h2").style.textAlign;
    //decide change to which text-align 
    if (align == "" || align == "left") {
        align = "center";
    }
    else if (align == "center") {
        align = "right";
    }
    else if (align == "right") {
        align = "left";
    }
    //change text-align 
    let sections = document.querySelectorAll("section h2");
    for (i of sections) {
        i.style.textAlign = align;

    }
}

function validate() {
    let pass = true;
    email = document.querySelector("#new-email").validity.valid;
    comment = document.querySelector("#new-comment").validity.valid;
    //console.log(email,comment);
    if (!email) {
        document.querySelector("#new-email").classList.add("is-invalid");
        pass = false;
    }
    else {
        document.querySelector("#new-email").classList.remove("is-invalid");
    }
    if (!comment) {
        document.querySelector("#new-comment").classList.add("is-invalid");
        pass = false;
    }
    else {
        document.querySelector("#new-comment").classList.remove("is-invalid");
    }
    return pass;
}

function processform() {

    // form validation
    if (!validate()) {
        //alert("invalid");
        return false;
    }

    // get form inputs
    let email = document.querySelector("#new-email").value;
    let text = document.querySelector("#new-comment").value;
    if (email == "") {
        alert("Please type your email");
        return;
    }
    if (text == "") {
        alert("Please type your comments");
        return;
    }


    //default color is black
    let color = "black";
    for (i of document.querySelectorAll(".form-check")) {
        if (i.querySelector("input").checked) {
            color = i.querySelector("input").value;
            break;
        }
    }

    addComment(email, text, color);

    // add and save bonus information
    ipAndLocation();

    document.querySelector("form").reset();
    saveComment(email, text, color);
}

function loadComments() {

    let step1 = fetch("Comments.txt").then(response => response.text(), () => console.log("fail to fetch"));
    step1.then(str => { if (str != "") { return JSON.parse(str) } }).then(obj => { for (i in obj) { addComment(obj[i].email, obj[i].comments, obj[i].color); } });

}

function loadBonus() {

    function addBonus(ip, location, date, broswer, device, key) {
        //console.log("masked");
        // Unlike addComment(), data is add to existing element, not creating a new one
        let number = Number(key.substr(7));
        let id = "c" + String(1001 + number);
        //console.log(id);

        let p = document.createElement("p");
        p.className = "bonus_information";
        p.innerHTML = "IP: " + ip + "<br>Location: " + location + " Date: " + date + "<br>Broswer (Rendering Engine): " + broswer + " " + device + " ";
        document.querySelectorAll("#" + id + " div")[1].append(p);

    }

    let step1 = fetch("Bonus.txt").then(response => response.text(), () => console.log("fail to fetch"));
    step1.then(str => { if (str != "") { return JSON.parse(str) } }).then(obj => { for (i in obj) { addBonus(obj[i].IP, obj[i].Location, obj[i].Date, obj[i].Browser, obj[i].Device, i) } });

}

function saveComment(email, text, color) {

    // string to be added
    function newData(counter, email, text, color) {

        // Data object to be added
        let key = '"Comment' + String(counter + 1) + '"';
        let newComment = { "email": email, "comments": text, "color": color };

        if (counter == 0) {
            return "{ " + key + ":" + JSON.stringify(newComment) + " }";
        }
        else if (counter > 0) {
            return "\n, " + key + ":" + JSON.stringify(newComment) + " }";
        }
    }


    let step1 = fetch("Comments.txt").then(response => response.text(), () => console.log("fail to fetch"));
    step1.then(str => {
        let obj = "";
        if (str != "") {
            obj = JSON.parse(str);
        }
        // Get the number of comments in the file
        let counter = 0;
        for (i in obj) {
            counter++;
        }

        // cut the last }
        str = str.slice(0, str.length - 1);
        // combine the original data with the new data
        data = str + newData(counter, email, text, color);
        // Update the data
        fetch("Comments.txt", { method: "PUT", body: data });
    }
    )

}


function addComment(email, text, color) {
    //let comment = document.createElement("div");
    //comment.className = "flex-grow-1";

    //let inner='<div class="d-flex"><div class="flex-shrink-0"><svg height="100" width="100"><circle cx="50" cy="50" r="40" ></circle></svg></div><div class="flex-grow-1"><h5></h5><p></p></div></div>';
    let circle = document.createElement("div");
    let information = document.createElement("div");

    // set id, class and children of the circle
    let children_number = (document.querySelector("#Comments").children).length;
    // console.log(children_number);
    let newid = document.querySelector("#Comments").children[children_number - 1].id;
    circle.id = 'c' + (Number(newid.substr(1)) + 1);
    circle.className = "d-flex";
    circle.innerHTML = '<div class="flex-shrink-0">\n<svg height="100" width="100">\n<circle cx="50" cy="50" r="40">\n</circle>\n</svg>\n</div>';
    circle.querySelector("circle").setAttribute("fill", color);

    // set class name and children of the information box
    information.className = "flex-grow-1";
    information.innerHTML = "<h5>" + email + "</h5>\n<p>" + text + "</p>"

    circle.appendChild(information);
    //comment.appendChild(circle);


    //document.querySelector("#Comments").append(comment);
    document.querySelector("#Comments").append(circle);
}


function addBonus(ip, location, date, broswer, device) {
    // get id of the newly added comment 
    let children_number = (document.querySelector("#Comments").children).length;
    // No need to create new element, since it has already been created by addComment()
   
    let id = document.querySelector("#Comments").children[children_number - 1].id;

    //add bonus to the page
    let p = document.createElement("p");
    p.className = "bonus_information";
    p.innerHTML = "IP: " + ip + "<br>Location: " + location + " Date: " + date + "<br>Broswer (Rendering Engine): " + broswer + " " + device + " ";
    document.querySelectorAll("#" + id + " div")[1].append(p);

}
function saveBonus(bonus) {
    // string to be added (for saving)
    function newData(counter, bonus) {
        // Data object to be added
        let key = '"Comment' + String(counter + 1) + '"';

        if (counter == 0) {
            return "{ " + key + ":" + JSON.stringify(bonus) + " }";
        }
        else if (counter > 0) {
            return "\n, " + key + ":" + JSON.stringify(bonus) + " }";
        }
    }

    //save bonus
    let step1 = fetch("Bonus.txt").then(response => response.text(), () => console.log("fail to fetch"));
    step1.then(str => {
        let obj = "";
        if (str != "") {
            obj = JSON.parse(str);
        }
        // Get the number of comments in the file
        let counter = 0;
        for (i in obj) {
            counter++;
        }

        // cut the last }
        str = str.slice(0, str.length - 1);
        // combine the original data with the new data
        data = str + newData(counter, bonus);
        // Update the data
        fetch("Bonus.txt", { method: "PUT", body: data });
    }
    )
}

// get and save the bonus information at the same time
async function ipAndLocation() {

    // data is not a promise object
    let data = await getlocation();
    //console.log(data);

    let ip = data.ip;
    let location = data.city;
    if(ip===undefined || ip===null || ip=="")
    {
        ip="Could not detect";
    }
    if(location===undefined || location===null || location =="")
    {
        location="Could not detect";
    }
    let date = getUserTime();
    let broswer = checkBrowser();
    let device = isMobile();

    addBonus(ip, location, date, broswer, device);
    // Create bonus object
    let bonus = { "IP": ip, "Location": location, "Date": date, "Browser": broswer, "Device": device };
    saveBonus(bonus);




}

function getUserTime() {
    let d = new Date;
    let str = String(d.getDate()) + "-" + String(d.getMonth()) + "-" + String(d.getFullYear()) + " " + String(d.getHours()) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds());
    return str;
}

async function getlocation() {

    //synchronuous version
    // let obj = undefined;
    // let request = new XMLHttpRequest();
    // // false means synchronous, true means asynchronous
    // request.open('GET', 'http://www.geoplugin.net/json.gp', false);
    // request.onreadystatechange = function () {
    //     if (request.readyState == 4 && request.status == 200) {
    //         obj = JSON.parse(request.responseText);
    //         
    //     }
    // };
    // request.send(null);

    // return obj;


    //asynchronous version
    let p = new Promise(resolve => {
        let obj = undefined;
        let request = new XMLHttpRequest();
        // false means synchronous, true means asynchronous
        // can also use http://www.geoplugin.net/json.gp with ip=geoplugin_request and location=geoplugin_city
        request.open('GET', 'https://ipapi.co/json/', true);
        //console.log("getting");
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                //console.log("first");
                obj = JSON.parse(request.responseText);
                resolve(obj);
            }
        };
        request.send(null);

    });
    return p;


}

function checkBrowser() {
    let broswer = "Could not detect.";
    let rendering_engine = "Could not detect.";

    let firefox = (navigator.userAgent.indexOf("Firefox/") != -1);
    let seamonkey = (navigator.userAgent.indexOf("Seamonkey/") != -1);
    let chrome = (navigator.userAgent.indexOf("Chrome/") != -1);
    let chromium = (navigator.userAgent.indexOf("Chromium/") != -1);
    let safari = (navigator.userAgent.indexOf("Safari/") != -1);
    let opera = (navigator.userAgent.indexOf("Opera/") != -1);
    if (opera == -1) {
        opera = (navigator.userAgent.indexOf("OPR/") != -1);
    }
    let ie = (navigator.userAgent.indexOf("MSIE/") != -1);
    let edge = (navigator.userAgent.indexOf("Edg/") != -1);

    // Refer to https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Browser_detection_using_the_user_agent
    if (firefox && !seamonkey) {
        broswer = "Firefox";
    }
    if (seamonkey) {
        broswer = "Seamonkey";
    }
    if (chrome) {
        broswer = "Chrome";
    }
    if (chromium) {
        broswer = "Chromium";
    }
    if (safari && !(chrome || chromium)) {
        broswer = "Safari";
    }
    if (opera) {
        broswer = "Opera";
    }
    if (ie) {
        broswer = "IE";
    }
    if (edge) {
        broswer = "Edge";
    }

    // Check rendering engines
    let gecko = (navigator.userAgent.indexOf("Gecko/") != -1);
    let webkit = (navigator.userAgent.indexOf("AppleWebKit/") != -1);
    let presto = (navigator.userAgent.indexOf("Opera/") != -1);
    let trident = (navigator.userAgent.indexOf("Trident/") != -1);
    let edgehtml = (navigator.userAgent.indexOf("Edge/") != -1);
    let blink = (navigator.userAgent.indexOf("Chrome/") != -1);

    if (gecko) {
        rendering_engine = "Gecko";
    }
    if (webkit) {
        rendering_engine = "Webkit";
    }
    if (presto) {
        rendering_engine = "Presto";
    }
    if (trident) {
        rendering_engine = "Trident";
    }
    if (edgehtml) {
        rendering_engine = "EdgeHTML";
    }
    if (blink) {
        rendering_engine = "Blink";
    }

    return broswer + " (" + rendering_engine+")";
}

function isMobile() {
    // only mobile devices have this property
    let type = typeof (window.orientation);
    let mobile = ((navigator.userAgent.indexOf('IEMobile') !== -1) || type !== "undefined");

    if(mobile===undefined || mobile==null)
    {
        console.log(mobile);
        return "Could not detect device.";
    }
    if (mobile) {
        return "From mobile device.";
    }
    else {
        return "From non-mobile device";
    }
}
