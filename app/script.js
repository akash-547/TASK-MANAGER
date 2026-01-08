const addBtn=document.getElementById("addBtn");
const taskinput=document.getElementById("taskinput")
const taskList=document.getElementById("taskList")

addBtn.addEventListener("click",()=>{
    const task =taskinput.value.trim()
    if(task==""){
        alert("Enter a task please");
        return;       
    }
})