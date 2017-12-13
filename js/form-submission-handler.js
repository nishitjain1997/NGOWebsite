function validateHuman(honeypot) {
    if (honeypot) {  //if hidden form filled up
        console.log("Robot Detected!");
        return true;
    } else {
        console.log("Welcome Human!");
    }
}

// get all data in form and return object
function getFormData() {
    var form = document.getElementById("myForm");
    var elements = form.elements; // all form elements
    var fields = Object.keys(elements).map(function(k) {
        if(elements[k].name !== undefined) {
            return elements[k].name;
        }
        else if(elements[k].length > 0) {
            return elements[k].item(0).name;
        }
    }).filter(function(item, pos, self) {
        return self.indexOf(item) == pos && item;
    });
    
    var data = {};
    
    fields.forEach(function(k) {
        data[k] = elements[k].value;
        
        var str = ""; 
        // declare empty string outside of loop to allow
        // it to be appended to for each item in the loop
        
        if(elements[k].type === "checkbox"){ 
            // special case for Edge's html collection
            str = str + elements[k].checked + ", "; 
            // take the string and append 
            // the current checked value to 
            // the end of it, along with 
            // a comma and a space
            
            data[k] = str.slice(0, -2); 
            // remove the last comma and space 
            // from the  string to make the output 
            // prettier in the spreadsheet
        }
        else if(elements[k].length) {
            for(var i = 0; i < elements[k].length; i++) {
                if(elements[k].item(i).checked) {
                    str = str + elements[k].item(i).value + ", "; 
                    // same as above
                    data[k] = str.slice(0, -2);
                }
            }
        }
    });

    // add form-specific values into the data
    data.formDataNameOrder = JSON.stringify(fields);
    data.formGoogleSheetName = form.dataset.sheet || "UserData"; // default sheet name
    data.formGoogleSendEmail = form.dataset.email || ""; // no email by default

    return data;
}

function handleFormSubmit(event) {  
    // handles form submit withtout any jquery
    event.preventDefault();           
    
    var data = getFormData();         
    // get the values submitted in the form

    if (validateHuman(data.honeypot)) {  
        //if form is filled, form will not be submitted
        return false;
    }
    
    var url = event.target.action;  
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        console.log(xhr.responseText);
        document.getElementById("joinPage-content").style.display = 'none';
        document.getElementById("success").style.display = 'block';
        return;
    };
    
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    xhr.send(encoded);
}

function loaded() {
    console.log('Form handler loaded successfully');
    // bind to the submit event of our form
    var form = document.getElementById('myForm');
    form.addEventListener("submit", handleFormSubmit, false);
};

document.addEventListener('DOMContentLoaded', loaded, false);