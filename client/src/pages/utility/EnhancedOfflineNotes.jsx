import { useState, useEffect, useMemo } from "react";
import { notesAPI } from "../../lib/api";
import Navbar from "../../components/navbar/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Pin, Archive, Edit3, Trash2, X } from "lucide-react";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Personal");
  const [editId, setEditId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const fetchNotes = async () => {
    try { const { data } = await notesAPI.getAll(); setNotes(data); }
    catch { toast.error("Failed to load notes"); }
  };

  useEffect(() => { fetchNotes(); }, []);

  const { active, archived } = useMemo(() => {
    const a = [], b = [];
    notes.forEach((n) => (n.archived ? b : a).push(n));
    return { active: a.sort((x, y) => (x.pinned === y.pinned ? 0 : x.pinned ? -1 : 1)), archived: b };
  }, [notes]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) { toast.error("Title and content required"); return; }
    try {
      if (editId) { await notesAPI.update(editId, { title, content, category }); toast.success("Updated"); }
      else { await notesAPI.create({ title, content, category }); toast.success("Created"); }
      resetForm(); fetchNotes();
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (id) => { try { await notesAPI.delete(id); fetchNotes(); toast.success("Deleted"); } catch { toast.error("Failed"); } };
  const togglePin = async (n) => { try { await notesAPI.update(n._id, { pinned: !n.pinned }); fetchNotes(); } catch { toast.error("Failed"); } };
  const toggleArchive = async (n) => { try { await notesAPI.update(n._id, { archived: !n.archived }); fetchNotes(); } catch { toast.error("Failed"); } };
  const editNote = (n) => { setTitle(n.title); setContent(n.content); setCategory(n.category); setEditId(n._id); };
  const resetForm = () => { setTitle(""); setContent(""); setCategory("Personal"); setEditId(null); };

  const NoteCard = ({ note, isArchived }) => (
    <div className="glass-card" style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
        <h3 style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{note.pinned && "📌 "}{note.title}</h3>
        <span className="badge badge-info">{note.category}</span>
      </div>
      <p className="text-muted text-sm" style={{ marginBottom: "0.75rem", lineHeight: 1.5 }}>{note.content}</p>
      <div style={{ display: "flex", gap: "0.25rem" }}>
        {!isArchived && <button className="btn btn-ghost" style={{ padding: "0.375rem" }} onClick={() => togglePin(note)}><Pin size={14} /></button>}
        <button className="btn btn-ghost" style={{ padding: "0.375rem" }} onClick={() => toggleArchive(note)}><Archive size={14} /></button>
        {!isArchived && <button className="btn btn-ghost" style={{ padding: "0.375rem" }} onClick={() => editNote(note)}><Edit3 size={14} /></button>}
        <button className="btn btn-ghost" style={{ padding: "0.375rem", color: "var(--error)" }} onClick={() => handleDelete(note._id)}><Trash2 size={14} /></button>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="page"><div className="container" style={{ maxWidth: 900 }}>
        <h1 className="heading-lg" style={{ marginBottom: "1.5rem" }}>Notes</h1>

        {/* Editor */}
        <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <p className="heading-sm">{editId ? "Edit Note" : "New Note"}</p>
            {editId && <button className="btn btn-ghost" onClick={resetForm} style={{ padding: "0.375rem" }}><X size={16} /></button>}
          </div>
          <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginBottom: "0.75rem" }} />
          <textarea className="input" placeholder="Write something..." rows={3} value={content} onChange={(e) => setContent(e.target.value)} style={{ marginBottom: "0.75rem", resize: "vertical" }} />
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} style={{ flex: "0 0 auto", width: 160 }}>
              <option>Personal</option><option>Work</option><option>Transactions</option>
            </select>
            <button className="btn btn-primary" onClick={handleSave}><Plus size={16} /> {editId ? "Update" : "Create"}</button>
          </div>
        </div>

        {/* Active Notes */}
        {active.length === 0 ? <p className="text-muted text-center" style={{ padding: "2rem 0" }}>No notes yet. Create one above!</p> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {active.map((n) => <NoteCard key={n._id} note={n} />)}
          </div>
        )}

        {/* Archived */}
        {archived.length > 0 && (
          <div>
            <button className="btn btn-ghost" onClick={() => setShowArchived(!showArchived)} style={{ marginBottom: "1rem" }}>
              <Archive size={16} /> {showArchived ? "Hide" : "Show"} Archived ({archived.length})
            </button>
            {showArchived && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", opacity: 0.7 }}>
                {archived.map((n) => <NoteCard key={n._id} note={n} isArchived />)}
              </div>
            )}
          </div>
        )}
      </div></main>
      <Toaster position="bottom-center" toastOptions={{ style: { background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" } }} />
    </>
  );
}
