export declare const SUPPORTED_LANGUAGES: {
    readonly ru: "Russian";
    readonly en: "English";
    readonly tj: "Tajik";
    readonly fa: "Persian/Farsi";
    readonly de: "German";
    readonly zh: "Chinese";
};
export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;
interface TranslationRequest {
    text: string;
    fromLanguage: SupportedLanguage;
    toLanguage: SupportedLanguage;
    context?: 'tour_description' | 'tour_itinerary' | 'hotel_description' | 'guide_description';
}
interface TranslationResponse {
    translatedText: string;
    fromLanguage: SupportedLanguage;
    toLanguage: SupportedLanguage;
    confidence?: number;
}
export declare class TranslationService {
    translateText({ text, fromLanguage, toLanguage, context }: TranslationRequest): Promise<TranslationResponse>;
    translateMultilingualContent(content: Partial<Record<SupportedLanguage, string>>, context?: TranslationRequest['context']): Promise<Record<SupportedLanguage, string>>;
    detectLanguage(text: string): Promise<SupportedLanguage>;
}
export declare const translationService: TranslationService;
export {};
//# sourceMappingURL=translationService.d.ts.map