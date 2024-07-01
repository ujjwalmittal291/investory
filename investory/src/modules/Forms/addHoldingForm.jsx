import { COLLECTION_ID, PORTFOLIO } from '../../constants'
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { firestore } from '../../firebaseconfig'; // Import your Firebase configuration
import { addZerodhaHolding, addGrowwHolding } from './Service';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';

function AddHoldingForm() {
    const [holdings, setHoldings] = useState([]);
    const [selectedHolding, setSelectedHolding] = useState('');
    const [portfolios, setPortfolios] = useState([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState('');
    const [symbol, setSymbol] = useState('');
    const [dateAdded, setDateAdded] = useState('');
    const [quantity, setQuantity] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [buyValue, setBuyValue] = useState('');

    useEffect(() => {
        // Fetch holdings from Firestore
        const unsubscribe = onSnapshot(collection(firestore, COLLECTION_ID.HOLDING), (snapshot) => {
            setHoldings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe(); // Clean up the listener on component unmount
    }, []);

    useEffect(() => {
        // Update portfolios based on selected holding
        if (selectedHolding === 'Zerodha') {
            setPortfolios([PORTFOLIO.UJJWAL, PORTFOLIO.BHARTI]);
        } else {
            setPortfolios([]);
        }
    }, [selectedHolding]);

    useEffect(() => {
        // Calculate buyValue whenever quantity or buyPrice changes
        setBuyValue(quantity * buyPrice);
    }, [quantity, buyPrice]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // const holdingRef = doc(firestore, COLLECTION_ID.HOLDING, selectedHolding);
            const holdingRef = doc(firestore, COLLECTION_ID.HOLDING, selectedHolding);
            const dock = await getDoc(holdingRef);
            if (dock.exists) {
                const existingData = dock.data();
                // Check if symbol already exists
                if (existingData[symbol]) {
                    // Autofill existing data
                    setQuantity(existingData[symbol][dateAdded]?.Quantity || '');
                    setBuyPrice(existingData[symbol][dateAdded]?.BuyPrice || '');
                    setBuyValue(existingData[symbol][dateAdded]?.BuyValue || '');
                }
            }
            const request = {
                symbol: symbol,
                dateAdded: dateAdded,
                quantity: Number(quantity),
                buyPrice: Number(buyPrice),
                buyValue: Number(buyValue),
                portfolio: selectedPortfolio
            }
            if (selectedHolding === 'Groww') {
                addGrowwHolding(holdingRef, request, dock);
            } else {
                addZerodhaHolding(holdingRef, request, dock);
            }
            // Clear the form after successful submission
            setSymbol('');
            setDateAdded('');
            setQuantity('');
            setBuyPrice('');
            setBuyValue('');
        } catch (error) {
            console.error('Error updating/creating document: ', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="holding">
                    <Form.Label>Holding</Form.Label>
                    <DropdownButton id="holding-dropdown" title="Select Holding">
                        {holdings.map(holding => (
                            <Dropdown.Item
                                key={holding.id}
                                onClick={() => setSelectedHolding(holding.id)}
                            >
                                {holding.id}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </Form.Group>
                {selectedHolding === 'Zerodha' && (
                    <Form.Group as={Col} controlId="portfolio">
                        <Form.Label>Portfolio</Form.Label>
                        <DropdownButton id="portfolio-dropdown" title="Select Portfolio">
                            {portfolios.map(portfolio => (
                                <Dropdown.Item
                                    key={portfolio}
                                    onClick={() => setSelectedPortfolio(portfolio)}
                                >
                                    {portfolio}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Form.Group>
                )}
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="symbol">
                    <Form.Label>Symbol</Form.Label>
                    <Form.Control
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        required
                    />
                </Form.Group>
                <Form.Group as={Col} controlId="dateAdded">
                    <Form.Label>Date Added</Form.Label>
                    <Form.Control
                        type="text"
                        value={dateAdded}
                        onChange={(e) => setDateAdded(e.target.value)}
                        placeholder="dd.mm.yy"
                        required
                    />
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </Form.Group>
                <Form.Group as={Col} controlId="buyPrice">
                    <Form.Label>Buy Price</Form.Label>
                    <Form.Control
                        type="number"
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                    />
                </Form.Group>
                <Form.Group as={Col} controlId="buyValue">
                    <Form.Label>Buy Value</Form.Label>
                    <Form.Control
                        type="number"
                        value={buyValue} // Display calculated buyValue
                        readOnly // Make the field read-only
                    />
                </Form.Group>
            </Row>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}

export default AddHoldingForm;