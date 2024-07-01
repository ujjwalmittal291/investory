import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseconfig'; // Import your Firebase configuration
import { Container, Table } from 'react-bootstrap'; // Import Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

export const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.');
    // Assume years are in the 2000s if two-digit format is used
    const fullYear = year.length === 2 ? `20${year}` : year;
    return new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
};
export const fetchObjectKeys = (obj) => { return Object.keys(obj) };
export const fetchMaxDate = (data) => {
    const datePattern = /^\d{2}\.\d{1,2}\.\d{2,4}$/;
    const dateArray = data.filter(item => datePattern.test(item));
    const maxDate = new Date(Math.max(...dateArray.map(parseDate)));
    return `${maxDate.getDate().toString().padStart(2, '0')}.${(maxDate.getMonth() + 1).toString().padStart(2, '0')}.${maxDate.getFullYear().toString().slice(-2)}`;
};

export const fetchGrowwHoldingData = async () => {
    try {
        const docRef = doc(firestore, 'Holding', 'Groww');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // Access the data from the document
            const stockData = docSnap.data();
            const allKeys = fetchObjectKeys(stockData); // fetch symbol
            let parsedData = [];
            for (const key in allKeys) {
                const symbol = allKeys[key];
                const onj = stockData[symbol];
                if (symbol === "TotalHolding") { continue; };
                parsedData.push({
                    symbol: symbol,
                    dateAdded: fetchMaxDate(fetchObjectKeys(onj)),
                    quantity: onj.quantity,
                    buyPrice: onj.buyPrice,
                    buyValue: onj.buyValue
                });
            };
            return (parsedData);
        } else {
            console.log("No such document!");
            return (null);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const Dashboard = () => {
    const [stockData, setStockData] = useState(null);

    useEffect(() => {
        fetchGrowwHoldingData().then(data => {
            setStockData(data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Container className="stock-table">
            <h2>Stock Data</h2>
            <hr className="invisible" />
            {stockData ? (
                // console.log('inside html', stockData),
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
                        {/* Loop through each object in stockData */}
                        {stockData.map((stockItem) => (
                            <tr key={stockItem.id || Math.random()}>{/* Add a unique key */}
                                <td>{stockItem.dateAdded}</td>
                                <td>{stockItem.symbol}</td>
                                <td>{stockItem.quantity}</td>
                                <td>{stockItem.buyPrice}</td>
                                <td>{stockItem.buyValue}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>Select a collection and document ID to view data.</p>
            )}
        </Container>
    );
};

export default Dashboard;