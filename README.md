# Albums Challenge

Your challenge is to finish this web app which lists top 100 music albums from iTunes with search and filter functionality.

To start webserver run: `node ./dev-server.js`. 

Don't worry about browser compatibility - if it runs on the latest version of Google Chrome, it's okay.


## Submission

1. Create a private fork of this repository in GitLab.
2. Implement the changes.
3. Invite member `@ringaudas` with `Reporter` role for the review.

## Your Tasks

---
**NOTE**

There is `js/tests.js` file with tests that cover most of required functionality. You can run tests by running webserver `node ./dev-server.js` and opening http://127.0.0.1:3000/test.html in a browser.

---

### 1. Implement price and year filtering options.

- Currently, there are some hardcoded filtering options (also called facets) for price and year filters. You need to generate options that are relevant for albums that matched search query.
- Price filtering options should be displayed in ranges, e.g. 0-5, 5-10, 10-15, etc.
- Year options should be all years that match at least one album, in descending order.

### 2. Implement result filtering.

- Search results can be narrowed by selecting some filtering options.
- Filters in the same group should be joined by "OR" and different groups are joined by "AND". For example, if user selects years 2018 and 2017, and price range 5-10, you should show albums which price is in range 5-10 **and** year is 2018 **or** 2017.
- When no filters are selected, show all the albums that match search query.

### 3. Implement count for each filtering option.

- Each filtering option has a count displayed next to it which indicates how many results are matched by the filter. The numbers have to take into account selected filters in other groups and update as user checks or unchecks filters to be accurate for the current filtering combination.
- You should show only the options that will match at least one album. Thus, filtering options might change as user selects other filters. For example, if user selected price range 0-5 and there are no albums that cost less than $5 and were released in 2017, you shouldn't show year 2017 as a filtering option. But 2017 should appear as filtering option when user selects 5-10 price range (or has no price selected) because there are some albums that were released in 2017 and cost $9.99.
