import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { deleteSchedule, deleteAllSchedule, prepareModalData, setSelectAll } from "../../features/todoSlice";
import { toast } from "react-hot-toast";

const ConfirmDeleteModal = () =>
{
    const dispatch = useDispatch();
    const selectTodo = useSelector(createSelector(state => state.todo, todo => todo.modalData))
    const selectAll = useSelector(createSelector([(state) => state.todo], (todo) => todo.selectAll));

    const ResetModal = () =>
    {
        setTimeout(() =>
        {
            selectAll ? dispatch(setSelectAll()) : dispatch(prepareModalData({ id: "", title: "", description: "", deadline: "" }));
        }, 200)
    }

    const HandleSubmit = (e) =>
    {
        e.preventDefault();

        // SUCCESS TOAST
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} alert grid-flow-col grid-cols-12 bg-error-content text-error border-error border shadow-lg w-full md:w-4/12 rounded-md justify-items-start`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6 col-span-1"><g id="SVGRepo_bgCarrier" strokeWidth="2"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20L18.4199 20.2209C18.3074 21.2337 17.4512 22 16.4321 22H7.56786C6.54876 22 5.69264 21.2337 5.5801 20.2209L4 6Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M7.34491 3.14716C7.67506 2.44685 8.37973 2 9.15396 2H14.846C15.6203 2 16.3249 2.44685 16.6551 3.14716L18 6H6L7.34491 3.14716Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M2 6H22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M10 11V16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M14 11V16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                <span className="col-span-11">{selectAll ? `All to-dos have been deleted` : `An existing to-do has been deleted`}</span>
            </div>
        ), { duration: 4000 })

        if (selectAll)
        {
            // DELETE ALL TODOS
            dispatch(deleteAllSchedule(!document.getElementById('active-section').classList.contains('hidden') ? "active-schedules" : "past-schedules"))
            dispatch(setSelectAll())
        }
        else
        {
            // DELETE SELECTED TODO AND CLEAR modalData
            dispatch(deleteSchedule())
            dispatch(prepareModalData({ id: "", title: "", description: "", deadline: "" }));
        }

        // CLOSE MODAL AFTER SUCCESSFUL SUBMIT
        document.getElementById("modal-delete").checked = false;
    }

    return (
        <>
            <input type="checkbox" id="modal-delete" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box bg-base-200 outline outline-base-200">
                    <label htmlFor="modal-delete" className="btn bg-transparent border-none absolute right-2 top-2 hover:bg-base-300 text-error" onClick={ResetModal}>✕</label>
                    <h3 className="font-bold text-xl text-error line-clamp-1">{selectAll ? `Delete All ` + (!document.getElementById('active-section').classList.contains('hidden') ? "Active" : "Past") + ` To-dos` : ("Delete " + `"${selectTodo.title}"`)}</h3>
                    <p className="py-4 text-base-content">
                        {selectAll ? `Are you sure want to permanently delete all ` + (!document.getElementById('active-section').classList.contains('hidden') ? "active" : "inactive") + ` to-dos?` : `Are you sure want to permanently delete this to-do?`}
                        <br />
                        This action is irreversible!
                    </p>
                    <div className="modal-action m-0">
                        <label className="btn btn-outline btn-error" onClick={(e) => HandleSubmit(e)}>DELETE</label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmDeleteModal;