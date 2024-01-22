import React, { useRef, useEffect, useState, forwardRef } from "react";
import { useMediaQuery } from 'react-responsive';
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { setSelectAll, sortSchedule } from "../../features/todoSlice";
import { useSort } from "../../hooks/useSort";
import InactiveSchedule from "./InactiveSchedule"
import EmptySchedule from "./EmptySchedule";

const Loading = () => 
{
    return (
        <span className="loading loading-bars loading-lg text-neutral-content col-span-full justify-self-center mx-auto"></span>
    )
}

const Pagination = ({ disabledPrevious, disabledNext, action }) => 
{
    return (
        <div className="join grid grid-cols-2 col-span-4 col-start-5">
            <button className={"join-item btn btn-sm lg:btn-md btn-outline " + (disabledPrevious ? " btn-disabled " : " btn-neutral ")} onClick={() => action(-1)} disabled={disabledPrevious}>Previous</button>
            <button className={"join-item btn btn-sm lg:btn-md btn-outline " + (disabledNext ? " btn-disabled " : " btn-neutral ")} onClick={() => action(1)} disabled={disabledNext}>Next</button>
        </div>
    )
}

const ControlButtons = forwardRef((props, ref) =>
{
    const dispatch = useDispatch();
    const outsideClick = useRef();

    const DeleteAllSchedule = () =>
    {
        dispatch(setSelectAll())
        document.getElementById("modal-delete").checked = true;
    }

    const SortInactiveSchedule = (event) =>
    {
        dispatch(sortSchedule({ todoType: 'inactive-todos', sortType: event.target.innerText.toString().toLowerCase() }));
        document.querySelector(`details[id=sort-inactive-schedules]`).removeAttribute('open')
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
        <div className={(props.activeTab === 2 ? "flex justify-between items-center px-4 lg:px-6" : "hidden")}>

            <details id="sort-inactive-schedules" className="dropdown dropdown-right dropdown-end" ref={outsideClick}>
                <summary className="btn btn-sm lg:btn-md btn-ghost" disabled={props.isDisabled}>
                    <i className="fa fa-md fa-arrow-up-short-wide"></i>
                    <span className="hidden lg:block">Sort</span>
                </summary>
                <ul className="menu dropdown-content bg-neutral/20 hover:text-accent-content rounded-lg w-fit">
                    <li onClick={(e) => SortInactiveSchedule(e)}>
                        <button>Title</button>
                    </li>
                    <li onClick={(e) => SortInactiveSchedule(e)}>
                        <button>Deadline</button>
                    </li>
                </ul>
            </details>

            <div ref={ref} className="space-x-2">
                <button className="btn btn-sm lg:btn-md btn-ghost text-error" disabled={props.isDisabled} onClick={DeleteAllSchedule}>
                    <i className="fa fa-ban"></i>
                    <span className="hidden lg:block">Delete All</span>
                </button>
            </div>

        </div>
    )
})

const InactiveSection = ({ activeTab }) =>
{
    const [loading, setLoading] = useState(true)
    const isMobile = useMediaQuery({ query: `(max-width: 768px)` });
    const controlButtons = useRef();
    const todosSelector = useSelector(createSelector([(state) => state.todo], todo => todo.todos.filter(each => each.isFinished)))
    const sortSelector = useSelector(createSelector(state => state.todo, sort => sort.sortBy.inactiveTodos))
    const inactiveTodos = useSort(todosSelector, sortSelector, InactiveSchedule)

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = Math.ceil(inactiveTodos.length / itemsPerPage);

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
        if (inactiveTodos.length % itemsPerPage === 0 && currentPage > 1 && startIndex >= inactiveTodos.length)
        {
            setCurrentPage(currentPage - 1)
        }

        return () => { }
    }, [currentPage, startIndex, inactiveTodos.length])

    // SORT & TAB EFFECT
    useEffect(() =>
    {
        inactiveTodos.length > 6 && setLoading(true);

        const timeout = setTimeout(() =>
        {
            setLoading(false)
        }, Math.floor(Math.random() * 1000));

        return () => { clearTimeout(timeout) }
    }, [activeTab, sortSelector, inactiveTodos.length])

    // SCREEN WIDTH & TAB EFFECT
    useEffect(() =>
    {
        if (activeTab === 2 && isMobile)
        {
            document.getElementById('inactive-section').classList.add("bg-neutral/20", "backdrop-blur")
        }
        else if (activeTab === 2 && !isMobile)
        {
            document.getElementById('inactive-section').classList.remove("bg-neutral/20", "backdrop-blur")
        }

        return () => { }
    }, [activeTab, isMobile])

    if (inactiveTodos.length !== 0)
    {
        loading ? controlButtons.disabled = true : controlButtons.disabled = false;

        return (
            <div id="inactive-section" className={(activeTab === 2 ? "py-5 space-y-10 rounded-md border-x-2 border-neutral/70" : "hidden")}>
                <ControlButtons ref={controlButtons} activeTab={activeTab} isDisabled={controlButtons.disabled} />

                <div className={(activeTab === 2 ? "flex flex-wrap flex-col md:grid md:grid-cols-3 md:gap-y-10 px-4 lg:px-2" : "")}>
                    {
                        loading ? <Loading /> : inactiveTodos.slice(startIndex, endIndex)
                    }
                </div>

                {!loading && <p className="flex justify-center text-sm text-neutral-content">Page : {currentPage} of {totalPages}</p>}

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
            <div id="inactive-section" className={(activeTab === 2 ? "py-5" : "hidden")}>
                <ControlButtons activeTab={activeTab} isDisabled={controlButtons.disabled} />

                <div className={(activeTab === 2 ? "flex flex-wrap px-4 lg:px-2" : "hidden")}>
                    <EmptySchedule classList={"base-content"} />
                </div>
            </div>
        )
    }
}

export default InactiveSection