import React, { useContext } from "react";
import { ShepherdTourContext } from "react-shepherd";
import { useDispatch } from "react-redux";
import { useMediaQuery } from 'react-responsive';
import { prepareModalData } from "../../features/todoSlice"
import { useCountdown } from "../../hooks/useCountdown";

const ActiveSchedule = ({ id, title, description, deadline }) =>
{
    const tour = useContext(ShepherdTourContext);

    const isMobile = useMediaQuery({ query: `(max-width: 768px)` });
    const dispatch = useDispatch();
    const [days, hours, minutes, seconds] = useCountdown(deadline)

    const ViewDetail = () =>
    {
        dispatch(prepareModalData({ id: id, title: title, description: description, deadline: deadline }))

        if(!tour.isActive())
        {
            document.getElementById("modal-ecra").checked = true;
        } 
    }

    const Delete = (e) =>
    {
        e.stopPropagation()

        dispatch(prepareModalData({ id: id, title: title, description: description, deadline: deadline }))

        document.getElementById("modal-delete").checked = true;
    }

    const MarkAsFinished = (e) =>
    {
        e.stopPropagation()
        e.preventDefault()

        dispatch(prepareModalData({ id: id, title: title, description: description, deadline: deadline }))

        document.getElementById("modal-maf").checked = true;

        tour.isActive() && tour.next()
    }

    if (isMobile)
    {
        return (
            <>
                <article id={id} className="relative flex basis-full justify-between items-center gap-4 rounded-lg px-2 py-2 cursor-pointer bg-info-content/70 transition-all duration-200 hover:-translate-y-1" onClick={ViewDetail}>
                    {days === 0 && hours === 0 && minutes === 0 && seconds === 0 && <div className="absolute -z-10 inset-0 motion-safe:animate-[pulse_2s_ease-in-out_infinite] ring-2 ring-offset-2 ring-offset-error-content ring-error/50 rounded-lg"></div>}
                    <input id={id + '-mark-as-finished'} type="checkbox" className="checkbox checkbox-success" title="Mark as finished" onClick={MarkAsFinished} />

                    <div className="text-left basis-[75%]">
                        <h1 className="text-xl font-semibold px-2 line-clamp-1 text-neutral-content">{title}</h1>
                        <div className={"flex gap-1 px-2 py-1 mt-2 " + ((days > 0 && hours >= 0) || (days === 0 && hours >= 4) ? "text-success " : "") + (days === 0 && hours > 0 && hours <= 3 && " text-warning ") + (days === 0 && hours === 0 && minutes >= 0 && minutes <= 59 && " text-error ")}>
                            {days === 0 && hours === 0 && minutes === 0 && seconds === 0 ? <div className="text-sm">Time's up!</div> :
                                <>
                                    <div>
                                        <span className="countdown text-lg">
                                            <span className="font-mono" style={{ "--value": days }}></span>
                                        </span>
                                        <span className="text-xs font-mono">days</span>
                                    </div>
                                    <div>
                                        <span className="countdown text-lg">
                                            <span className="font-mono" style={{ "--value": hours }}></span>
                                        </span>
                                        <span className="text-xs font-mono">hours</span>
                                    </div>
                                    <div>
                                        <span className="countdown text-lg">
                                            <span className="font-mono" style={{ "--value": minutes }}></span>
                                        </span>
                                        <span className="text-xs font-mono">min</span>
                                    </div>
                                    <div>
                                        <span className="countdown text-lg">
                                            <span className="font-mono" style={{ "--value": seconds }}></span>
                                        </span>
                                        <span className="text-xs font-mono">sec</span>
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    <button className="btn btn-sm btn-outline btn-error block border-none" onClick={(e) => Delete(e)}>
                        <i className="fa fa-trash-alt text-lg"></i>
                    </button>
                </article>

                <div className="divider last:hidden my-1"></div>
            </>
        )
    }
    else
    {
        return (
            <article id={id} className={"card card-compact w-11/12 mx-auto bg-info-content/70 hover:shadow-md hover:-translate-y-1 transition-all duration-200 " + ((days > 0 && hours >= 0) || (days === 0 && hours >= 4) ? "hover:shadow-info" : "") + (days === 0 && hours > 0 && hours <= 3 ? "hover:shadow-warning" : "") + (days === 0 && hours === 0 && minutes >= 0 && minutes <= 59 ? "hover:shadow-error" : "")}>
                <div className={"card-body cursor-pointer " + (tour.isActive ? "disabled" : "")} onClick={ViewDetail}>

                    <div className="card-actions justify-between">
                        <div id={id + '-mark-as-finished'} className="form-control basis-2/5">
                            <label className="cursor-pointer label px-0 pt-0" title="Mark as finished" onClick={(e) => ((!tour.isActive()) || (tour.isActive() && tour.getCurrentStep().id === "mark-todo-as-finished") ? MarkAsFinished(e) : e.preventDefault())}>
                                <input type="checkbox" className="checkbox checkbox-success" />
                                <span className="label-text text-success">Mark as finished</span>
                            </label>
                        </div>
                        {days === 0 && hours === 0 && minutes === 0 && seconds === 0 && 
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 512 512">
                                <path d="M416.07 272a160 160 0 10-160 160 160 160 0 00160-160zM142.12 91.21A46.67 46.67 0 00112 80l-2.79.08C83.66 81.62 64 104 64.07 131c0 13.21 4.66 19.37 10.88 27.23a4.55 4.55 0 003.24 1.77h.88a3.23 3.23 0 002.54-1.31L142.38 99a5.38 5.38 0 001.55-4 5.26 5.26 0 00-1.81-3.79zM369.88 91.21A46.67 46.67 0 01400 80l2.79.08C428.34 81.62 448 104 447.93 131c0 13.21-4.66 19.37-10.88 27.23a4.55 4.55 0 01-3.24 1.76h-.88a3.23 3.23 0 01-2.54-1.31L369.62 99a5.38 5.38 0 01-1.55-4 5.26 5.26 0 011.81-3.79z" fill="none" stroke="#ed6e6f" strokeMiterlimit="10" strokeWidth="32" />
                                <path fill="none" stroke="#ed6e6f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M256.07 160v112h-80M416.07 432l-40-40M96.07 432l40-40">
                                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 256.07 272" to="5 256.07 272" dur="0.15s" repeatCount="indefinite" />
                                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="5 256.07 272" to="-5 256.07 272" begin="0.15s" dur="0.15s" repeatCount="indefinite" />
                                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="-5 256.07 272" to="5 256.07 272" begin="0.3s" dur="0.15s" repeatCount="indefinite" />
                                </path>
                            </svg>
                            <div className="absolute z-10 inset-0 motion-safe:animate-[ping_2s_ease-in-out_infinite] ring-2 ring-offset-2 ring-offset-error-content ring-error/50 rounded-full"></div>
                        </div>
                        }
                    </div>

                    <h2 className="card-title line-clamp-1 text-neutral-content">{title}</h2>
                    <p className="line-clamp-1 text-neutral-content truncate max-w-[36ch] whitespace-normal">{description}</p>

                    <div className="card-actions justify-between items-center">
                        <div className={"flex gap-1 self-end " + ((days > 0 && hours >= 0) || (days === 0 && hours >= 4) ? "text-success " : "") + (days === 0 && hours > 0 && hours <= 3 ? "text-warning " : "") + (days === 0 && hours === 0 && minutes >= 0 && minutes <= 59 ? "text-error" : "")}>
                            {days === 0 && hours === 0 && minutes === 0 && seconds === 0 ? <div>Time's up!</div> :
                                <>
                                    <div>
                                        <span className="countdown text-xl">
                                            <span className="font-mono" style={{ "--value": days }}></span>
                                        </span>
                                        <span className="font-mono">days</span>
                                    </div>
                                    <div>
                                        <span className="countdown text-xl">
                                            <span className="font-mono" style={{ "--value": hours }}></span>
                                        </span>
                                        <span className="font-mono">hours</span>
                                    </div>
                                    <div>
                                        <span className="countdown text-xl">
                                            <span className="font-mono" style={{ "--value": minutes }}></span>
                                        </span>
                                        <span className="font-mono">min</span>
                                    </div>
                                    <div>
                                        <span className="countdown text-xl">
                                            <span className="font-mono" style={{ "--value": seconds }}></span>
                                        </span>
                                        <span className="font-mono">sec</span>
                                    </div>
                                </>
                            }
                        </div>
                        <button className="btn btn-sm btn-outline btn-error gap-2" onClick={(e) => !tour.isActive() && Delete(e)}>
                            <i className="fa fa-trash"></i>
                            Delete
                        </button>
                    </div>

                </div>
            </article>
        )
    }
}

export default ActiveSchedule