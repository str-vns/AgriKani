var Sentiment = require('sentiment');
var { filLanguage } = require('../helpers/SentimentChecker'); 
var sentiment = new Sentiment();


sentiment.registerLanguage('fil', filLanguage);

function preprocessText(text) {
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = [...new Set(words)];
    return uniqueWords.join(' ');
}


function analyzeMixedLanguage(text) {
    const normalizedText = preprocessText(text);
    var resultFil = sentiment.analyze(normalizedText, { language: 'fil' });
    var resultEng = sentiment.analyze(normalizedText);

    const combinedScore = resultFil.score + resultEng.score;

    return {
        text: text,
        sentimentScore: combinedScore,
        sentimentLabel: combinedScore > 0 ? 'positive' : combinedScore < 0 ? 'negative' : 'neutral',
        calculation: {
            filipino: resultFil.score,
            english: resultEng.score,
        },
        postive: resultFil.positive.concat(resultEng.positive),
        negative: resultFil.negative.concat(resultEng.negative),
    };
}

module.exports = { analyzeMixedLanguage };