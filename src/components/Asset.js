import React from "react";
import { Spinner } from "react-bootstrap";
import styles from "../styles/Asset.module.css";

/**
 * Asset component that displays an image with optional spinner and message.
 */
const Asset = ({ spinner, src, message }) => {
  return (
    <div class="container">
      <div className={`${styles.Asset} p-4`}>
        {spinner && <Spinner animation="border" />}
        {src && <img src={src} alt={message} />}
        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Asset;