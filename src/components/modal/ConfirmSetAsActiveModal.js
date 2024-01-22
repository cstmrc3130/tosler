import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { activateSchedule, prepareModalData } from "../../features/todoSlice";
import { toast } from "react-hot-toast";
import { createSelector } from "@reduxjs/toolkit";

const ConfirmSetAsActiveModal = () =>
{
    const dispatch = useDispatch();
    const selectTodo = useSelector(createSelector(state => state.todo, todo => todo.modalData))

    const ResetModal = () =>
    {
        dispatch(prepareModalData({ id: "", title: "", description: "", deadline: "" }));
    }

    const HandleSubmit = (e) =>
    {
        e.preventDefault();

        // SUCCESS TOAST
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} alert grid-flow-col grid-cols-12 bg-warning-content text-warning border-warning border shadow-lg w-full md:w-4/12 rounded-md justify-items-start`}>
                <svg className="stroke-current flex-shrink-0 h-6 w-6 col-span-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="2"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" strokeWidth="2"></path> <path d="M12 7L12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M21 4L20 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <span className="col-span-11">{`An existing to-do is set as active`}</span>
            </div>
        ), { duration: 4000 })

        // DELETE SELECTED TODO AND CLEAR modalData
        dispatch(activateSchedule())
        dispatch(prepareModalData({ id: "", title: "", description: "", deadline: "" }));

        // CLOSE MODAL AFTER SUCCESSFUL SUBMIT
        document.getElementById("modal-saa").checked = false;
    }

    return (
        <>
            <input type="checkbox" id="modal-saa" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box bg-base-200 outline outline-base-200">
                    <label htmlFor="modal-saa" className="btn bg-transparent border-none absolute right-2 top-2 hover:bg-base-300 text-warning" onClick={ResetModal}>✕</label>
                    <h3 className="font-bold text-xl text-warning">{`Activate ` + `"${selectTodo.title}"`}</h3>
                    <p className="py-4 text-slate-300">
                        Are you sure want to set this to-do as active?
                        <br />
                        You can later edit the content in active section.
                    </p>
                    <div className="modal-action m-0">
                        <label className="btn btn-outline btn-warning" onClick={(e) => HandleSubmit(e)}>SET AS ACTIVE</label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmSetAsActiveModal;