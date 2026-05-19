import css from "./SearchBox.module.css";
import toast from "react-hot-toast";
import { useState } from "react";

export default function SearchBox() {
  const [inputValue, setInputValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setInputValue(e.target.value);
    if (nextValue.trim() === "") {
      toast.error("Try again.");
    }
  };
  return (
    <input
      className={css.input}
      value={inputValue}
      onChange={handleChange}
      type="text"
      placeholder="Search notes"
    />
  );
}
