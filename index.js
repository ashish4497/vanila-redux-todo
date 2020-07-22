let add = document.querySelector(".add-todo");
let all = document.querySelector(".all");
let active = document.querySelector(".active");
let completed = document.querySelector(".completed");
let clear = document.querySelector(".clearCompleted");
let ul = document.querySelector(".list");
let footer = document.querySelector(".footer");
let left = document.querySelector(".left");

const ADD_TODO = "ADD_TODO";
const DELETE_TODO = "DELETE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ALL_TODO = "ALL_TODO";
const ACTIVE_TODO = "ACTIVE_TODO";
const COMPLETE_TODO = "COMPLETE_TODO";
const CLEAR_TODO = "CLEAR_TODO";
const EDIT_TODO = "EDIT_TODO";

function reducer(state = { todolist: [], tab: "all" }, action) {
  switch (action.type) {
    case ADD_TODO:
      const newTodo = {
        id: Date.now(),
        text: action.text,
        isDone: false,
      };
      return {
        ...state,
        todolist: state.todolist.concat(newTodo),
      };

    case DELETE_TODO:
      return {
        ...state,
        todolist: state.todolist.filter((todo) => !(todo.id == action.id)),
      };

    case TOGGLE_TODO:
      return {
        ...state,
        todolist: state.todolist.map((todo) => {
          if (todo.id === action.id) {
            todo.isDone = !todo.isDone;
          }
          return todo;
        }),
      };

    case ALL_TODO:
      return {
        ...state,
        tab: "all",
      };

    case ACTIVE_TODO:
      return {
        ...state,
        tab: "active",
      };

    case COMPLETE_TODO:
      return {
        ...state,
        tab: "complete",
      };

    case CLEAR_TODO:
      return {
        ...state,
        todolist: state.todolist.filter((todo) => !todo.isDone),
      };
    case EDIT_TODO:
      return {
        ...state,
        todolist: state.todolist.map((todo) => {
          if (todo.id === action.load.id) {
            todo.text = action.load.text;
          }
          return todo;
        }),
      };
    default:
      return state;
  }
}

let store = Redux.createStore(reducer);

const handleEdit = (e, id) => {
  console.log(e, "e");
  let val = e.target.innerHTML;
  const input = document.createElement("input");
  input.value = val;
  e.target.parentElement.replaceChild(input, e.target);
  input.focus();
  input.addEventListener("keyup", (e) => {
    console.log(e);
    if (e.keyCode == 13) {
      console.log(e.target.keyCode, "dfghjk");
      store.dispatch({
        type: EDIT_TODO,
        load: {
          id,
          text: input.value,
        },
      });
    }
  });
};

function createUi(ul, todos) {
  ul.innerHTML = "";
  console.log(store.getState(), "here");
  let filterTodo = todos.todolist.filter((todo) => {
    if (todos.tab == "active" && todo.isDone == false) {
      return todo;
    } else if (todos.tab == "complete" && todo.isDone == true) {
      return todo;
    } else if (todos.tab == "all") {
      return todo;
    }
  });
  leftList = filterTodo.filter((todo) => !todo.isDone);
  // {
  //   console.log(leftList.length, "check theb item");
  // }
  left.innerHTML = `${leftList.length} items left`;
  filterTodo.forEach((todo) => {
    let li = document.createElement("li");
    let p = document.createElement("p");
    let spanX = document.createElement("span");
    let checkInput = document.createElement("input");
    checkInput.type = "checkbox";
    checkInput.checked = todo.isDone;
    p.classList.add("para");

    li.classList.add("li_styles");
    spanX.className = "remove_items";
    spanX.innerHTML = "X";
    spanX.addEventListener("click", () => {
      store.dispatch({
        type: DELETE_TODO,
        id: todo.id,
      });
    });
    if (todo.isDone) p.style.textDecoration = "line-through";
    checkInput.addEventListener("click", () => {
      store.dispatch({
        type: TOGGLE_TODO,
        id: todo.id,
        isDone: todo.isDone,
      });
    });
    p.innerHTML = todo.text;
    p.addEventListener("dblclick", (e) => handleEdit(e, todo.id));
    li.append(checkInput, p, spanX);
    ul.append(li);
  });
}

store.subscribe(() => createUi(ul, store.getState()));

add.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    const text = event.target.value;
    store.dispatch({
      type: ADD_TODO,
      text,
    });
    event.target.value = "";
  }
});

all.addEventListener("click", (e) => {
  // console.log("all");
  store.dispatch({
    type: ALL_TODO,
  });
});

active.addEventListener("click", (e) => {
  // console.log("check the event");
  store.dispatch({
    type: ACTIVE_TODO,
  });
});

completed.addEventListener("click", (e) => {
  // console.log("check the event");
  store.dispatch({
    type: COMPLETE_TODO,
  });
});

clear.addEventListener("click", (e) => {
  // console.log("check the event");
  store.dispatch({
    type: CLEAR_TODO,
  });
});
