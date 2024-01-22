import { createSlice } from '@reduxjs/toolkit'

function ConvertMillisecondsToDatetimeLocal(milliseconds)
{
    const date = new Date(milliseconds);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const datetimeLocal = `${year}-${month}-${day}T${hours}:${minutes}`;

    return datetimeLocal;
}

const GenerateUUID = function ()
{
    let UUID = "";
    const hexDigits = "0123456789abcdef"

    for (let i = 0; i < 36; i++)
    {
        if (i === 8 || i === 13 || i === 18 || i === 23)
        {
            UUID += ("-");
        }
        else if (i === 14)
        {
            UUID += ("4");
        }
        else
        {
            UUID += (hexDigits[Math.floor(Math.random() * 16)]);
        }
    }

    return UUID;
}

export const todoSlice = createSlice({
    name: 'Todo List',
    initialState:
    {
        // WITHOUT PROPERTY NAME, CAN BE INVOKED WITH state.todo
        // [
        //     {
        //         id: "aabbcc"
        //     },
        //     {
        //         id: 'ddeeff'
        //     },
        //     {
        //         id: 'ddeeff'
        //     }
        // ],

        // WITH PROPERTY NAME (todos), CAN BE INVOKED WITH state.todo.todos
        todos: [],
        modalData: {
            id: "",
            title: "",
            description: "",
            deadline: "",
        },
        showNotification: false,
        selectAll: false,
        sortBy: {
            activeTodos: "",
            inactiveTodos: ""
        }
    },

    reducers: {
        addNewSchedule:
        {
            reducer(state, action)
            {
                state.todos.push(action.payload)

                // FOR LOGGING PURPOSE
                // console.log(current(state.todos))
            },
            prepare({ ...args })
            {
                return {
                    payload: {
                        // NANOID
                        // id: nanoid(),
                        ...args,
                        id: args.id ? args.id : GenerateUUID(),
                        isFinished: false,
                    }
                }
            }
        },

        editSchedule:
        {
            reducer: (state, action) =>
            {
                const { id, title, description, deadline } = action.payload;
                const index = state.todos.findIndex(each => each.id === id)

                if (index !== -1)
                {
                    state.todos[index] = { id, title, description, deadline }
                }

                if (state.todos.some(each => (each.deadline < new Date().getTime() && !each.isFinished)))
                {
                    state.showNotification = true
                }
                else
                {
                    state.showNotification = false
                }
            }
        },

        activateSchedule:
        {
            reducer(state)
            {
                const index = state.todos.findIndex(each => each.id === state.modalData.id)

                if (index !== -1)
                {
                    state.todos[index].isFinished = false;
                }
            }
        },

        finishSchedule:
        {
            reducer(state)
            {
                const index = state.todos.findIndex(each => each.id === state.modalData.id)

                if (index !== -1)
                {
                    state.todos[index].isFinished = true;
                }

                if (state.todos.some(each => (each.deadline < new Date().getTime() && !each.isFinished)))
                {
                    state.showNotification = true
                }
                else
                {
                    state.showNotification = false
                }
            }
        },

        finishAllSchedule:
        {
            reducer(state)
            {
                state.todos.map(each => 
                {
                    if (!each.isFinished)
                    {
                        each.isFinished = true;
                    }

                    return 0;
                })

                state.showNotification = false;
            }
        },

        deleteSchedule(state) 
        {
            state.todos = state.todos.filter(each => each.id !== state.modalData.id)

            if (state.todos.some(each => (each.deadline < new Date().getTime() && !each.isFinished)))
            {
                state.showNotification = true
            }
            else
            {
                state.showNotification = false
            }
        },

        deleteAllSchedule(state, action)
        {
            const todoType = action.payload;

            if (todoType === "active-schedules")
            {
                state.todos = state.todos.filter(each => each.isFinished === true)
                state.showNotification = false;
            }
            else
            {
                state.todos = state.todos.filter(each => each.isFinished === false)
            }
        },

        prepareModalData: (state, action) =>
        {
            const { id, title, description, deadline } = action.payload;

            // VARIOUS WAYS TO UPDATE NON-ARRAY (SINGLE OBJECT) STATE
            Object.assign(state.modalData, { id, title, description, deadline: deadline !== "" ? ConvertMillisecondsToDatetimeLocal(deadline) : "" })

            // state.modalData = {...state.modalData, id, title, description, deadline}

            // state.modalData.id = id;
            // state.modalData.title = title;
            // state.modalData.description = description;
            // state.modalData.deadline = deadline;
        },

        sortSchedule: (state, action) =>
        {
            const { todoType, sortType } = action.payload;

            todoType === "active-todos" ? state.sortBy.activeTodos = sortType : state.sortBy.inactiveTodos = sortType
        },

        setShowNotification(state)
        {
            if (state.showNotification === false)
            {
                state.showNotification = true
            }
        },

        setSelectAll(state)
        {
            if (state.selectAll === false)
            {
                state.selectAll = true;
            }
            else
            {
                state.selectAll = false;
            }
        },

        resetState(state)
        {
            state.todos = state.todos.filter(each => each.id !== 'a1-test-todo')

            if (state.modalData.id === "a1-test-todo")
            {
                state.modalData.id = "";
                state.modalData.title = "";
                state.modalData.description = "";
                state.modalData.deadline = "";
            }
        }
    },
})

// ACTION CREATORS ARE GENERATED AUTOMATICALLY FOR EACH CASE REDUCER FUNCTION
export const {
    addNewSchedule,
    editSchedule,
    deleteSchedule,
    activateSchedule,
    finishSchedule,
    deleteAllSchedule,
    finishAllSchedule,
    prepareModalData,
    sortSchedule,
    setShowNotification,
    setSelectAll,
    resetState
} = todoSlice.actions

export default todoSlice.reducer

// P.S
// store, reducer, action (https://stackoverflow.com/a/66653464/19250775)
// REDUCER WITH prepare CALLBACK (https://redux-toolkit.js.org/api/createSlice#customizing-generated-action-creators)
// HOW TO UPDATE STATE WITH MULTIPLE PROPERTIES i.e: todos, modalData (https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state)
// VARIOUS WAYS TO EMPTY AN ARRAY
// state.todos.length = 0;
// state.todos.splice(0, state.todos.length);
// state.todos = [];