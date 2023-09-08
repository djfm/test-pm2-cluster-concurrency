const express = require('express');

const app = express();

let beingCalled = false;

const stats = {
    total: 0,
    concurrent: 0,
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function of interest
const foi = async () => {
    ++stats.total;
    ++stats.concurrent;

    console.log(stats);

    await sleep(1000);
    --stats.concurrent;
}

app.get('/', async (req, res) => {
    if (!beingCalled) {
        beingCalled = true;
        await foi();
        beingCalled = false;
    }

    res.send(stats);
});

app.listen(3000, () => {
    console.log('Test server is running on port 3000');
});