import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseconfig'; // Import your Firebase configuration

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

export const fetchZerodhaHoldingData = async () => {
    try {
        const docRef = doc(firestore, 'Holding', 'Zerodha');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Access the data from the document
            const stockData = docSnap.data();
            return (stockData);
        } else {
            console.log("No such document!");
            return (null);
        }
    } catch (error) {
        console.error('Error fetching data for Zerodha:', error);
    }
};