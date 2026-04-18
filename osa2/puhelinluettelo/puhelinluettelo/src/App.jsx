import { useState, useEffect } from "react";
import personService from "./services/persons";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService.getAll().then(response => {
      setPersons(response.data);
    });
  }, []);

  const showMessage = (message) => {
    setNotification(message);
    
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService.create(personObject).then(response => {
      setPersons(persons.concat(response.data));
      showMessage(`Added ${response.data.name}`);
      setNewName("");
      setNewNumber("");
    });
  };

  const deletePerson = (id, name) => {
    const confirm = window.confirm(`Delete ${name}?`);

    if (!confirm) return;

    personService.remove(id).then(() => {
      setPersons(persons.filter(person => person.id !== id));

      showMessage(`Deleted ${name}`);
    });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>

      <Persons persons={persons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
 
 
