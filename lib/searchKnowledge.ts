import { knowledge } from "./knowledge";

export function searchKnowledge(question: string) {
    const lower = question.toLowerCase();

    for (const item of knowledge) {
        for (const keyword of item.keywords) {
            if (lower.includes(keyword)) {
                return item.answer;
            }
        }
    }

    return null;
}