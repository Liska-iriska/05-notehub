import css from "./NoteList.module.css";
import type { Note } from "../../types/note";

interface NoteListProps {
  onSelect: (note: Note) => void;
  notes: Note[];
}

export default function NoteList({ onSelect, notes }: NoteListProps) {
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
            <button className={css.button}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
