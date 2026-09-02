import { seedData } from "./seedDatabase.js";
import { processCsv } from "./parseCsv.js";

async function testFunc(x) {
    const results = [];
    const data = await processCsv();

    for (let i = 0; i < x; i++) {
        let start = performance.now();

        await seedData(data);

        let end = performance.now();

        results.push(end - start);
    };
    
    const average = results.reduce((sum, number) => sum + number, 0) / results.length;
    console.log("Average time:", average);
};

testFunc(200)