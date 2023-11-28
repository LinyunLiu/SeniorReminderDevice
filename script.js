let OnLoadReminderCount = 0
let addCount = 0
let data = []
async function loadDataFromServer() {
    try {
        const response = await fetch('http://10.18.7.90:3000/data');
        const text = await response.text();
        data = text.toString().split('\n')
        document.getElementById('email').value = data[0];
        data.splice(0, 1)
        OnLoadReminderCount = data.length // the first line is email address instead of reminder data
        for (let i= 0; i<OnLoadReminderCount; i++){
            let line = data[i].toString().split(',')
            console.log(line);
            let active = false
            if (line[5] === "true"){
                active = true
            }
            addOneEmptyReminderSection(i)
            addOneReminderInfo(i, line[0], line[1], line[2], line[3], line[4], active)
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert("Server Offline")
    }
}
function addOneEmptyReminderSection(index){
    addCount+=1
    const mainContainer = document.querySelector('.reminders');
    const newReminder = document.createElement('div');
    newReminder.innerHTML = `<label>
                            <select id="select-type-${index}-0">
                                <option value="Pill">Pill</option>
                                <option value="Task">Task</option>
                                <option value="Other">Other</option>
                            </select>                        
                            </label>
                            
                            <label>
                                <input type="text" id="description-${index}-1" placeholder="Description" value="">
                            </label>
                            
                            <label>
                                <select id="select-occurrence-${index}-2">
                                    <option value="Every Day">Every Day</option>
                                    <option value="Once">Once</option>
                                </select>
                            </label>
                            
                            <label>
                                <input type="time" id="time-${index}-3" value="">
                            </label>
                           
                            <label>
                                <input type="date" id="date-${index}-4" value="">
                            </label>
                            
                            <label>
                                <input type="checkbox" id="checkbox-${index}-5" value="">
                            </label>
                            
                            <button class="delete" id="delete-${index}-6" onclick="deleteSection(${index})">Delete</button>`;
    newReminder.classList.add(`reminder-${index}`);
    mainContainer.appendChild(newReminder);
}
function addOneReminderInfo(index, selectType, description, selectOccurrence, time, date, checkbox){
    document.getElementById(`select-type-${index}-0`).value = selectType;
    document.getElementById(`description-${index}-1`).value = description;
    document.getElementById(`select-occurrence-${index}-2`).value = selectOccurrence;
    document.getElementById(`time-${index}-3`).value = time;
    document.getElementById(`date-${index}-4`).value = date;
    document.getElementById(`checkbox-${index}-5`).checked = checkbox;
}



// This part of functions extract all the reminder info and save them in array
function extractOneReminderInfo(index){
    try {
        const selectType = document.getElementById(`select-type-${index}-0`).value;
        const description = document.getElementById(`description-${index}-1`).value;
        const selectOccurrence = document.getElementById(`select-occurrence-${index}-2`).value;
        const time = document.getElementById(`time-${index}-3`).value;
        const date = document.getElementById(`date-${index}-4`).value;
        const checkBox = document.getElementById(`checkbox-${index}-5`).checked;
        return `${selectType},${description},${selectOccurrence},${time},${date},${checkBox}`
    }catch(error){
        console.log("error while extracting information")
    }

}
function extractAllReminders(){
    let reminders = []
    for (let i=0; i<addCount; i++){
        reminders[i] = extractOneReminderInfo(i)
    }
    console.log(reminders)
    return reminders;
}
// ================================== End ==================================

function deleteSection(index){
    let newData = extractAllReminders()
    newData.splice(index, 1)
    addCount = 0;
    // Get a reference to the parent div
    const parentDiv = document.getElementById('reminders');
    // Remove all children by setting innerHTML to an empty string
    parentDiv.innerHTML = '';

    for (let i= 0; i<newData.length; i++){
        let line = newData[i].toString().split(',')
        let active = false
        if (line[5] === "true"){
            active = true
        }
        addOneEmptyReminderSection(i)
        addOneReminderInfo(i, line[0], line[1], line[2], line[3], line[4], active)
    }
}
async function updateDataAtServer() {
    let email = "oliverleo574@gmail.com" //default
    let email_tmp = document.getElementById('email').value;
    if (email_tmp.toString().trim() !== ""){
        email = email_tmp
    }
    let updatedData = extractAllReminders()
    let dataAsString = ""
    dataAsString = dataAsString.concat(email+"\n")
    for (let i=0; i<updatedData.length-1; i++){
        dataAsString = dataAsString.concat(updatedData[i]+"\n")
    }
    dataAsString = dataAsString.concat(updatedData[updatedData.length-1])
    alert("Update Successful")
    try {
        const response = await fetch('http://10.18.7.90:3000/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: dataAsString
        });
        console.log(response)
    }catch (error){
        console.error('Error updating data:', error);
        alert("Server Offline")
    }
}


