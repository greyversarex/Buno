/**
 * SECURITY UTILITIES
 * XSS защита и безопасная обработка пользовательского ввода
 */

/**
 * Экранирование HTML для защиты от XSS атак
 * Преобразует опасные символы в безопасные HTML entities
 * 
 * @param {string} text - Текст для экранирования
 * @returns {string} - Безопасный текст
 * 
 * @example
 * const userInput = '<script>alert("XSS")</script>';
 * const safe = escapeHtml(userInput);
 * // Результат: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 */
function escapeHtml(text) {
  if (!text) return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Безопасная вставка HTML контента
 * Использует DOMPurify если доступен, иначе экранирует
 * 
 * @param {HTMLElement} element - Элемент для вставки
 * @param {string} html - HTML контент
 */
function safeSetInnerHTML(element, html) {
  if (!element || !html) return;
  
  // Если доступен DOMPurify, используем его
  if (window.DOMPurify) {
    element.innerHTML = DOMPurify.sanitize(html);
  } else {
    // Иначе экранируем все HTML
    element.textContent = html;
  }
}

/**
 * Безопасная установка текстового контента
 * Всегда используйте это вместо innerHTML для пользовательского контента
 * 
 * @param {HTMLElement} element - Элемент
 * @param {string} text - Текст
 */
function safeSetText(element, text) {
  if (!element) return;
  element.textContent = text || '';
}

/**
 * Безопасная установка атрибута
 * Проверяет на опасные значения в атрибутах
 * 
 * @param {HTMLElement} element - Элемент
 * @param {string} attribute - Название атрибута
 * @param {string} value - Значение
 */
function safeSetAttribute(element, attribute, value) {
  if (!element || !attribute) return;
  
  // Опасные атрибуты, которые могут содержать JavaScript
  const dangerousAttrs = ['onclick', 'onerror', 'onload', 'onmouseover'];
  
  if (dangerousAttrs.includes(attribute.toLowerCase())) {
    console.warn(`⚠️ Попытка установить опасный атрибут: ${attribute}`);
    return;
  }
  
  // Для href и src проверяем на javascript: протокол
  if (['href', 'src'].includes(attribute.toLowerCase())) {
    if (value && value.trim().toLowerCase().startsWith('javascript:')) {
      console.warn(`⚠️ Блокирована попытка XSS через ${attribute}: ${value}`);
      return;
    }
  }
  
  element.setAttribute(attribute, value || '');
}

/**
 * Создание безопасного элемента с текстом
 * 
 * @param {string} tag - Тег элемента (например 'div', 'span')
 * @param {string} text - Текст элемента
 * @param {string} className - CSS класс (опционально)
 * @returns {HTMLElement} - Созданный элемент
 */
function createSafeElement(tag, text, className = '') {
  const element = document.createElement(tag);
  
  if (text) {
    element.textContent = text;
  }
  
  if (className) {
    element.className = className;
  }
  
  return element;
}

/**
 * Валидация URL для защиты от опасных протоколов
 * 
 * @param {string} url - URL для проверки
 * @returns {boolean} - true если URL безопасен
 */
function isUrlSafe(url) {
  if (!url || typeof url !== 'string') return false;
  
  const trimmed = url.trim().toLowerCase();
  
  // Опасные протоколы
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  
  for (const protocol of dangerousProtocols) {
    if (trimmed.startsWith(protocol)) {
      console.warn(`⚠️ Заблокирован опасный URL: ${url}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Безопасное перенаправление
 * 
 * @param {string} url - URL для перенаправления
 */
function safeRedirect(url) {
  if (!isUrlSafe(url)) {
    console.error('❌ Попытка перенаправления на небезопасный URL заблокирована');
    return;
  }
  
  window.location.href = url;
}

/**
 * Очистка данных формы от опасного контента
 * 
 * @param {Object} formData - Данные формы
 * @returns {Object} - Очищенные данные
 */
function sanitizeFormData(formData) {
  if (!formData || typeof formData !== 'object') return {};
  
  const clean = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      // Удаляем потенциально опасные символы из строк
      clean[key] = value
        .replace(/<script[^>]*>.*?<\/script>/gi, '') // Удаляем script теги
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Удаляем iframe теги
        .trim();
    } else if (typeof value === 'object' && value !== null) {
      // Рекурсивно очищаем вложенные объекты
      clean[key] = sanitizeFormData(value);
    } else {
      clean[key] = value;
    }
  }
  
  return clean;
}

/**
 * Проверка на SQL injection паттерны в строке
 * (Дополнительная проверка на фронтенде, основная защита на бэкенде через Prisma)
 * 
 * @param {string} input - Входная строка
 * @returns {boolean} - true если обнаружены подозрительные паттерны
 */
function containsSqlInjection(input) {
  if (!input || typeof input !== 'string') return false;
  
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|;|\*|\/\*|\*\/)/,
    /(\bOR\b.*=.*)/i,
    /(\bAND\b.*=.*)/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Универсальная очистка строки от опасного контента
 * 
 * @param {string} str - Строка для очистки
 * @returns {string} - Очищенная строка
 */
function sanitizeString(str) {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .replace(/<[^>]*>/g, '') // Удаляем все HTML теги
    .replace(/[<>"']/g, '') // Удаляем опасные символы
    .trim();
}

// Экспортируем в глобальную область
window.escapeHtml = escapeHtml;
window.safeSetInnerHTML = safeSetInnerHTML;
window.safeSetText = safeSetText;
window.safeSetAttribute = safeSetAttribute;
window.createSafeElement = createSafeElement;
window.isUrlSafe = isUrlSafe;
window.safeRedirect = safeRedirect;
window.sanitizeFormData = sanitizeFormData;
window.containsSqlInjection = containsSqlInjection;
window.sanitizeString = sanitizeString;

console.log('🔒 Security utilities loaded - XSS protection enabled');
