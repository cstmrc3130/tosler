import React from "react";

export default function Logo()
{
    return (
        <figure id="app-logo" className="flex basis-full lg:basis-2/4 gap-4 lg:justify-start items-center">
            <h1 className="btn btn-ghost font-bold text-xl md:text-3xl text-info px-3">
                TOSLER
                <span className="relative">
                    <span className="flex absolute -top-5 -right-[.6rem]">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-info opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-info"></span>
                    </span>
                </span>
            </h1>

        </figure>
    )
}