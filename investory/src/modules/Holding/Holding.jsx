import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebaseconfig'; // Import your Firebase configuration
import { Form, Row, Col, Container, Table } from 'react-bootstrap'; // Import Bootstrap components

const Holding = () => {
    const [collectionName, setCollectionName] = useState('');
    const [documentId, setDocumentId] = useState('');
    const [stockData, setStockData] = useState(null);
    const [documentIds, setDocumentIds] = useState([]); // State for document IDs
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        // Fetch all collection names from Firestore
        const fetchCollections = async () => {
            try {
                // Get all collections directly under the Firestore database
                const collectionNames = ['Holding', 'PL']; // Assuming pre-defined collections
                console.log(collectionNames);
                setCollections(collectionNames);
            } catch (error) {
                console.error('Error fetching collections:', error);
            }
        };
        fetchCollections();
    }, []);

    useEffect(() => {
        // Fetch document IDs for the selected collection
        const fetchDocumentIds = async () => {
            if (collectionName) {
                try {
                    const collectionRef = collection(firestore, collectionName);
                    const querySnapshot = await getDocs(collectionRef);
                    const documentIds = querySnapshot.docs.map((doc) => doc.id);
                    setDocumentIds(documentIds);
                } catch (error) {
                    console.error('Error fetching document IDs:', error);
                }
            }
        };
        fetchDocumentIds();
    }, [collectionName]);

    useEffect(() => {
        // Fetch data from selected collection and document
        const fetchData = async () => {
            if (collectionName && documentId) {
                try {
                    const docRef = doc(firestore, collectionName, documentId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        // Access the data from the document
                        const stockData = docSnap.data();
                        setStockData(stockData);
                    } else {
                        setStockData(null);
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
        fetchData();
    }, [collectionName, documentId]);

    return (
        <Container className="stock-table">
            <h2>Stock Data</h2>
            <Form>
                <Row>
                    <Col>
                        <Form.Group controlId="collectionSelect">
                            <Form.Label>Collection:</Form.Label>
                            <Form.Select value={collectionName} onChange={(e) => setCollectionName(e.target.value)}>
                                <option value="">Select Collection</option>
                                {collections.map((collection) => (
                                    <option key={collection} value={collection}>
                                        {collection}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="documentSelect">
                            <Form.Label>Document ID:</Form.Label>
                            <Form.Select value={documentId} onChange={(e) => setDocumentId(e.target.value)}>
                                <option value="">Select Document</option>
                                {documentIds.map((documentId) => (
                                    <option key={documentId} value={documentId}>
                                        {documentId}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {stockData ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Symbol</th>
                            <th>Quantity</th>
                            <th>Buy Avg</th>
                            <th>Buy Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{stockData.dateAdded}</td>
                            <td>{stockData.symbol}</td>
                            <td>{stockData.quantity}</td>
                            <td>{stockData.buyPrice}</td>
                            <td>{stockData.buyValue}</td>
                        </tr>
                    </tbody>
                </Table>
            ) : (
                <p>Select a collection and document ID to view data.</p>
            )}
        </Container>
    );
};

export default Holding;