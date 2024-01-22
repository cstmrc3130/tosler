import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { finishSchedule, finishAllSchedule, prepareModalData, setSelectAll } from "../../features/todoSlice";
import { toast } from "react-hot-toast";
import { ShepherdTourContext } from "react-shepherd";

const ConfirmMarkAsFinishedModal = () =>
{
    const tour = useContext(ShepherdTourContext)

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
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} alert grid-flow-col grid-cols-12 bg-success-content text-success border-success border shadow-lg w-full md:w-4/12 rounded-md justify-items-start`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 col-span-1" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="col-span-11">{selectAll ? `All to-dos are marked as finished` : `An existing to-do is marked as finished`}</span>
            </div>
        ), { duration: 4000 })

        if (selectAll)
        {
            // FINISH ALL TODOS
            dispatch(finishAllSchedule())
            dispatch(setSelectAll())
        }
        else
        {
            // FINISH SELECTED TODO AND CLEAR modalData
            dispatch(finishSchedule())
            dispatch(prepareModalData({ id: "", title: "", description: "", deadline: "" }));
        }

        // CLOSE MODAL AFTER SUCCESSFUL SUBMIT
        document.getElementById("modal-maf").checked = false;

        tour.isActive() && tour.next()
    }

    return (
        <>
            <input type="checkbox" id="modal-maf" className="modal-toggle" />
            <div className="modal">
                <div id="modal-maf-content" className="modal-box bg-base-200 outline outline-base-200">
                    <label htmlFor="modal-maf" className={"btn bg-transparent border-none absolute right-2 top-2 hover:bg-base-300 text-success " + (tour.isActive() ? " btn-disabled " : "")} onClick={ResetModal}>✕</label>
                    <h3 className="font-bold text-xl text-success">{selectAll ? `Finish All Active To-dos` : ("Finish " + `"${selectTodo.title}"`)} </h3>
                    <p className="py-4 text-base-content">
                        {selectAll ? `Are you sure want to mark all to-dos as finished??` : `Are you sure want to mark this to-do as finished?`}
                        <br />
                        You can later retrieve {selectAll ? `this to-do` : 'these to-dos'} from past schedules section.
                    </p>
                    <div className="modal-action m-0">
                        <label className="btn btn-outline btn-success" onClick={(e) => HandleSubmit(e)}>MARK AS FINISHED</label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmMarkAsFinishedModal;