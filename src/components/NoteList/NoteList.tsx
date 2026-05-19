import css from "./NoteList.module.css";
import type { Note } from "../../types/note";

interface NoteListProps {
  onSelect: (note: Note) => void;
  notes: Note[];
  onDelete: (id: string) => void;
}

export default function NoteList({ onSelect, notes, onDelete }: NoteListProps) {
  if (notes.length === 0) {
    return null;
  }
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li
          className={css.listItem}
          onClick={() => onSelect(note)}
          key={note.id}
        >
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
