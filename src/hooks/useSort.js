export const useSort = (todos, sortBy, ScheduleComponent) =>
{
    if (!sortBy)
    {
        return todos.map((each) => (<ScheduleComponent key={each.id} {...each} />))
    }
    else if (sortBy === "title")
    {
        return todos.sort((a, b) =>
        {
            const itemA = a.title.toLowerCase();
            const itemB = b.title.toLowerCase();

            if (itemA < itemB)
            {
                return -1;
            }
            if (itemA > itemB)
            {
                return 1;
            }
            return 0;
        }).map(each => <ScheduleComponent key={each.id} {...each} />);
    }
    else if (sortBy === "deadline")
    {
        return todos.sort((a, b) =>
        {
            return a.deadline - b.deadline
        }).map(each => <ScheduleComponent key={each.id} {...each} />)
    }
}
