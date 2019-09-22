const Joi = require('joi');
const express = require('express');
const app = express();
bodyParser = require('body-parser').json();

let courses = [
  {id: '1', subject: 'Mathametics' },
  {id: '2', subject: 'Physics' },
  {id: '3', subject: 'Chemistry' }
];

//GET all courses
app.get('/api/courses', (req, res) => {
  res.send(courses);
});

// GET a specific coure
app.get('/api/course/:id', (req, res) => {
  const id = req.params.id;
  const course = courses.find(course => course.id === id);
  console.log(course);
  if(!course) return res.status(404).send(`${id} is not a valid id`);
  
  res.send(course.subject);
  
});

// POST Add a new course
app.post('/api/courses/', bodyParser, (req, res) => {
  const {error} = validateSubject(req.body);

  if(error) return res.status(400).send(error.details[0].message);

  const course = {
    id: `${courses.length + 1}`,
    subject: req.body.subject
  };

  courses.push(course);
  const lastItem = courses[courses.length -1];
  res.send(lastItem);
});

// PUT Update an existing course
app.put('/api/course/:id', bodyParser, (req, res) => {
  const id = req.params.id;
  const {error} = validateSubject(req.body);
  
  if(error) return res.status(400).send(error.details[0].message);
  
  const course = courses.find(course => course.id === id);

  if(!course) return res.status(400).send('Not a valid id');

  course.subject = req.body.subject;

  res.send(course);
});

// DELETE a specific course
app.delete('/api/course/:id', (req,res) => {
  const id = req.params.id;
  course = courses.find(course => course.id === id);
  
  if(!course) return res.status(404).send('Not a valid Id');
  
  courses = courses.filter(course => course.id !== id);
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listining at port no: ${port} ...`));



function validateSubject(course) {
  const schema = {
    subject: Joi.string().min(3).required()
  };

  return Joi.validate(course, schema);
}