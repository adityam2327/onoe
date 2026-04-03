import mongoose from "mongoose";
import { Officer } from "./src/models/officer.model.js";

async function checkOfficers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/onoe');
        const officers = await Officer.find();
        console.log('Total Officers:', officers.length);
        officers.forEach(o => {
            console.log(`- ${o.name} | ${o.email} | ${o.role} | Created: ${o.createdAt}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkOfficers();
