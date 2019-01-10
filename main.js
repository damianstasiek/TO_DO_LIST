// Goals Controller

class Goals {
    constructor() {
        this.todo = [];
        this.completed = [];
    }
    addGoals(name, category, endDate, calcDate, ID) {
        if (this.todo.length > 0) {
            if (this.completed.length > this.todo.length) {
                ID = this.completed[this.completed.length - 1].ID + 1;
            } else {
                ID = this.todo[this.todo.length - 1].ID + 1;
            }
        } else {
            ID = 0;
        }
        let goalItem = {
            ID,
            name,
            category,
            endDate,
            calcDate
        }
        const calculateDate = this.calculateDate(goalItem.endDate);
        goalItem.calcDate = calculateDate;
        this.todo.push(goalItem);
        return this.todo;
    }
    completeItem(ID, parent) {
        let ids = this.todo.map(function (current) {
            return current.ID;
        });
        if (parent === 'completed') {
            ids = this.completed.map(function (current) {
                return current.ID;
            });
        }
        const index = ids.indexOf(ID);
        if (index !== -1) {
            if (parent == 'completed') {
                this.todo.push(this.completed[index]);
                this.completed.splice(index, 1);
            } else {
                this.completed.push(this.todo[index]);
                this.deleteGoal(ID);
            }

        }
    }
    numberOfGoals() {
        return this.todo.length;
    }
    deleteGoal(id) {
        const ids = this.todo.map(function (current) {
            return current.ID;
        });
        const index = ids.indexOf(id);
        if (index !== -1) {
            this.todo.splice(index, 1);
        }
    }
    showToDoGoals() {
        return this.todo;
    }
    showCompletedGoals() {
        return this.completed;
    }
    calculateDate(data) {
        const endDate = new Date(data).getTime();
        const now = new Date().getTime();
        const timeToEnd = endDate - now;
        const cd = 24 * 60 * 60 * 1000
        const ch = 60 * 60 * 1000;
        const d = Math.floor(timeToEnd / cd);
        const h = Math.floor((timeToEnd - d * cd) / ch);
        if (h === 24) {
            d++;
            h = 0
        }
        return `${d} ${d>1 ? 'days': 'day'} ${h} ${h>1? 'hours': 'hour'}`;
    }

}

class UIController {
    static DOMstrings() {
        return {
            inputName: '.name',
            inputCategory: '.type',
            inputDate: '.endDate',
            delteBtn: '.delete__btn',
            addBtn: '.add__btn',
            completedList: '.complet_list',
            todoList: '.todo_list'
        }
    }
    static getInput() {
        return {
            name: document.querySelector(UIController.DOMstrings().inputName).value,
            category: document.querySelector(UIController.DOMstrings().inputCategory).value,
            endDate: document.querySelector(UIController.DOMstrings().inputDate).value
        }
    }
    static addListItem(items, parent = 'completed') {
        const itemElement = document.createElement('li');
        const todoList = document.querySelector(UIController.DOMstrings().todoList);
        const completedList = document.querySelector(UIController.DOMstrings().completedList);
        const sort = document.querySelector('.sortName');
        console.log(items);
        items.forEach((item) => {
            itemElement.classList.add('itemList');
            sort.classList.add('active');
            itemElement.innerHTML = `<p class="itemName">${item.name}</p><p class="itemCategory">${item.category}</p><p class="itemDate">${item.endDate}</p><p class="itemCalcDate">${item.calcDate}</p><button class="delete__btn">Delete</button><button class="completed__btn">${parent == 'completed' ? 'Complete' : 'Uncomplete'}</button>`;
            itemElement.dataset.key = item.ID;
            console.log(parent);
            parent == 'todo_list' ? completedList.appendChild(itemElement) : todoList.appendChild(itemElement);
        })
    }
    static deleteListItme(item) {
        item.remove();
    }
    static updateNumOfGoals(goalsNum) {
        const number = document.querySelector('.number');
        number.textContent = goalsNum;
    }
    static clearFields() {
        const fields = document.querySelectorAll(`${this.DOMstrings().inputName}, ${this.DOMstrings().inputDate}, ${this.DOMstrings().inputCategory}`);
        const fieldsArr = Array.prototype.slice.call(fields);
        fieldsArr.forEach(input => {
            input.value = '';
        })
        fieldsArr[0].focus();
    }
    static sortList(el) {
        let switching = true;
        let shouldSwitch = true;
        let switchcount = 0
        let i;
        let dir = 'asc';
        console.log(el);
        while (switching) {
            const li = document.querySelectorAll('.itemList')
            switching = false;
            console.log(li[0].childNodes.forEach(child => {
                console.log(child.className);
            }));
            for (i = 0; i < li.length - 1; i++) {
                shouldSwitch = false;
                if (dir == 'asc') {
                    sortBy = li[i].childNodes.forEach(child => {
                        return child.className
                    })
                    if (li[i].innerHTML.toLowerCase() > li[i + 1].innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == 'desc') {
                    if (li[i].innerHTML.toLowerCase() < li[i + 1].innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            console.log(i);
            console.log(li[i]);
            if (shouldSwitch && li.length > 1) {
                li[i].parentNode.insertBefore(li[i + 1], li[i]);
                switching = true;
                switchcount++;
                console.log('switch');
            } else {
                if (switchcount == 0 && dir == 'asc') {
                    dir = 'desc';
                    switching = true;
                }
            }

        }
    }
}

class Controller {
    constructor() {
        this.goals = new Goals();
        const DOM = UIController.DOMstrings();
        document.querySelector(DOM.addBtn).addEventListener('click', this.ctrlAddItem.bind(this));
        document.querySelector('.container').addEventListener('click', this.ctrlDeleteItem.bind(this));
        document.querySelector('.sortName').addEventListener('click', this.sortList);
    }
    ctrlAddItem() {
        const input = UIController.getInput();
        if (input.name && input.endDate && input.category) {
            const newItem = this.goals.addGoals(input.name, input.category, input.endDate);
            console.log(newItem);
            const x = this.goals.showToDoGoals();
            UIController.addListItem(x);
            UIController.updateNumOfGoals(this.goals.numberOfGoals());
            UIController.clearFields();
        } else {
            alert('Brak danych');
        }

    }
    ctrlDeleteItem(e) {
        const itemID = parseInt(e.target.parentNode.dataset.key);
        const itemEl = e.target.parentNode;
        const parent = e.target.parentNode.parentNode.className;
        if (e.target.className === 'delete__btn') {
            this.goals.deleteGoal(itemID);
            UIController.deleteListItme(itemEl);
            UIController.updateNumOfGoals(this.goals.numberOfGoals());
        } else if (e.target.className === 'completed__btn') {
            console.log(parent);
            this.goals.completeItem(itemID, parent);
            UIController.deleteListItme(itemEl);
            UIController.updateNumOfGoals(this.goals.numberOfGoals());
            const completed = (parent === 'completed' ? this.goals.showToDoGoals() : this.goals.showCompletedGoals());
            UIController.addListItem((completed.length > 1 ? todo : completed), parent);
            console.log(this.goals.showToDoGoals());
            console.log(this.goals.showCompletedGoals());
        }
    }
    sortList(e) {
        const list = document.querySelector('.todo_list');
        const btnSort = e.target.dataset.key;
        UIController.sortList(list, btnSort);

    }

}

const init = new Controller();


// Slider

const slideImg = ['img/motivational-wallpaper-3.jpg', 'img/motivational-wallpaper-29.jpg', 'img/motivational-wallpaper-35.jpg']
const image = document.querySelector('.slide');
const dots = document.querySelector('.dots');
const time = 4000;
let active = 0;

const createDots = () => {
    for (let i = 0; i < slideImg.length - 1; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.id = i;
        dots.appendChild(dot);
    }
}

const activeDots = (index) => {
    const dots = [...document.querySelectorAll('.dot')];
    const activeDot = dots.findIndex(dot => dot.classList.contains('active'));
    dots[activeDot].classList.remove('active');
    dots[index].classList.add('active')
}

const changeSlide = (key) => {
    if (key === 39) active++;
    else if (key === 37) active--;
    else active++;
    if (active === slideImg.length) active = 0;

    if (active < 0) active = slideImg.length - 1;
    image.src = slideImg[active];
    activeDots(active)
    console.log(active);

}
let timer = setInterval(changeSlide, time);

const keyChangeSlide = (e) => {
    if (e.keyCode === 37 || e.keyCode === 39) {
        changeSlide(e.keyCode);
        clearInterval(timer);
    }
    timer = setInterval(changeSlide, time);
}
createDots();
window.addEventListener('keydown', keyChangeSlide);