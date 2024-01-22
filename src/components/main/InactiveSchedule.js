import React from "react";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { prepareModalData } from "../../features/todoSlice";

function FormatMilliseconds(milliseconds) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const date = new Date(milliseconds);
    const year = date.getFullYear();
    const month = monthsOfYear[date.getMonth()];
    const day = daysOfWeek[date.getDay()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const datetimeLocal = `${day}, ${date.getDate()} ${month} ${year} at ${hours}:${minutes}`;

    return datetimeLocal;
}

const InactiveSchedule = ({id, title, description, deadline}) =>
{
    const isMobile = useMediaQuery({ query: `(max-width: 768px)` });
    const dispatch = useDispatch();

    const Delete = (e) =>
    {
        e.stopPropagation()

        dispatch(prepareModalData({id: id, title: title, description: description, deadline: deadline }))

        document.getElementById("modal-delete").checked = true;
    }

    const SetAsActive = (e) =>
    {
        e.stopPropagation()
        e.preventDefault()

        dispatch(prepareModalData({id: id, title: title, description: description, deadline: deadline }))

        document.getElementById("modal-saa").checked = true;
    }

    if (isMobile)
    {
        return (
            <>
                <article id={id} className="flex basis-full justify-between items-center gap-4 bg-neutral/70 rounded-lg px-2 py-2 cursor-pointer hover:-translate-y-1 transition-all duration-200 ">
                    <input type="checkbox" className="checkbox checkbox-warning" title="Set as Active" onClick={SetAsActive}/>
                    <div className="text-left basis-[75%]">
                        <h1 className="text-xl font-semibold px-2 line-clamp-1 text-neutral-content">{title}</h1>
                        <div className={"flex gap-1 px-2 py-1 mt-2"}>
                            <span className="font-mono text-sm ">{FormatMilliseconds(deadline)}</span>
                        </div>
                    </div>
                    <button className="btn btn-sm btn-outline btn-error block border-none" onClick={Delete}>
                        <i className="fa fa-trash text-lg"></i>
                    </button>
                </article>
                <div className="divider last:hidden my-1"></div>
            </>
        )
    }
    else
    {
        return (
            <article id={id} className="card card-compact w-11/12 mx-auto bg-neutral/70 hover:shadow-md hover:shadow-neutral-content hover:-translate-y-1 transition-all duration-200 ">
                <div className="card-body cursor-pointer">

                    <div className="card-actions justify-start">
                        <div className="form-control basis-2/5">
                            <label className="cursor-pointer label justify-start gap-x-2 px-0 pt-0">
                                <input type="checkbox" className="checkbox checkbox-warning" onClick={(e) => SetAsActive(e)}/>
                                <span className="label-text text-warning">Set as active</span>
                            </label>
                        </div>
                    </div>

                    <h2 className="card-title line-clamp-1 text-neutral-content">{title}</h2>
                    <p className="line-clamp-1 text-neutral-content truncate max-w-[36ch] whitespace-normal">{description}</p>

                    <div className="card-actions justify-between items-center">
                        <div className={"flex gap-1 self-end"}>
                            <span className="text-sm lg:text-xs font-mono line-clamp-1 truncate max-w-[32ch] whitespace-normal text-neutral-content">{FormatMilliseconds(deadline)}</span>
                        </div>
                        <button className="btn btn-sm btn-outline btn-error gap-2" onClick={(e) => Delete(e)}>
                            <i className="fa fa-trash-can"></i>
                            Delete
                        </button>
                    </div>

                </div>
            </article>
        )
    }
}

export default InactiveSchedule