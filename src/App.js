import { useState, useEffect, useCallback  } from "react";
import { BiCalendar } from "react-icons/bi";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";

function App() {
  // State to hold the list of appointments
  let [ appointmentList, setAppointmentList ] = useState([]); // Initial value is an empty array
  let [ query, setQuery ] = useState(''); // State to hold the search query
  let [ sortBy, setSortBy ] = useState('petName'); // State to initialize by petName by default
  let [ orderBy, setOrderBy ] = useState('asc'); // State to initialize by ascending order by default

  const filteredAppointments = appointmentList.filter(
    // 1. Convert both the appointment fields and the query to lowercase to make the search case-insensitive
    // 2. Check if the query is included in any of the fields: petName, ownerName, or aptNotes
    item => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      )
    }
  ).sort((a, b) => {
    let order = (orderBy === 'asc') ? 1 : -1; // Determine the order based on the orderBy state
    return (
      // Control how the two items are compared
      // 1. If a is less than b, return -1 multiplied by the order (1 for ascending, -1 for descending)
      // 2. If a is greater than b, return 1 multiplied by the order
      // This way, the sorting will be done in the specified order (ascending or descending)
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order : 1 * order
    )
  })

  // Fetch data from the JSON file
  const fetchData = useCallback(() => { // useCallback to monitor any changes that happen in the data
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        setAppointmentList(data);
      })
  }, [])

  useEffect(() => {
    fetchData();
  }, [fetchData]) // Asking useEffect to track the fetching of data

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3">
        <BiCalendar className="inline-block text-red-400 align-top"/> Your Appointments
      </h1>
      {/* Components */}
      <AddAppointment 
      // 1. onSendAppointment is a prop that we create to send data from the child component (AddAppointment) to the parent component (App)
      // 2. We create an arrow function that receives the myAppointment object from the child component
      // 3. We call the setAppointmentList method to update the state
      // 4. We use the spread operator (...) to copy all the previous appointments from the appointmentList array
      // 5. We create a new array that contains all the previous appointments and add the new appointment at the end of the array
      // 6. The new array is then set as the new state
        onSendAppointment={myAppointment =>
          setAppointmentList([...appointmentList, myAppointment])}
          lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
      />
      <Search query={query}
        onQueryChange={myQuery => setQuery(myQuery)}
        orderBy={orderBy}
        onOrderByChange={myOrder => setOrderBy(myOrder)}
        sortBy={sortBy}
        onSortByChange={mySort => setSortBy(mySort)}
      />

      <ul className="divide-y divide-gray-200">
        {/* Replacing appointmentList with filteredAppointments to show the filtered list */}
        {/* {appointmentList */}
        {filteredAppointments
          .map(appointment => ( 
            // Everytime you loop through a serie of elements, we need to use a key
            <AppointmentInfo key={appointment.id}
              // Passing down the whole appointment object as a prop in an "appointment" variable
              appointment={appointment}
              // Passing down the setAppointmentList method that we created above and is
              // part of useState to delete an appointment
              // 1. We create an arrow function that receives the appointmentId
              // 2. We call the setAppointmentList method to update the state
              // 3. We filter the appointmentList to remove the appointment with the matching id
              // 4. The filtered list is then set as the new state
              onDeleteAppointment={ 
                appointmentId => 
                  setAppointmentList(appointmentList.filter(appointment => 
                    appointment.id !== appointmentId))
                }
            />
          ))
        }
      </ul>
    </div>
  );
}

export default App;
