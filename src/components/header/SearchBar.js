import React, { createRef } from "react";
import { levenhstein } from "../../app/levenhstein"
import { prepareModalData } from "../../features/todoSlice";
import { connect } from "react-redux";

const mapStateToProps = state =>
{
    return {
        data: state.todo.todos
    };
};

const mapDispatchToProps = dispatch =>
{
    return {
        prepareModalData: (id, title, description, deadline) =>
        {
            dispatch(prepareModalData({ id: id, title: title, description: description, deadline: deadline }))
        }
    }
}

class SearchBar extends React.Component
{

    constructor(props)
    {
        super(props)

        this.outsideClick = createRef()

        this.state = {
            keyword: "",
            loading: true,
            displayedResults: 4,
            searchList: []
        }
    }

    componentDidMount()
    {
        const searchFields = document.querySelectorAll('#input-md, #input-sm');
        const searchResults = document.querySelectorAll('#search-result-md, #search-result-sm')

        document.addEventListener('click', (event) =>
        {
            // ONLY CLOSE THE DROPDOWN IF USER CLICKS OUTSIDE THE INPUT FIELD AND THE DROPDOWN
            if (this.outsideClick.current && !this.outsideClick.current.contains(event.target))
            {
                if (!Array.from(searchFields).includes(event.target))
                {
                    this.outsideClick.current.removeAttribute('open')
                }
            }
        });

        searchResults.forEach(each => 
        {
            each.addEventListener('scroll', (event) => 
            {
                console.log("Current Scroll : " + (Math.ceil(each.scrollTop + each.clientHeight)), "Max Height : " + each.scrollHeight)

                if (Math.ceil(each.scrollTop + each.clientHeight) === each.scrollHeight && !this.state.loading && this.state.displayedResults < this.state.searchList.length)
                {
                    this.setState(prevState => 
                    {
                        return {
                            displayedResults: prevState.displayedResults + Math.floor(Math.random() * 5),
                            loading: true
                        }
                    })

                    setTimeout(() =>
                    {
                        this.setState({ loading: false })
                    }, Math.random() * 1000);
                }
            });
        })
    }

    HandleSearch = (event) =>
    {
        const matchingTodos = [];
        const nonMatchingTodos = [];
        const MINIMAL_DISTANCE = 15;

        // USE CALLBACK FUNCTION TO USE THE UPDATED STATE
        (event.type === "change" || event.type === "focus") && this.setState({ keyword: event.target.value }, () => 
        {
            if (this.state.keyword !== "") 
            {
                this.setState({ searchList: [], loading: this.props.data.length > 0, displayedResults: 4 })

                setTimeout(() =>
                {
                    this.setState({ loading: false })
                }, Math.random() * 1000);

                this.props.data.length > 0 && this.props.data.forEach(todo => 
                {
                    const keyword = this.state.keyword.toLowerCase()
                    const todoTitle = todo.title.toLowerCase()

                    if (todoTitle.includes(keyword))
                    {
                        matchingTodos.push(todo)
                        matchingTodos.sort((a, b) => parseInt(a.title.length) - parseInt(b.title.length))
                        this.setState({ searchList: matchingTodos })
                    }
                    else if (levenhstein(todoTitle, keyword) <= MINIMAL_DISTANCE)
                    {
                        nonMatchingTodos.push(todo)
                        nonMatchingTodos.sort((a, b) => parseInt(a.title.length) - parseInt(b.title.length))
                        !matchingTodos.length > 0 && this.setState({ searchList: nonMatchingTodos })
                    }
                })

                document.querySelector(`details[id=${this.props.screenSize}]`).setAttribute('open', true);
            }
            else
            {
                document.querySelector(`details[id=${this.props.screenSize}]`).removeAttribute('open')
            }
        })
    }

    ViewDetail = ({ id, title, description, deadline }) =>
    {
        this.props.prepareModalData(id, title, description, deadline)

        document.getElementById("modal-ecra").checked = true;

        Array.from(document.querySelectorAll(`details[id=md], details[id=sm]`)).forEach(each =>
        {
            each.removeAttribute('open');
        })
    }

    render()
    {
        return (
            <form className="form-control" onSubmit={(e) => e.preventDefault()} >
                <div className="join justify-center relative">
                    <details className="dropdown static dropdown-start" id={this.props.screenSize} ref={this.outsideClick}>
                        <summary className="absolute btn btn-square btn-md -z-10 bg-transparent border-0 ">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 duration-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </summary>
                        <ul id={"search-result-" + this.props.screenSize} className="dropdown-content top-16 z-10 rounded-md menu flex-row w-full bg-base-100 max-h-[8.5rem] shadow-md shadow-neutral/20 overflow-y-auto overflow-x-hidden">
                            {
                                !this.state.loading ?
                                (
                                    this.state.searchList.length > 0 ?
                                    (
                                        this.state.searchList.slice(0, this.state.displayedResults).map(each =>
                                            <li key={each.id} className="basis-full " onClick={() => this.ViewDetail({ ...each })}>
                                                <button className="rounded-md line-clamp-1 whitespace-normal truncate hover:text-neutral-content hover:bg-neutral !duration-0">
                                                    <h2 className="text-sm line-clamp-1 whitespace-normal truncate ">{each.title}</h2>
                                                </button>
                                            </li>
                                        )
                                    )
                                    :
                                    (
                                        <li className="basis-full">
                                            <button className="rounded-md hover:bg-transparent pointer-events-none">
                                                <h2 className="text-sm text-error">{this.props.data.length > 0 ? "Result not found." : "No data to search."}</h2>
                                            </button>
                                        </li>
                                    )
                                )
                                :
                                (
                                    <span className="loading loading-bars loading-sm mx-auto rounded-none"></span>
                                )
                            }
                        </ul>
                    </details>

                    <input id={'input-' + this.props.screenSize} type="text" className="input bg-transparent text-base text-base-content placeholder:text-base-content focus:outline-info pl-12 ring-0 w-full" placeholder="Search..." value={this.state.keyword} onChange={(e) => this.HandleSearch(e)} onFocus={(e) => this.HandleSearch(e)} />
                </div>
            </form>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);

// P.S
// REACT STATE SHOULD NOT BE MUTATED LIKE BELOW (https://stackoverflow.com/a/40309023/19250775)
// this.state.keyword = event.target.value //