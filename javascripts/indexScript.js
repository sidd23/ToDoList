(function () {
    let modal = document.getElementById("addTaskModal");
    let trigger = document.getElementById("modalTrigger");
    let closeButton = document.getElementById("closeAddTaskModal");
    let listSelection = document.getElementById("list");
    let taskAddition = document.getElementById("submitTaskAddition");
    let listCode = {
        "1": "toDo",
        "2": "inProgress",
        "3": "done"
    };
    let taskItemPrefix = "task-";
    let data;
    let lists = document.getElementsByClassName("list");
    let taskItems = document.getElementsByClassName("task-item");

    function toggleModal() {
        modal.classList.toggle("show-modal");
    }

    function windowOnClick(event) {
        if (event.target === modal) {
            toggleModal();
        }
    }

    function generateElement(data) {
        // Generate new task's HTML
        let parentId = listCode[data.code];
        let parentElement = document.getElementById(parentId);

        let node = document.createElement("li");
        node.innerText = data.description;
        node.setAttribute("class", "task-item");
        node.setAttribute("id", taskItemPrefix.concat('', data.id));
        node.setAttribute("draggable", "true");

        parentElement.appendChild(node);
    }

    function addTask(event) {
        event.preventDefault();
        let code = listSelection.options[listSelection.selectedIndex].value;

        // Generate task's data as JSON
        let taskContent = document.getElementById("taskContent");

        let id = new Date().getTime();

        let tempTaskData = {
            'id': id,
            'code': code,
            'description': taskContent.value
        };

        // Persist in localStorage
        if (localStorage.getItem("tasks") === null) {
            data = {};
        } else {
            data = JSON.parse(localStorage.getItem('tasks'));
        }

        data[id] = tempTaskData;
        localStorage.setItem("tasks", JSON.stringify(data));

        // Generate corresponding HTML element
        generateElement(tempTaskData);

        // Clear/reset fields (?)
        taskContent.value = '';
    }

    function onDragStart(event) {
        event.dataTransfer.setData('text', event.target.id);
        // event.dataTransfer.dropEffect = "move";
    }

    function onDragOver(event) {
        event.preventDefault();
        // event.dataTransfer.dropEffect = "move";
    }

    function onDrop(event) {
        event.preventDefault();
        let taskId = event.dataTransfer.getData('text');
        event.target.appendChild(document.getElementById(taskId));

        let key = taskId.substr(5);
        let tempData = JSON.parse(localStorage.getItem("tasks"));
        let targetListId = event.target.id;
        let targetListCode;

        for (let code in listCode) {
            if (listCode.hasOwnProperty(code)) {
                if (listCode[code] === targetListId) {
                    targetListCode = code;
                }
            }
        }

        tempData[key].code = targetListCode;

        localStorage.setItem("tasks", tempData);
    }


    function setEventListeners() {
        trigger.addEventListener("click", toggleModal);
        closeButton.addEventListener("click", toggleModal);
        window.addEventListener("click", windowOnClick);
        taskAddition.addEventListener("click", addTask);

        for (let list of lists) {
            // list.addEventListener("dragstart", onDragStart);
            list.addEventListener("dragover", onDragOver);
            list.addEventListener("drop", onDrop);
        }

        for (let taskItem of taskItems) {
            taskItem.addEventListener("dragstart", onDragStart);
        }
    }

    function initializeToDoLists() {
        let tempData = JSON.parse(localStorage.getItem("tasks"));
        if (tempData !== null) {
            // Refer https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
            for (let key in tempData) {
                if (tempData.hasOwnProperty(key)) {
                    generateElement(tempData[key]);
                }
            }
        }
    };

    setEventListeners();
    initializeToDoLists();

})();