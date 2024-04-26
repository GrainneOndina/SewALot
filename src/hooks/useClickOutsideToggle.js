import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to manage the state of a toggle based on click events outside of a specified element.
 * Utilizes a ref to the element to check if it contains the event target.
 * @returns {object} An object containing the toggle state, a function to set this state, and the ref to the element.
 */
const useClickOutsideToggle = () => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    /**
     * Event handler to close the toggle if clicked outside the ref element.
     * @param {Event} event - The DOM event object.
     */
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    // Attach the event listener to the document
    document.addEventListener("mouseup", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]);

  return { expanded, setExpanded, ref };
};

export default useClickOutsideToggle;
