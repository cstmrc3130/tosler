import React from "react";

const EmptySchedule = ({ classList }) =>
{
    return (
        <article className="flex basis-full justify-between items-stretch rounded-sm py-12">
            <div className="text-center basis-full mt-2">
                <i className={"fa-solid fa-list-check fa-2xl animate-pulse text-" + classList}></i>
                <h3 className={"font-normal text-base px-2 py-1 mt-2 text-" + classList}>
                    Everything is wrapped up, there is no upcoming to-dos.
                </h3>
            </div>
        </article>
    )
}

export default EmptySchedule