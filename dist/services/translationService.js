"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translationService = exports.TranslationService = exports.SUPPORTED_LANGUAGES = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = process.env.OPENAI_API_KEY ? new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
}) : null;
exports.SUPPORTED_LANGUAGES = {
    'ru': 'Russian',
    'en': 'English',
    'tj': 'Tajik',
    'fa': 'Persian/Farsi',
    'de': 'German',
    'zh': 'Chinese'
};
class TranslationService {
    async translateText({ text, fromLanguage, toLanguage, context = 'tour_description' }) {
        if (!openai) {
            throw new Error('Translation service is not available. Please configure OPENAI_API_KEY environment variable.');
        }
        if (fromLanguage === toLanguage) {
            return {
                translatedText: text,
                fromLanguage,
                toLanguage,
                confidence: 1.0
            };
        }
        const contextPrompts = {
            tour_description: 'tourism marketing content describing travel experiences, attractions, and activities',
            tour_itinerary: 'detailed day-by-day travel schedule with activities, locations, and timing',
            hotel_description: 'hospitality content describing accommodations, amenities, and services',
            guide_description: 'professional descriptions of tour guides, their expertise and experience'
        };
        const systemPrompt = `You are a professional translator specializing in tourism content for Central Asia. 
You must translate ${exports.SUPPORTED_LANGUAGES[fromLanguage]} text to ${exports.SUPPORTED_LANGUAGES[toLanguage]} with high accuracy.

Context: This is ${contextPrompts[context]}.

Important guidelines:
- Maintain the original tone and style
- Preserve tourism-specific terminology and proper names
- Keep cultural context appropriate for Central Asian tourism
- Maintain formatting and structure
- For place names, use the most commonly accepted spelling in the target language
- For currencies, convert to local context when appropriate

Respond with only the translated text, no additional commentary.`;
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            });
            const translatedText = response.choices[0]?.message?.content?.trim();
            if (!translatedText) {
                throw new Error('No translation received from OpenAI');
            }
            return {
                translatedText,
                fromLanguage,
                toLanguage,
                confidence: 0.9
            };
        }
        catch (error) {
            console.error('Translation error:', error);
            throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async translateMultilingualContent(content, context = 'tour_description') {
        const sourceLanguage = Object.keys(content).find(lang => content[lang]?.trim());
        if (!sourceLanguage || !content[sourceLanguage]) {
            throw new Error('No source content found for translation');
        }
        const sourceText = content[sourceLanguage];
        const result = { ...content };
        const missingLanguages = Object.keys(exports.SUPPORTED_LANGUAGES)
            .filter(lang => !content[lang]?.trim());
        for (const targetLanguage of missingLanguages) {
            try {
                const translation = await this.translateText({
                    text: sourceText,
                    fromLanguage: sourceLanguage,
                    toLanguage: targetLanguage,
                    context
                });
                result[targetLanguage] = translation.translatedText;
            }
            catch (error) {
                console.error(`Failed to translate to ${targetLanguage}:`, error);
            }
        }
        return result;
    }
    async detectLanguage(text) {
        if (!openai) {
            console.warn('Translation service not available - defaulting to English');
            return 'en';
        }
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `Detect the language of the given text. Respond with only one of these language codes: ${Object.keys(exports.SUPPORTED_LANGUAGES).join(', ')}. If uncertain, respond with 'en'.`
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                temperature: 0.1,
                max_tokens: 10
            });
            const detectedLang = response.choices[0]?.message?.content?.trim()?.toLowerCase();
            if (detectedLang && detectedLang in exports.SUPPORTED_LANGUAGES) {
                return detectedLang;
            }
            return 'en';
        }
        catch (error) {
            console.error('Language detection error:', error);
            return 'en';
        }
    }
}
exports.TranslationService = TranslationService;
exports.translationService = new TranslationService();
//# sourceMappingURL=translationService.js.map