const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const Person = require('./models/person')

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static('dist'))


app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
});

app.get("/info", (req, res) => {
  Person.countDocuments({}).then(count => {
    const now = new Date();
    res.send(`
      <div>
        <p>Phonebook has info for ${count} people</p>
        <p>${now}</p>
      </div>
    `);
  })
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  Person.findOne({ name: body.name }).then(existingPerson => {
    if (existingPerson) {
      return res.status(400).json({
        error: 'name must be unique'
      })
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
  })
})

const PORT = process.env.PORT ||3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
