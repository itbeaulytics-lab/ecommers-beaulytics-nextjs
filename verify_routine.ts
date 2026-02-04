
import { generateRoutine, Routine } from "./src/lib/routineGenerator";

const mockProducts = [
    { id: "1", name: "Gentle Cleanser", price: 100000, qty: 1, category: "Cleanser", ingredients: [] },
    { id: "2", name: "Hydrating Toner", price: 150000, qty: 1, category: "Toner", ingredients: [] },
    { id: "3", name: "Vitamin C Serum", price: 200000, qty: 1, category: "Serum", ingredients: ["Vitamin C", "Water"] },
    { id: "4", name: "Retinol Serum", price: 250000, qty: 1, category: "Serum", ingredients: ["Retinol", "Squalane"] },
    { id: "5", name: "Daily Moisturizer", price: 120000, qty: 1, category: "Moisturizer", ingredients: [] },
    { id: "6", name: "Sunscreen SPF 50", price: 180000, qty: 1, category: "Sunscreen", ingredients: [] },
] as any;

const routine = generateRoutine(mockProducts);

console.log("Morning Products:", routine.morning.map(s => s.product.name));
console.log("Night Products:", routine.night.map(s => s.product.name));

const morningHasRetinol = routine.morning.some(s => s.product.name === "Retinol Serum");
const nightHasSunscreen = routine.night.some(s => s.product.name === "Sunscreen SPF 50");
const morningHasVitC = routine.morning.some(s => s.product.name === "Vitamin C Serum");

if (!morningHasRetinol && !nightHasSunscreen && morningHasVitC) {
    console.log("TEST PASSED");
} else {
    console.log("TEST FAILED");
    console.log("Morning has Retinol:", morningHasRetinol);
    console.log("Night has Sunscreen:", nightHasSunscreen);
}
