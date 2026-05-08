const Note = require("../models/Note");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * POST /api/notes
 */
const createNote = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const note = await Note.create({
    userId: req.userId,
    title,
    content,
    category: category || "Personal",
  });

  res.status(201).json(note);
});

/**
 * GET /api/notes
 */
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ userId: req.userId }).sort({ pinned: -1, createdAt: -1 });
  res.status(200).json(notes);
});

/**
 * PUT /api/notes/:id
 */
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, userId: req.userId });

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  const { title, content, category, pinned, archived } = req.body;

  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (category !== undefined) note.category = category;
  if (pinned !== undefined) note.pinned = pinned;
  if (archived !== undefined) note.archived = archived;

  await note.save();
  res.status(200).json(note);
});

/**
 * DELETE /api/notes/:id
 */
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.status(200).json({ message: "Note deleted" });
});

module.exports = { createNote, getNotes, updateNote, deleteNote };
