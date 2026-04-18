import { useState, useEffect } from "react";
import axios from "axios";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const baseUrl = "http://localhost:3001/persons";

  useEffect(() => {
    axios.get(baseUrl).then(response => {
      setPersons(response.data);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    axios.post(baseUrl, personObject).then(response => {
      setPersons(persons.concat(response.data));
      setNewName("");
      setNewNumber("");
    });
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>

      <Persons persons={persons} />
    </div>
  );
};

export default App;
 
 
