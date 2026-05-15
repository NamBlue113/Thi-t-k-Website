// Speech service - analyzes English speech transcripts
const analyzeSpeech = (transcript) => {
    if (!transcript || typeof transcript !== 'string') {
        return { success: false, message: 'No transcript provided' };
    }

    const words = transcript.trim().split(/\s+/);
    const wordCount = words.length;

    const fillerWords = ['um', 'uh', 'er', 'ah', 'like', 'you know', 'i mean'];
    const fillerCount = words.filter(w => fillerWords.includes(w.toLowerCase())).length;

    const estimatedTimeSeconds = Math.round((wordCount / 150) * 60);

    const fluencyScore = wordCount > 0
        ? Math.max(0, Math.min(100, Math.round(100 - (fillerCount / wordCount) * 100)))
        : 0;

    return {
        success: true,
        wordCount,
        fillerWordCount: fillerCount,
        estimatedTimeSeconds,
        fluencyScore,
        transcript
    };
};

module.exports = { analyzeSpeech };
