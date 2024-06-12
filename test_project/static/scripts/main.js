let listData = {};

/**
 * Called on loading the page
 * 
 * */
async function loadList(){
    const response = await fetch('/getList');
    listData = await response.json();
    console.log(listData);
    renderHTML(listData);
}

/** 
 * renders HTML from API response 
 * @param {JSON} listData is the data being returned
 *  by the server of the list of team members
 *
*/
function renderHTML(listData){
    if(listData.team_data && listData.team_data.length){
        let teamString = '';
        document.getElementById('contentBlock').innerHTML = `
            <div class="alignRight block">
                <div class="plusIcon" onclick="showAdd(event);">
                    <img alt="Add New Team Members" src="${document.getElementById('plusIcon').src}">
                </div>
            </div>
            <div class="header">
                <div><h1>Team Members</h1></div>
                
                <div class="subHeader">You have <span id="numberOfTeamMembers">${listData.team_data.length}</span> team members.</div>
            </div>
            <div id="team"></div>
            <hr/>`;
        listData.team_data.forEach((item) => {
            teamString += `
                <hr/>
                <div role="link" class="teamMember" onclick="showEdit(${item.id}, event);">
                    <div class="teamMember" >
                        <div class="alignLeft alignTop photo">
                            <img alt="Team Member Picture" src="${document.getElementById('pathFinder').src}">
                        </div>
                        <div class="alignRight personalInfo">
                            <div class="name">
                                ${item.first_name} ${item.last_name}
                                <span class="role" title="role">${(item.role === 'admin' ? '(' + item.role + ')' : '')}
                            </div>
                            <div class="phone">
                                ${item.phone}
                            </div>
                            <div class="email">
                                ${item.email}
                            </div>
                        </div>
                    </div>
                </div>`;
        });
        document.getElementById('team').innerHTML = teamString;
    }
}

/**
 * Shows Edit page
 * 
 * @param {number} id is the id in the JSON of the user (would be DB)
 */
function showEdit(id , e){
    e.preventDefault();
    let editItem = listData.team_data.filter((item)=>item.id === id);
    if(editItem.length){
        editItem = editItem[0];
    }
    document.getElementById('contentBlock').innerHTML = `
    <form onsubmit="editSubmit(event);return false;"
        <div class="header">
            <div><h1>Edit team member</h1></div>
            <div class="subHeader">Edit contact info, location and role.</div>
        </div>
        <hr/>
        <div class="sectionHeader">
            Info
        </div>
        <div>
            <input type="hidden" id="id" name="id" value="${editItem.id}">
            <input aria-label="First Name" title="First Name" class="cleanInput" id="first_name" name="first_name" 
                value="${editItem.first_name}" placeholder="Enter Team Member's First Name">
        </div>
        <div>
            <input aria-label="Last Name" title="Last Name" class="cleanInput" id="last_name" name="last_name" 
                value="${editItem.last_name}" placeholder="Enter Team Member's Last Name">
        </div>
        <div>
            <input aria-label="Email Address" title="Email Address" class="cleanInput" id="email" name="email" 
                value="${editItem.email}" placeholder="Enter Team Member's Email Address">
        </div>
        <div>
            <input aria-label="Phone Number" title="Phone Number" class="cleanInput" id="phone" name="phone" 
                value="${editItem.phone}" placeholder="Enter Team Member's Phone Number">
        </div>
        <div class="sectionHeader">
            Role
        </div>
        <div>
            <label for="regular">Regular - can't delete members</label><input 
                class="floatRight radio" type="radio" id="regular" name="role" value="regular" ${(editItem.role !== 'admin')? 'checked' : ''} />
        </div>
        <hr class="smallMargin"/>
        <div>
            <label for="admin">Admin - can delete members</label><input 
                class="floatRight radio" type="radio" id="admin" name="role" value="admin" ${(editItem.role === 'admin')? 'checked' : ''} />
        </div>
        <hr class="smallMargin"/>
        <div class="buttonBar">
            <button title="Delete this Member" 
                aria-label="Delete this Member" 
                onclick="deleteUser(${id}, event); return false;" class="secondaryButton">Delete</button>
            <button title="Save changes to this Member"
                 aria-label="Save changes to this Member"
                 type="submit" class="floatRight primaryButton">Save</button>
        </div>
    </form>`;
}

/**
 * Handles submission of edit form
 * @param {*} e standard event object from clicking submit
 */
async function editSubmit(e) {
    e.preventDefault();
  
    let formData = new FormData(e.target);
    // output as an object
    let formDataObj = Object.fromEntries(formData);
    console.log(formDataObj);
    formDataObj.id = parseInt(formDataObj.id);

    // fix listData and send
    let index = listData.team_data.findIndex((item)=> item.id === formDataObj.id);
    listData.team_data.splice(index, 1, formDataObj);
    console.log(listData);
    try {
        var response = await fetch('/editMembers/', {
            method: "PUT", 
            mode: "same-origin", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "omit", // include, *same-origin, omit
            headers: {
            "Content-Type": "application/json",
            },
            referrerPolicy: "same-origin", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({id: formDataObj.id, data: listData}), // body data type must match "Content-Type" header
        });
    } catch( error ){
        alert('There was an API error: '+JSON.stringify(error));
    }

    if (!response?.ok) {
        alert(`There was an API error, HTTP Response Code: ${response?.status}`);
    }
    
    let responseData = await response.json();
    console.log(responseData);
    alert(formDataObj.first_name + ' ' + formDataObj.last_name + " edited successfully.");
    loadList();
}

/**
 * Handles submission of edit form
 * @param {*} e standard event object from clicking submit
 */
async function deleteUser(id, e) {
    e.preventDefault();
    
    id = parseInt(id);

    // fix listData and send
    let index = listData.team_data.findIndex((item)=> item.id === id);
    listData.team_data.splice(index, 1);
    console.log(listData);
    try {
        var response = await fetch('/editMembers/', {
            method: "DELETE", 
            mode: "same-origin", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "omit", // include, *same-origin, omit
            headers: {
            "Content-Type": "application/json",
            },
            referrerPolicy: "same-origin", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({id: id, data: listData}), // body data type must match "Content-Type" header
        });
    } catch( error ){
        alert('There was an API error: '+JSON.stringify(error));
    }

    if (!response?.ok) {
        alert(`There was an API error, HTTP Response Code: ${response?.status}`);
    }
    
    let responseData = await response.json();
    console.log(responseData);
    alert("Member deleted successfully.");
    loadList();
}


/**
 * Shows Edit page
 * 
 * @param {number} id is the id in the JSON of the user (would be DB)
 */
function showAdd(e){
    e.preventDefault();
    // take the last one and then increment the id by one
    let id = parseInt(listData.team_data[listData.team_data.length - 1].id) + 1;
    document.getElementById('contentBlock').innerHTML = `
    <form onsubmit="addSubmit(${id},event);return false;"
        <div class="header">
            <div><h1>Add a team member</h1></div>
            <div class="subHeader">Set email, location and role.</div>
        </div>
        <hr/>
        <div class="sectionHeader">
            Info
        </div>
        <div>
            <input type="hidden" id="id" name="id" value="${id}">
            <input aria-label="First Name" title="First Name" class="cleanInput" id="first_name" name="first_name" 
                value="" placeholder="Enter Team Member's First Name">
        </div>
        <div>
            <input aria-label="Last Name" title="Last Name" class="cleanInput" id="last_name" name="last_name" 
                value="" placeholder="Enter Team Member's Last Name">
        </div>
        <div>
            <input aria-label="Email Address" title="Email Address" class="cleanInput" id="email" name="email" 
                value="" placeholder="Enter Team Member's Email Address">
        </div>
        <div>
            <input aria-label="Phone Number" title="Phone Number" class="cleanInput" id="phone" name="phone" 
                value="" placeholder="Enter Team Member's Phone Number">
        </div>
        <div class="sectionHeader">
            Role
        </div>
        <div>
            <label for="regular">Regular - can't delete members</label><input 
                class="floatRight radio" type="radio" id="regular" name="role" value="regular" checked/>
        </div>
        <hr class="smallMargin"/>
        <div>
            <label for="admin">Admin - can delete members</label><input 
                class="floatRight radio" type="radio" id="admin" name="role" value="admin"  />
        </div>
        <hr class="smallMargin"/>
        <div class="buttonBar">
            <button title="Save changes to this Member"
                 aria-label="Save changes to this Member"
                 type="submit" class="floatRight primaryButton">Save</button>
        </div>
    </form>`;
}

/**
 * Handles submission of edit form
 * @param {*} e standard event object from clicking submit
 */
async function addSubmit(id, e) {
    e.preventDefault();
  
    let formData = new FormData(e.target);
    // output as an object
    let formDataObj = Object.fromEntries(formData);
    console.log(formDataObj);
    formDataObj.id = parseInt(id);

    // fix listData and send
    listData.team_data.push(formDataObj);
    console.log(listData);
    try{
        var response = await fetch('/editMembers/', {
            method: "POST", 
            mode: "no-cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "omit", // include, *same-origin, omit
            headers: {
            "Content-Type": "application/json",
            },
            referrerPolicy: "same-origin", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({id: formDataObj.id, data: listData}), // body data type must match "Content-Type" header
        });
    } catch( error ){
        alert('There was an API error: '+JSON.stringify(error));
    }

    if (!response?.ok) {
        alert(`There was an API error, HTTP Response Code: ${response?.status}`);
    }
    
    let responseData = await response.json();
    console.log(responseData);
    alert(formDataObj.first_name + ' ' + formDataObj.last_name + " added successfully.");
    loadList();
}