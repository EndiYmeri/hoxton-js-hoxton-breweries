// Write your code here

// Description
// In this exercise we explore a common scenario in ecommerce and booking sites, using filters and search to modify what we render from state.

// Deliverables
// - A user can enter a US state and view a list of breweries in that state
//     - The list has a maximum of 10 breweries on display
//     - The list has three types of breweries that offer brewery tours:
//         - Micro
//         - Regional
//         - Brewpub
//     - Do not show the other types of breweries
// - From the list of breweries, a user can view the following details about each brewery:
//     - Name
//     - Type of brewery
//     - Address
//     - Phone Number
// - From the list of breweries, a user can visit the website of a brewery
// - From the 'filter by type of brewery' section, a user can filter by type of brewery
// - From the 'filter by city' section, a user can filter by city, the location of the brewery
// - From the 'filter by city' section, a user can clear all filters
// - From the 'search' section, a user can search for breweries by:
//     - Name
//     - City

// Instructions
// - Download the files from https://codesandbox.io/s/day-16-hoxton-breweries-template-h2c0q
// - Read the "Open Brewery DB" documentation: https://www.openbrewerydb.org/documentation/01-listbreweries
// - Think about which request type to use
// - Create a state object
// - Create a fetch function to get data
// - Create action functions that update state
// - Create render functions that read from state
// @everyone part2

// Tips
// - Start with the logic first, use console.log(state) to check your logic is working; when the logic is working as expected move onto styling
// - Use a cleanData function to modify the data in the fetch request before adding it to state
// - Use a extractCitiesData function to extract the cities from the data in the fetch request and add it to state for the 'filter by city' section
// - For filter by type use a select element to capture user input
// - For filter by city use a list of checkbox elements to capture user input

// Challenge
// - Add pagination to the list; if the list of breweries is greater than 10 a user can go to the next page to view more breweries

// Challenge 2
// - Add a booking section; a user can select a date and time to go on a tour at a brewery

const baseUrl = "https://api.openbrewerydb.org/breweries"
const main = document.querySelector('main')
const mainChildren = [...main.children]
const stateSelectorForm = document.querySelector('#select-state-form')
const filtersSectionAsideEl = document.querySelector('.filters-section')
const filterByCityForm = document.querySelector('#filter-by-city-form')
const filterByTypeSelect = document.querySelector('#filter-by-type')
const clearAllButton = document.querySelector('.clear-all-btn')
const searchBreweriesForm = document.querySelector('#search-breweries-form')
const searchBreweries = document.querySelector('#search-breweries')

// The state
const state = {
    breweries: [],
    selectedState: null,
    breweryType: ['micro', 'regional', 'brewpub'],
    selectedBreweryType: '',
    selectedCities: []
}

// Fetching Breweries from the API
function fetchBreweriesByState(state) {
    return fetch(baseUrl + `?by_state=${state}&per_page=50`).then(resp => resp.json())
}

// QUESTIONS TO ANSWER:
// Q: What kind of breweries should we be showing?
// A: state.selectedBreweriesType

// Q: Is there any brewery type selected?
// A: state.selectedBreweryType !== ""

// Q: Which one?
// A: state.selectedBreweryType

// Q: Are there any selected cities?
// A: state.selectedCities.lenght > 0

// Q: Which cities are selected?
// A: state.selectedCities


// Action Functions
// Filters the breweries we want to display by type
function getBreweriesToDisplay() {
    let breweriesToDisplay = state.breweries

    breweriesToDisplay = breweriesToDisplay.filter(
        brewery => state.breweryType.includes(brewery.brewery_type)
    )
    if (searchBreweries.value !== "") {
        breweriesToDisplay = breweriesToDisplay.filter((brewery) => {
            return brewery.name.includes(searchBreweries.value) || brewery.city.includes(searchBreweries.value)
        })
    } else {
        if (state.selectedBreweryType !== "") {
            breweriesToDisplay = breweriesToDisplay.filter(
                brewery => brewery.brewery_type === state.selectedBreweryType
            )
        }
        if (state.selectedCities.length > 0) {
            breweriesToDisplay = breweriesToDisplay.filter(
                brewery => state.selectedCities.includes(brewery.city)
            )
        }
    }

    breweriesToDisplay = breweriesToDisplay.slice(0, 10)

    return breweriesToDisplay
}

// Getting the Breweries from that state
function getStateFromStateSelectorForm() {
    stateSelectorForm.addEventListener('submit', (e) => {
        e.preventDefault()
        state.selectedState = stateSelectorForm['select-state'].value
        fetchBreweriesByState(state.selectedState)
            .then((breweries) => {
                state.breweries = breweries
                render()
            })
    })
}

// Getting Cities of the Breweries
function getCitiesFromBreweries(breweries) {
    let cities = []
    for (const brewery of breweries) {
        if (!cities.includes(brewery.city)) {
            cities.push(brewery.city)
        }
    }
    cities.sort()

    return cities
}

// Getting Selected Brewery Type
function getSelectedBreweryType() {
    filterByTypeSelect.addEventListener('change', () => {
        state.selectedBreweryType = filterByTypeSelect.value
        renderBreweriesArticleList()
        searchBreweries.value = ""
    })
}

// Getting Selected Cities 
function getSelectedCities() {
    let cityCheckboxes = document.querySelectorAll('.city-checkboxes')

    cityCheckboxes.forEach((element) => {
        element.addEventListener('change', () => {
            getSelectedCities()
            renderBreweriesArticleList()
            searchBreweries.value = ""
        })
    })

    cityCheckboxes = [...cityCheckboxes]

    return state.selectedCities = cityCheckboxes
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value)
}

// Getting the brewery via search brewery section
function getSearchedBreweries() {
    searchBreweriesForm.addEventListener('submit', (e) => {
        e.preventDefault()
        renderBreweriesArticleList()
    })
}

// Clearing All filter
function clearAllFilters() {
    clearAllButton.addEventListener('click', () => {
        render()
    })
}


// Render Functions
// Rendering the children of Main Section if breweries list length is > 0
function renderMainChildren() {
    if (state.breweries.length !== 0) {
        // filtersSectionAsideEl.style.display = "block";

        mainChildren.forEach((child) => {
            child.style.display = "block"
        })
    } else {
        mainChildren.forEach((child) => {
                child.style.display = "none"
            })
            // filtersSectionAsideEl.style.display = "none";
    }

}

// Rendering the filter section
function renderFilterSection() {

    const breweriesToDisplay = getBreweriesToDisplay()

    const cities = getCitiesFromBreweries(breweriesToDisplay)
    filterByCityForm.innerHTML = ""

    for (const city of cities) {
        const cityCheckboxInputEl = document.createElement('input')
        const cityCheckboxLabelEl = document.createElement('label')

        cityCheckboxInputEl.setAttribute('type', 'checkbox')
        cityCheckboxInputEl.setAttribute('name', city)
        cityCheckboxInputEl.setAttribute('value', city)
        cityCheckboxInputEl.setAttribute('id', city)
        cityCheckboxInputEl.setAttribute('class', 'city-checkboxes')


        cityCheckboxLabelEl.setAttribute('for', city)
        cityCheckboxLabelEl.textContent = city
        filterByCityForm.append(cityCheckboxInputEl, cityCheckboxLabelEl)
    }

}

// Rendering the Breweries List 
function renderBreweriesArticleList() {
    const breweriesToDisplay = getBreweriesToDisplay()

    const breweriesList = document.querySelector('.breweries-list')
    breweriesList.innerHTML = ""

    for (const brewery of breweriesToDisplay) {
        const liEL = document.createElement('li')
        const titleEl = document.createElement('h2')

        titleEl.textContent = brewery.name


        const typeDivEl = document.createElement('div')
        typeDivEl.setAttribute('class', 'type')
        typeDivEl.textContent = brewery.brewery_type

        const addressSection = document.createElement('section')
        addressSection.setAttribute('class', 'address')

        const addressH3El = document.createElement('h3')
        addressH3El.textContent = "Address:"

        const streetEl = document.createElement('p')
        streetEl.textContent = brewery.street

        const cityEl = document.createElement('p')
        cityEl.innerHTML = `<strong>${brewery.city}, ${brewery.postal_code}</strong>`

        addressSection.append(addressH3El, streetEl, cityEl)


        const phoneSection = document.createElement('section')
        phoneSection.setAttribute('class', 'phone')

        const phoneH3El = document.createElement('h3')
        phoneH3El.textContent = "Phone:"

        const phoneNr = document.createElement('p')
        phoneNr.textContent = brewery.phone

        phoneSection.append(phoneH3El, phoneNr)

        const linkSection = document.createElement('section')
        linkSection.setAttribute('class', 'link')

        const linkEl = document.createElement('a')
        linkEl.setAttribute('href', brewery.website_url)
        linkEl.setAttribute('target', '_blank')
        linkEl.textContent = "Visit Website"

        linkSection.append(linkEl)

        liEL.append(titleEl, typeDivEl, addressSection, phoneSection, linkSection)
        breweriesList.append(liEL)
    }
}


function render() {
    filterByTypeSelect.value = ""
    state.selectedCities = []
    state.selectedBreweryType = ''
    searchBreweries.value = ""
    renderMainChildren()
    renderFilterSection()
    getSelectedCities()
    getSelectedBreweryType()
    renderBreweriesArticleList()
}

function init() {
    render()
    getStateFromStateSelectorForm()
    getSearchedBreweries()
    clearAllFilters()
}
init()