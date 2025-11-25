/**
 * Gemini API Client
 *
 * Безопасный клиент для работы с Gemini API через proxy сервер.
 * API ключ хранится на сервере, а не в браузере!
 *
 * Поддерживает:
 * - Vercel Serverless Functions (/api/gemini)
 * - Netlify Functions (/.netlify/functions/gemini)
 * - Express Backend (/api/gemini)
 * - Прямой вызов API (только для разработки!)
 */

interface GeminiRequest {
  prompt: string;
  model?: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: {
    message: string;
  };
}

class GeminiClient {
  private apiEndpoint: string;
  private useProxy: boolean;

  constructor() {
    // Определяем endpoint в зависимости от окружения
    this.apiEndpoint = this.detectEndpoint();
    this.useProxy = this.shouldUseProxy();
  }

  /**
   * Автоматическое определение правильного endpoint
   */
  private detectEndpoint(): string {
    // Production - используем proxy
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;

      // Vercel
      if (hostname.includes('vercel.app')) {
        return '/api/gemini';
      }

      // Netlify
      if (hostname.includes('netlify.app')) {
        return '/.netlify/functions/gemini';
      }

      // Собственный домен или Docker
      return '/api/gemini';
    }

    return '/api/gemini';
  }

  /**
   * Проверка, нужно ли использовать proxy
   */
  private shouldUseProxy(): boolean {
    // В production всегда используем proxy
    if (process.env.NODE_ENV === 'production') {
      return true;
    }

    // В разработке можно использовать прямой API если есть ключ
    // Но лучше всегда использовать proxy для безопасности
    return true;
  }

  /**
   * Отправка запроса к Gemini API через proxy
   */
  async generate(request: GeminiRequest): Promise<string> {
    try {
      if (!this.useProxy && process.env.GEMINI_API_KEY) {
        // Прямой вызов (только для разработки!)
        return await this.directCall(request);
      }

      // Безопасный вызов через proxy
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
      }

      const data: GeminiResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      // Извлекаем текст из ответа
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('No response from API');
      }

      return text;

    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  /**
   * Прямой вызов API (НЕ БЕЗОПАСНО - только для разработки!)
   * @deprecated Используйте proxy в production
   */
  private async directCall(request: GeminiRequest): Promise<string> {
    console.warn('⚠️ Using direct API call - NOT SECURE for production!');

    const apiKey = process.env.GEMINI_API_KEY;
    const model = request.model || 'gemini-pro';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: request.prompt }]
        }]
      }),
    });

    const data: GeminiResponse = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || 'API request failed');
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from API');
    }

    return text;
  }
}

// Экспортируем singleton instance
export const geminiClient = new GeminiClient();

// Экспортируем класс для кастомизации
export default GeminiClient;
