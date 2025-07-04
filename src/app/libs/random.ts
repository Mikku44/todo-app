import { DailyQuote } from "../modules/quotes";

export function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * DailyQuote.length);
    return DailyQuote[randomIndex];
}