import { useState } from "react";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
 
const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas", number: "040-1231244"  }]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
 
  const addPerson = (event) => {
    event.preventDefault();
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    
    setPersons(persons.concat({ name: newName, number: newNumber }));
    setNewName("");
    setNewNumber("");
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
 
 
