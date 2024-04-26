import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../styles/Footer.module.css";

/**
 * Footer component displays navigation links, social media links, and copyright information.
 * It is designed to be reusable across various pages within the application.
 */
const Footer = () => {
    return (
        <footer className={styles.footer}>
            <Container>
                <Row>
                    <Col className="text-center py-2">
                        Follow us on:
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a>,
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a>,
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"> Twitter</a>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center py-1">
                        © 2024 by SewLot. All rights reserved.
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
