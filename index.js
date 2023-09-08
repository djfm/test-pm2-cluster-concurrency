const express = require('express');

const app = express();

let isBeingCalledFlag = false;

const beingCalled = async () => new Promise(resolve => {
    setTimeout(() => {
        resolve(isBeingCalledFlag);
    }, Math.random() * 1000);
});

const setIsBeingCalled = async () => new Promise(resolve => {
    setTimeout(() => {
        isBeingCalledFlag = true;
        resolve();
    }, Math.random() * 1000);
});

const stats = {
    foiCalledTotal: 0,
    foiCalledConcurrent: 0,
    requestsTotal: 0,
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function of interest
const foi = async () => {
    ++stats.foiCalledTotal;
    ++stats.foiCalledConcurrent;

    console.log(stats);

    await sleep(1000);
    --stats.foiCalledConcurrent;
}

app.get('/', async (req, res) => {
    ++stats.requestsTotal;

    if (!await beingCalled()) {
        await setIsBeingCalled();
        await foi();
    }

    res.send(stats);
});

app.listen(3000, () => {
    console.log('Test server is running on port 3000');
});