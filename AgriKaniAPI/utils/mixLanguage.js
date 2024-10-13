var Sentiment = require('sentiment');
var { filLanguage } = require('../helpers/SentimentChecker'); 
var sentiment = new Sentiment();


sentiment.registerLanguage('fil', filLanguage);

function analyzeMixedLanguage(text) {
    var resultFil = sentiment.analyze(text, { language: 'fil' });
    var resultEng = sentiment.analyze(text);

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