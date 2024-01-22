import React, { useRef, useEffect, useState, forwardRef } from "react";
import { useMediaQuery } from 'react-responsive';
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { setSelectAll, sortSchedule } from "../../features/todoSlice";
import { useSort } from "../../hooks/useSort";
import ActiveSchedule from "./ActiveSchedule"
import EmptySchedule from "./EmptySchedule";

const Loading = () => 
{
    return (
        <span className="loading loading-bars loading-lg text-info col-span-full justify-self-center mx-auto"></span>
    )
}

const Pagination = ({ disabledPrevious, disabledNext, action }) => 
{
    return (
        <div className="join grid grid-cols-2 col-span-4 col-start-5 gap-y-2">
            <button className={"join-item btn btn-sm lg:btn-md btn-outline " + (disabledPrevious ? " btn-disabled " : " btn-info ")} onClick={() => action(-1)} disabled={disabledPrevious}>Previous</button>
            <button className={"join-item btn btn-sm lg:btn-md btn-outline " + (disabledNext ? " btn-disabled " : " btn-info ")} onClick={() => action(1)} disabled={disabledNext}>Next</button>
        </div>
    )
}

const ControlButtons = forwardRef((props, ref) =>
{
    const dispatch = useDispatch();
    const outsideClick = useRef();

    const MarkAllAsFinished = () =>
    {
        dispatch(setSelectAll())
        document.getElementById("modal-maf").checked = true;
    }

    const DeleteAllSchedule = () =>
    {
        dispatch(setSelectAll())
        document.getElementById("modal-delete").checked = true;
    }

    const SortActiveSchedule = (event) =>
    {
        dispatch(sortSchedule({ todoType: 'active-todos', sortType: event.target.innerText.toString().toLowerCase() }));
        document.querySelector(`details[id=sort-active-schedules]`).removeAttribute('open')
    }

    useEffect(() =>
    {
        const HandleOutsideClick = (event) => 
        {
            if (outsideClick.current && !outsideClick.current.contains(event.target))
            {
                outsideClick.current.removeAttribute('open')
            }
        }

        document.addEventListener('click', (e) => HandleOutsideClick(e))

        return document.removeEventListener('click', HandleOutsideClick)
    }, [])

    return (
        <div className={(props.activeTab === 1 ? "flex justify-between items-center px-4 lg:px-6" : "hidden")}>

            <details id="sort-active-schedules" className="dropdown dropdown-right dropdown-end" ref={outsideClick}>
                <summary className="btn btn-sm lg:btn-md btn-ghost text-info" disabled={props.isDisabled} >
                    <i className="fa fa-arrow-up-short-wide"></i>
                    <span className="hidden lg:block">Sort</span>
                </summary>
                <ul className="menu dropdown-content bg-info/20 hover:text-accent-content rounded-lg w-fit">
                    <li onClick={(e) => SortActiveSchedule(e)}>
                        <button>Title</button>
                    </li>
                    <li onClick={(e) => SortActiveSchedule(e)}>
                        <button>Deadline</button>
                    </li>
                </ul>
            </details>

            <div ref={ref} className="space-x-2">
                <button className="btn btn-sm lg:btn-md btn-ghost text-success" disabled={props.isDisabled} onClick={MarkAllAsFinished}>
                    <i className="fa fa-check-double"></i>
                    <span className="hidden lg:block">Mark All As Finished</span>
                </button>
                <button className="btn btn-sm lg:btn-md btn-ghost text-error" disabled={props.isDisabled} onClick={DeleteAllSchedule}>
                    <i className="fa fa-ban"></i>
                    <span className="hidden lg:block">Delete All</span>
                </button>
            </div>

        </div>
    )
})

const ActiveSection = ({ activeTab }) =>
{
    const [loading, setLoading] = useState(true);
    const isMobile = useMediaQuery({ query: `(max-width: 768px)` });
    const controlButtons = useRef();
    const todosSelector = useSelector(createSelector([(state) => state.todo], todo => todo.todos.filter(each => !each.isFinished)))
    const sortSelector = useSelector(createSelector(state => state.todo, sort => sort.sortBy.activeTodos))
    const activeTodos = useSort(todosSelector, sortSelector, ActiveSchedule)

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = Math.ceil(activeTodos.length / itemsPerPage);

    const HandlePagination = (page) =>
    {
        currentPage + page > 0 && setCurrentPage(prevPage => prevPage + page)
    }

    // PAGINATION EFFECT
    useEffect(() =>
    {
        if (controlButtons.current)
        {
            controlButtons.current.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
        }

        // MOVE TO PREVIOUS PAGE IF CURRENT PAGE HAS ONLY 1 TODO AND ALREADY MARKED AS FINISHED / DELETED
        if (activeTodos.length % itemsPerPage === 0 && currentPage > 1 && startIndex >= activeTodos.length)
        {
            setCurrentPage(currentPage - 1)
        }

        return () => { }
    }, [currentPage, startIndex, activeTodos.length])

    // SORT & TAB EFFECT
    useEffect(() =>
    {
        activeTodos.length > 6 && setLoading(true);

        const timeout = setTimeout(() =>
        {
            setLoading(false)
        }, Math.floor(Math.random() * 1000));

        return () => { clearTimeout(timeout) }
    }, [activeTab, sortSelector, activeTodos.length])

    // SCREEN WIDTH & TAB EFFECT
    useEffect(() =>
    {
        if (activeTab === 1 && isMobile)
        {
            document.getElementById('active-section').classList.add("bg-info/20", "backdrop-blur")
        }
        else if (activeTab === 1 && !isMobile)
        {
            document.getElementById('active-section').classList.remove("bg-info/20", "backdrop-blur")
        }

        return () => { }
    }, [activeTab, isMobile])

    if (activeTodos.length !== 0)
    {
        loading ? controlButtons.disabled = true : controlButtons.disabled = false;

        return (
            <div id="active-section" className={(activeTab === 1 ? "py-5 space-y-10 rounded-md border-x-2 border-info/70" : "hidden")}>
                <ControlButtons ref={controlButtons} activeTab={activeTab} isDisabled={controlButtons.disabled} />

                <div className={(activeTab === 1 ? "flex flex-wrap flex-col md:grid md:grid-cols-3 md:gap-y-6 px-4 lg:px-2" : "")}>
                    {
                        loading ? <Loading /> : activeTodos.slice(startIndex, endIndex)
                    }
                </div>

                {!loading && <p className="flex justify-center text-sm text-info">Page : {currentPage} of {totalPages}</p>}

                <div className="flex justify-center flex-wrap md:grid md:grid-cols-12 md:justify-items-center px-4 lg:px-6 !mt-2">
                    {
                        !loading && <Pagination disabledPrevious={currentPage === 1} disabledNext={currentPage === totalPages} action={(page) => HandlePagination(page)} />
                    }
                </div>
            </div>
        )
    }
    else
    {
        controlButtons.disabled = true;

        return (
            <div id="active-section" className={(activeTab === 1 ? "py-5" : "hidden")}>
                <ControlButtons activeTab={activeTab} isDisabled={controlButtons.disabled} />

                <div className={(activeTab === 1 ? "flex flex-wrap px-4 lg:px-2" : "hidden")}>
                    <EmptySchedule classList={"info"} />
                </div>
            </div>
        )
    }
}

export default ActiveSection