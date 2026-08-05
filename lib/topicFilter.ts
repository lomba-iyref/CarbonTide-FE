const allowedTopics = [
    "carbon",
    "karbon",
    "blue carbon",
    "mangrove",
    "mrv",
    "measurement",
    "verification",
    "reporting",
    "carbon credit",
    "credit karbon",
    "carbon marketplace",
    "marketplace",
    "satelit",
    "remote sensing",
    "sentinel",
    "gfw",
    "forest",
    "emission",
    "emisi",
    "certificate",
    "retirement",
    "project",
    "proyek",
    "carbon estimation",
    "estimasi karbon",
    "dashboard",
    "organization",
    "carbon tide",
    "carbontide",
];

export function isAllowedTopic(question: string) {
    const lower = question.toLowerCase();

    return allowedTopics.some(topic =>
        lower.includes(topic)
    );
}