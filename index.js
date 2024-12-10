let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
  {
    id: "69",
    content: "This note is from the backend server",
    important: true,
  },
];

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors({ origin: "https://notesbackend-6aha.onrender.com:10000" }));

const loggerMiddleware = (req, res, next) => {
  console.log("request body: (from logger middleware): ", req.body);
  next();
};
app.use(loggerMiddleware);

app.get("/", (req, res) => res.send("hello world"));

app.get("/api/notes", (req, res) => res.json(notes));

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => String(note.id) === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

app.post("/api/notes", (req, res) => {
  console.log("request body from the POST method: ", req.body);
  const maxID = String(Math.max(...notes.map((note) => Number(note.id))) + 1);
  const body = req.body;
  if (!body.content) {
    res.status(400).json({ error: "content missing" });
    return;
  }
  const note = {
    content: body.content,
    important: body.important ?? false,
    id: maxID,
  };
  notes = notes.concat(note);
  res.json(note);
});

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
