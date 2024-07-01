import { updateDoc } from "@firebase/firestore";

export const addGrowwHolding = async (holdingRef, request, doc) => {
    if (doc.exists) {
        const existingData = doc.data();
        const totalHolding = Number(existingData['TotalHolding']);
        let symbolData = {};
        if (existingData[request.symbol]) {
            symbolData = {
                TotalQuantity: existingData[request.symbol]['TotalQuantity'] + request.quantity,
                TotalValue: existingData[request.symbol]['TotalValue'] + request.buyValue,
                AveragePrice: (existingData[request.symbol]['TotalValue'] + request.buyValue) / (existingData[request.symbol]['TotalQuantity'] + request.quantity)
            };
        } else {
            symbolData = {
                TotalQuantity: request.quantity,
                TotalValue: request.buyValue,
                AveragePrice: request.buyValue / request.quantity
            };
        };

        // Update the document with new data (NEVER Trigerred)
        console.log('Creating existing');
        await updateDoc(holdingRef, {
            [request.symbol]: {
                ...(existingData[request.symbol] || {}),
                [request.dateAdded]: {
                    Quantity: request.quantity,
                    BuyPrice: request.buyPrice,
                    BuyValue: request.buyValue,
                },
                TotalQuantity: symbolData.TotalQuantity,
                TotalValue: symbolData.TotalValue,
                AveragePrice: symbolData.AveragePrice
            },
            TotalHolding: totalHolding + request.buyValue
        });
    }
};

export const addZerodhaHolding = async (holdingRef, request, doc) => {
    if (doc.exists) {
        const existingData = doc.data();
        // Update the document with new data
        await updateDoc(holdingRef, {
            [request.symbol]: {
                ...(existingData[request.symbol] || {}),
                [request.dateAdded]: {
                    Quantity: request.quantity,
                    BuyPrice: request.buyPrice,
                    BuyValue: request.buyValue,
                },
            },
        });
    } else {
        // Create a new document
        await holdingRef.set({
            [request.symbol]: {
                [request.dateAdded]: {
                    Quantity: request.quantity,
                    BuyPrice: request.buyPrice,
                    BuyValue: request.buyValue,
                },
                Portfolio: request.portfolio
            },
        });
    }
};