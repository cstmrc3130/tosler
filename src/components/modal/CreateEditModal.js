import React, { useState, useEffect, useContext } from "react";
import { ShepherdTourContext } from 'react-shepherd'
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { addNewSchedule, editSchedule, prepareModalData } from "../../features/todoSlice";
import { Toaster, toast } from "react-hot-toast";

const CreateEditModal = () =>
{
    const tour = useContext(ShepherdTourContext);

    const [title, SetTitle] = useState("");
    const [titleIsInvalid, SetTitleValidation] = useState(false);

    const [description, SetDescription] = useState("");
    const [descriptionIsInvalid, SetDescriptionValidation] = useState(false);

    const [deadline, SetDeadline] = useState("");
    const [deadlineIsInvalid, SetDeadlineValidation] = useState(false);

    const dispatch = useDispatch();
    const modalData = useSelector(createSelector([(state) => state.todo], (todo) => todo.modalData))
    const selectTodo = useSelector(createSelector(state => state.todo, todo => modalData.id && todo.todos.filter(each => each.id === modalData.id)))

    // UPDATE STATE AFTER AN ACTION CREATOR IS DISPATCHED TO MODIFY modalData
    // WILL KEEP ON RUNNING IF THE DEPENDENCIES CHANGE (https://stackoverflow.com/a/54924104/19250775)
    useEffect(() =>
    {
        SetTitle(modalData.title);
        SetDescription(modalData.description);
        SetDeadline(modalData.deadline);

        return () => { };
    }, [modalData]);

    const ResetModal = () =>
    {
        setTimeout(() =>
        {
            dispatch(prepareModalData({ id: "", title: "", description: "", deadline: "" }));
        }, 200)

        // INVALIDATE INPUT FIELDS
        SetTitleValidation(false);
        SetDescriptionValidation(false);
        SetDeadlineValidation(false);
    }

    const ValidateTitle = (e) =>
    {
        if (e.length <= 50)
        {
            SetTitle(e)
            SetTitleValidation(false);
        }
        else
        {
            // e.substring(1, 49)
            SetTitle(prevState => prevState)
        }
    }

    const ValidateDescription = (e) =>
    {
        if (e.length >= 0)
        {
            SetDescription(e)
            SetDescriptionValidation(false)
        }
    }

    const ValidateDeadline = (e) => 
    {
        if (new Date(e).getTime() > new Date().getTime())
        {
            SetDeadline(e)
            SetDeadlineValidation(false)
        }
        else
        {
            SetDeadline(prevState => prevState)
            SetDeadlineValidation(true)
        }
    }

    const HandleSubmit = (e) =>
    {
        e.preventDefault();

        if (new RegExp('^[a-zA-Z0-9\-\_ ]{1,50}$').test(title) && new RegExp("^(?=[a-zA-Z0-9~@#$^*()_+=[\\\]{}|\\,.?: -]+$)(?!.*[<>'\"/;`%])").test(description) && deadline != "" && !deadlineIsInvalid && new Date(deadline).getTime() > new Date().getTime())
        {
            // SUCCESS TOAST
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} alert grid-flow-col grid-cols-12 ${modalData.id != "" ? "bg-info-content text-info border-info" : "bg-success-content text-success border-success"} border shadow-lg w-full md:w-4/12 rounded-md justify-items-start`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 col-span-1" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="col-span-11">{`${modalData.id != "" ? "An existing to-do has been updated" : "A new to-do has been created"}`}</span>
                </div>
            ), { duration: 4000 })

            // UPDATE TO-DO IF AN ID IS PASSED AS A PARAMETER OR ELSE CREATE A NEW TO-DO
            if (modalData.id === "")
            {
                dispatch(addNewSchedule({ id: tour.isActive() && `a1-test-todo`, title: title, description: description, deadline: new Date(deadline).getTime() }))
            }
            else
            {
                dispatch(editSchedule({ id: modalData.id, title: title, description: description, deadline: new Date(deadline).getTime() }))
                dispatch(prepareModalData({ id: "", title: "", description: "", deadline: "" }));
            }

            // CLEAR AND INVALIDATE INPUT FIELDS
            SetTitle("");
            SetDescription("");
            SetDeadline("");
            SetTitleValidation(false);
            SetDescriptionValidation(false);
            SetDeadlineValidation(false);

            // CLOSE MODAL AFTER SUCCESSFUL SUBMIT
            document.getElementById("modal-ecra").checked = false;

            // IF TOUR IS ACTIVE, THEN GO TO NEXT STEP
            tour.isActive() && tour.next()
        }
        else
        {
            // TITLE VALIDATION
            if (!new RegExp('^[a-zA-Z0-9\-\_ ]{1,50}$').test(title))
            {
                SetTitleValidation(true)
            }

            // DESCRIPTION VALIDATION
            if (!new RegExp("^(?=[a-zA-Z0-9~@#$^*()_+=[\\\]{}|\\,.?: -]+$)(?!.*[<>'\"/;`%])").test(description))
            {
                SetDescriptionValidation(true)
            }

            // DEADLINE VALIDATION
            if (deadlineIsInvalid || deadline == "" || new Date(deadline).getTime() < new Date().getTime())
            {
                SetDeadlineValidation(true)
            }
        }
    }

    return (
        <>
            <Toaster position="bottom-left" />

            <input type="checkbox" id="modal-ecra" className="modal-toggle" />
            <div className="modal">
                <div id="modal-ecra-content" className="modal-box bg-base-200 outline outline-base-200">
                    <label htmlFor="modal-ecra" className={"btn bg-transparent border-none absolute right-2 top-2 hover:bg-base-300 text-info"} onClick={ResetModal}>✕</label>
                    <h3 className="font-bold text-xl text-info">{`${modalData.id != "" ? "Edit" : "Create New"} To-do`} </h3>
                    <div className="form-control w-full max-w-xs my-4">

                        {/* TITLE */}
                        <label className="label px-0 ">
                            <span className="label-text text-base-content">Title</span>
                            <i className="text-xs text-info/90">{50 - title.length} characters left</i>
                        </label>
                        <input type="text" className={"input " + (titleIsInvalid ? "input-error" : "input-info")} value={title} onInput={(e) => ValidateTitle(e.target.value)} />
                        <span className={"text-sm text-error " + (!titleIsInvalid ? "hidden" : "")}>Title is required and can only contain preserved characters (_-)</span>
                        {/* TITLE */}



                        {/* DESCRIPTION */}
                        <label className="label px-0 mt-2">
                            <span className="label-text text-base-content">Description</span>
                        </label>
                        <textarea className={"textarea textarea-md " + (descriptionIsInvalid ? "textarea-error" : "textarea-info")} value={description} onChange={(e) => ValidateDescription(e.target.value)}></textarea>
                        <span className={"text-sm text-error " + (!descriptionIsInvalid ? "hidden" : "")}>{`Description is required and must not contain invalid characters (<>'\"/;\`%)`}</span>
                        {/* DESCRIPTION */}



                        {/* DEADLINE */}
                        <label className="label px-0 mt-2">
                            <span className="label-text text-base-content">Deadline</span>
                        </label>
                        <input type="datetime-local" className={"input " + (deadlineIsInvalid ? "input-error" : "input-info")} value={deadline} onChange={(e) => ValidateDeadline(e.target.value)}></input>
                        <span className={"text-sm text-error " + (!deadlineIsInvalid ? "hidden" : "")}>Deadline is required and must be in the future</span>
                        {/* DEADLINE */}

                    </div>
                    <div className="modal-action m-0">
                        <button className={"btn " + (selectTodo === "" || selectTodo !== "" && !selectTodo[0].isFinished ? " btn-outline btn-info " : " btn-disabled ")} onClick={(e) => (selectTodo === "" || selectTodo !== "" && !selectTodo[0].isFinished ? HandleSubmit(e) : "")}>Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateEditModal;