let container = document.querySelector(".input-container")
let cleanButton = document.getElementById('cleanup')
let initDragAndDrop = document.getElementById('changeLayout')
let addNewRow  = document.getElementById('addNewRow')
let removeRow  = document.getElementById('removeRow')
let inputTypes = [
    "button",
    "checkbox",
    "color",
    "date",
    "datetime-local",
    "email",
    "file",
    "hidden",
    "image",
    "month",
    "number",
    "password",
    "radio",
    "range",
    "reset",
    "search",
    "submit",
    "tel",
    "text",
    "time",
    "url",
    "week"]

let selectContent = ''
inputTypes.forEach(type => {
    selectContent += `<option value=${type}>${type}</option>`
})


const getDataInJsonFormat = async () => {
    let res = await axios.get('http://localhost:5001/data')
    return res.data
}

const updateClassList = () => {
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('click', (e) =>{
            let LabelElement = e.target.parentElement
            let enteredClassList = prompt("Please enter class list separeted by space", `${LabelElement.classList}`);
            if (enteredClassList != null) {
                let classList = enteredClassList.split(' ')
                LabelElement.classList.forEach(className => {
                    LabelElement.classList.remove(className)
                })
                classList.forEach(className => {
                    LabelElement.classList.add(className)
                })
            }
        })
    })
    

}

const changingInputType = (el) => {
    document.querySelectorAll('.select').forEach(selectItem => {
        selectItem.addEventListener("input", (e) => {
            e.target.parentElement.querySelector('input').type = e.target.value
        })
    })
}

const addElement = (label, id, type = 'text',) => {
    return (
        `
            <label class='col-4' draggable='true' id='label-${id}'>
                <span>${label}</span>
                <input type=${type}/>
                <select class = "select">
                    ${selectContent}
                </select>
            </label>
        `
    )
}

const finishItUp = (container) =>{
    container.querySelectorAll('.select').forEach(select => {
        select.remove()
    })
    console.log(container.innerHTML)
}

const letsGetToWork = async () => {
    let data = await getDataInJsonFormat()
    let html = `<div class='row'>`
    let counter = 0
    data.forEach((item) => {
        html += addElement(item.label,counter)
        counter++;
        if(counter % 5 == 0){
            html+= `</div><div class='row'>`
        }
    })
    html += "</div>"

    container.innerHTML = html

    changingInputType()
    updateClassList()
}

cleanButton.addEventListener('click', () =>{
    let confirmState = confirm("are you shure ??")
    if(confirmState){
        finishItUp(container)
    }
})

initDragAndDrop.addEventListener('click', () => {
    document.querySelectorAll('label').forEach(label => {
        label.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain',e.target.id)
        })
    })
    document.querySelectorAll('.row').forEach(row => {
        row.addEventListener('dragover', (e) => {
            e.preventDefault()
        })
        row.addEventListener('drop', (e) => {
            e.preventDefault()
            let id = e.dataTransfer.getData('text/plain')
            if(e.target.classList.contains('row')){
                e.target.appendChild(document.getElementById(id))
                console.log(id)
            }else if(e.target.tagName == "SPAN"){
                e.target.parentElement.insertAdjacentElement("afterend", document.getElementById(id))
            }
            console.log(e.target.tagName)
        })
    })
})

addNewRow.addEventListener('click',(e) => {
    container.insertAdjacentHTML("beforeend",`<div class="row"></div>`)
    initDragAndDrop.click()
})

removeRow.addEventListener('click',(e) => {
    let rows = document.querySelectorAll('.row')
    if(!rows[rows.length-1].lastElementChild){
        rows[rows.length-1].remove()
    }
})



letsGetToWork()






