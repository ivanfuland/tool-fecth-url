'use client';

import { useState, FormEvent } from 'react';
import MarkdownDisplay from './(components)/markdown-display';

interface FetchResult {
  success: boolean;
  title?: string;
  msg?: string;      // Full content in Markdown
  abstract?: string; // Summary in Markdown
  highlights?: string[]; // Added highlights
  error?: string;
}

export default function HomePage() {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FetchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFullContent, setShowFullContent] = useState<boolean>(false); // New state for toggling full content

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setShowFullContent(false); // Reset on new submission

    if (!url.trim()) {
      setError('请输入有效的 URL。');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: url }),
      });

      const data: FetchResult = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `请求失败，状态码：${response.status}`);
      }
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || '从n8n获取内容失败，但未返回具体错误信息。');
      }
    } catch (err: any) {
      setError(err.message || '发生未知错误。');
    }
    setLoading(false);
  };

  return (
    <main className="container mx-auto p-4 min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">URL 内容提取器</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div>
            <label htmlFor="urlInput" className="block text-sm font-medium text-gray-700 mb-1">
              输入 URL:
            </label>
            <input
              id="urlInput"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="例如：https://www.example.com"
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 transition duration-150 ease-in-out"
          >
            {loading ? '提取中...' : '提取内容'}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">错误：</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {result && result.success && (
          <div className="space-y-8">
            {result.title && <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">{result.title}</h2>}
            
            {result.abstract && (
              <section>
                <h3 className="text-xl font-semibold text-gray-600 mb-3">摘要内容:</h3>
                <MarkdownDisplay markdownContent={result.abstract} />
              </section>
            )}

            {result.highlights && result.highlights.length > 0 && (
              <section>
                <h3 className="text-xl font-semibold text-gray-600 mb-3">重点内容:</h3>
                <div className="space-y-4">
                  {result.highlights.map((highlight, index) => (
                    <blockquote key={index} className="p-4 my-4 border-l-4 border-gray-300 bg-gray-50">
                      <p className="text-gray-700 italic">
                        <MarkdownDisplay markdownContent={highlight} />
                      </p>
                    </blockquote>
                  ))}
                </div>
              </section>
            )}

            {result.msg && (
              <section>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-gray-600">完整内容:</h3>
                  <button
                    onClick={() => setShowFullContent(!showFullContent)}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    {showFullContent ? '隐藏完整内容' : '显示完整内容'}
                  </button>
                </div>
                {showFullContent && (
                  <MarkdownDisplay markdownContent={result.msg} />
                )}
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 