
const axios = require('axios');

// Function to fetch news articles from the News API based on user preferences
const fetchNewsFromAPI = async (preferences) => {
    const apiKey = process.env.NEWS_API_KEY;
    const baseUrl = 'https://newsapi.org/v2/top-headlines';

    // Define categories based on user preferences
    const categories = preferences.map(preference => preference.toLowerCase());

    // Fetch news articles for each category concurrently using Promise.all
    const newsPromises = categories.map(category =>
        axios.get(baseUrl, {
            params: {
                apiKey,
                category
            }
        })
    );

    // Wait for all requests to complete
    const newsResponses = await Promise.all(newsPromises);

    // Extract articles from responses and combine them into a single array
    const newsArticles = newsResponses.reduce((articles, response) => {
        if (response.data.articles) {
            articles.push(...response.data.articles);
        }
        return articles;
    }, []);
    return newsArticles;
}

module.exports = fetchNewsFromAPI;