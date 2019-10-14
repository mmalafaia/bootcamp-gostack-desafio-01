const express = require('express');

const server = express();

server.use(express.json());

let reqCounts = 0;
const projects = [
  {
    id: "1",
    title: "Projeto NodeJS",
    tasks: ["Instalar Ambiente", "Configura Projeto"]
  },
  {
    id: "2",
    title: "Projeto ReactJS",
    tasks: ["Configurar VSCode", "Rodar Demo"]
  }
];



server.use((req, res, next) => {
  reqCounts++;
  next();

  console.log(`Quantidade de Requisições: ${reqCounts}`);
})

function checkProjectInArray(req, res, next) {
  const index = projects.findIndex(x => x.id === req.params.id);
  const project = projects[index];

  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  req.project = project;
  req.index = index;

  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projects);
})

server.get('/projects/:id', checkProjectInArray, (req, res) => {
  return res.json(req.project);
})

server.post('/projects', (req, res) => {
  const { project}  = req.body;

  projects.push(project);

  return res.json(projects);
})

server.put('/projects/:id', checkProjectInArray, (req, res) => {
  const { title } = req.body.project;

  projects[req.index].title = title;

  return res.json(projects);
})

server.delete('/projects/:id', checkProjectInArray, (req, res) => {
  projects.splice(req.index, 1);

  return res.send();  
})

server.post('/projects/:id/tasks', checkProjectInArray, (req, res) => {
  const { title }  = req.body;

  projects[req.index].tasks.push(title);

  return res.json(projects[req.index]);
})

server.listen(3000);