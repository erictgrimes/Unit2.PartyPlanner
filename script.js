// A list of parties from and api with name, date, time, location, and description are populated on the page when loaded
// Each party has a delete button that removes the party from the list and the api
// There is also a form where the user can add a new party
// When the add button is clicked the party is added to the page and the api

//My class code
const COHORT = "2503-FTB-ET-WEB-AM";

//Api Url
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

//placeholder for all parties
const state = {
  parties: [],
};

// Function to fetch all parties fron the API
const fetchAllParties = async () => {
  try {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    state.parties = data;
    renderAllParties();
  } catch (error) {
    console.log(error);
  }
};

// Function to render all parties on the page

const renderAllParties = () => {
  const pulledParties = document.getElementById("pulled_parties");
  const partyList = state.parties;

  if (partyList.length === 0 || !partyList) {
    pulledParties.innerHTML = "<p>No parties available</p>";
    return;
  }

  //resets pulledParties innerHTML
  pulledParties.innerHTML = "";

  partyList.forEach((party) => {
    const partyElement = document.createElement("div");
    partyElement.classList.add("party-card");
    partyElement.innerHTML = `
            <h3><u>${party.name}</u></h3>
            <p><u>Date and Time</u>: ${party.date}</p>
            <p><u>Location</u>: ${party.location}</p>
            <p>${party.description}</p>
            <button class="delete-button" data-id="${party.id}">Delete</button>
        `;
    pulledParties.appendChild(partyElement);

    const deleteButton = partyElement.querySelector(".delete-button");

    //event listener for delete button

    deleteButton.addEventListener("click", async (event) => {
      try {
        event.preventDefault();
        removeParty(party.id);
      } catch (error) {
        console.log(error);
      }
    });
  });
};

const removeParty = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.log(error);
  }
  fetchAllParties();
};

//adds a function to add a party to the API
const addParty = async (name, description, date, location) => {
  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        date,
        location,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchAllParties();
  } catch (error) {
    console.log(error);
  }
};

const addListenerToForm = () => {
  const form = document.querySelector("#new_party");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await addParty(
      form.name.value,
      form.date.value,
      form.location.value,
      form.description.value
    );

    form.name.value = "";
    form.date.value = "";
    form.location.value = "";
    form.description.value = "";
  });
};

const init = async () => {
  await fetchAllParties();
  addListenerToForm();
};

init();
