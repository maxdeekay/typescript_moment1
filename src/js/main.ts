interface CourseInfo {
    code: string,
    name: string,
    progression: string,
    syllabus: string
}

window.addEventListener("load", () => {
    document.getElementById("save")?.addEventListener("click", () => {
        saveCourse();
    });

    document.getElementById("clear")?.addEventListener("click", () => clearStorage());
    document.getElementById("saveEdit")?.addEventListener("click", () => updateCourse());
    document.getElementById("cancel")?.addEventListener("click", () => cancelEdit());

    loadCourses();
});

function saveCourse() : void {
    const code = document.getElementById("code") as HTMLInputElement;
    const name = document.getElementById("name") as HTMLInputElement;
    const prog = document.getElementById("progression") as HTMLSelectElement;
    const syllabus = document.getElementById("syllabus") as HTMLInputElement;
    const message = document.getElementById("message") as HTMLElement;

    if (code.value === "" || name.value === "") {
        message.innerHTML = "Fyll i alla fält.";
        message.style.display = "block";
        message.classList.remove("success");
        message.classList.add("failure");

        setTimeout(() => {
            message.style.display  = "none";
        }, 3000);
        return;
    }

    const codes : string[] = [];

    Object.keys(localStorage).forEach((key) => {
        const course : CourseInfo = JSON.parse(localStorage.getItem(key)!);
        codes.push(course.code);
    });

    if (!codes.includes(code.value)) {
        const newCourse : CourseInfo = {
            code: code.value,
            name: name.value,
            progression: prog.value,
            syllabus: syllabus.value
        };
    
        localStorage.setItem(`key_${localStorage.length + 1}`, JSON.stringify(newCourse));
        loadCourses();

        code.value = "";
        name.value = "";
        prog.selectedIndex = 0;
        syllabus.value = "";

        message.innerHTML = "Kurs tillagd.";
        message.style.display = "block";
        message.classList.remove("failure");
        message.classList.add("success");
    } else {
        message.innerHTML = "Kurs finns redan.";
        message.style.display = "block";
        message.classList.remove("success");
        message.classList.add("failure");
    }

    setTimeout(() => {
        message.style.display  = "none";
    }, 3000);
}

function loadCourses() : void {
    const container = document.getElementById("output") as HTMLElement;
    container.innerHTML = "";

    Object.keys(localStorage).forEach((key) => {
        container.appendChild(printCourse(JSON.parse(localStorage.getItem(key)!), key));
    });
}

function printCourse(course: CourseInfo, key: string) : HTMLElement {
    const div : HTMLElement = document.createElement("div");
    div.classList.add("course-container");

    const code : HTMLElement = document.createElement("p");
    const codeText = document.createTextNode(`${course.name} (${course.code})`);
    code.appendChild(codeText);
    div.appendChild(code);

    const prog : HTMLElement = document.createElement("p");
    const progText = document.createTextNode(course.progression);
    prog.appendChild(progText);
    div.appendChild(prog);

    const link : HTMLAnchorElement = document.createElement("a");
    const linkText = document.createTextNode("Länk till kursplan");
    link.href = course.syllabus;
    link.appendChild(linkText);
    div.appendChild(link);

    const edit : HTMLButtonElement = document.createElement("button");
    edit.innerHTML = "<span class='material-symbols-outlined'>edit_note</span>";
    edit.classList.add("edit");
    edit.addEventListener("click", () => editCourse(course, key));
    div.appendChild(edit);

    return div;
}

function clearStorage() : void {
    localStorage.clear();
    const container = document.getElementById("output") as HTMLElement;
    container.innerHTML = "";
}

function editCourse(course: CourseInfo, key: string) : void {
    (document.getElementById("newCode") as HTMLInputElement).value = course.code;
    (document.getElementById("newName") as HTMLInputElement).value = course.name;
    (document.getElementById("newSyllabus") as HTMLInputElement).value = course.syllabus;
    (document.getElementById("newProgression") as HTMLSelectElement).value = course.progression;

    const container = document.getElementById("edit-container") as HTMLElement;
    container.style.display = "flex";

    const save = document.getElementById("saveEdit") as HTMLButtonElement;
    save.setAttribute("course-key", key);
}

function updateCourse() : void {
    const code = document.getElementById("newCode") as HTMLInputElement;
    const name = document.getElementById("newName") as HTMLInputElement;
    const prog = document.getElementById("newProgression") as HTMLSelectElement;
    const syllabus = document.getElementById("newSyllabus") as HTMLInputElement;

    const newCourse : CourseInfo = {
        code: code.value,
        name: name.value,
        progression: prog.value,
        syllabus: syllabus.value
    };
    
    const save = document.getElementById("saveEdit") as HTMLButtonElement;
    const key : any = save.getAttribute("course-key");
    localStorage.setItem(key, JSON.stringify(newCourse));

    console.log(key);

    const container = document.getElementById("edit-container") as HTMLElement;
    container.style.display = "none";

    loadCourses();
}

function cancelEdit() : void {
    const container = document.getElementById("edit-container") as HTMLElement;
    container.style.display = "none";
}