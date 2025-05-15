'use client';

import { useState, FormEvent } from 'react';
import MarkdownDisplay from './components/markdown-display';
import ContentModal from './components/content-modal';

interface N8NResponse {
  succcess?: boolean; // From n8n webhook
  success?: boolean;  // For internal consistency or if n8n changes
  title?: string;
  msg?: string;      
  abstract?: string; 
  highlights?: string[]; 
  error?: string; // Error message from n8n or client-side
}

export default function HomePage() {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<N8NResponse | null>(null); // Use N8NResponse directly
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setIsModalOpen(false); 

    if (!url.trim()) {
      setError('请输入有效的 URL。');
      setLoading(false);
      return;
    }

    const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://n8n.judyplan.com/webhook/fecth-url"; // Use client-side env var

    try {
      // Direct call to n8n webhook from client-side
      const response = await fetch(n8nWebhookUrl, { // Changed to n8nWebhookUrl
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: url }),
      });

      const data: N8NResponse = await response.json();

      if (!response.ok) {
        // If n8n itself returns an error status
        throw new Error(data.error || `n8n webhook 请求失败，状态码: ${response.status}`);
      }
      
      // Check the 'succcess' field from n8n's response payload primarily, fallback to 'success'
      const n8nCallWasSuccessful = data.succcess === true || data.success === true;

      if (n8nCallWasSuccessful) {
        setResult({
            ...data, // Spread all data from n8n
            success: true // Ensure our internal success flag is set for UI logic
        });
      } else {
        setError(data.error || 'n8n webhook 操作失败但未提供具体错误信息。');
      }
    } catch (err: any) {
      // Handle network errors or JSON parsing errors
      console.error("Error calling n8n or parsing response:", err);
      setError(err.message || '调用 n8n 服务或解析响应时发生错误。');
    }
    setLoading(false);
  };

  const openModalWithContent = () => {
    if (result && result.msg) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const handleDownloadMarkdown = () => {
    if (!result || !result.msg) return;

    const filename = result.title ? `${result.title.replace(/[^a-z0-9_\-\[\]\s]/gi, '_').substring(0, 50)}.md` : "content.md";
    const blob = new Blob([result.msg], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
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
              disabled={loading} 
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={loading} 
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                提取中...
              </>
            ) : (
              '提取内容'
            )}
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
            {result.title && <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">{result.title}</h2>}
            
            {result.abstract && (
              <section className="relative p-4 border border-gray-200 rounded-lg shadow-sm bg-slate-50">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-700">摘要内容:</h3>
                  {result.msg && ( 
                    <button
                      onClick={openModalWithContent} 
                      className="absolute top-4 right-4 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition duration-150 ease-in-out whitespace-nowrap"
                    >
                      阅读原文
                    </button>
                  )}
                </div>
                <MarkdownDisplay markdownContent={result.abstract} />
              </section>
            )}

            {result.highlights && result.highlights.length > 0 && (
              <section className="mt-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-slate-50">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">重点内容:</h3>
                
                <div className="space-y-4">
                  {result.highlights.map((highlight, index) => (
                    <blockquote key={index} className="p-3 my-2 border-l-4 border-gray-400 bg-gray-100 rounded-r-md">
                      <div className="text-gray-700 italic text-sm">
                        <MarkdownDisplay markdownContent={highlight} />
                      </div>
                    </blockquote>
                  ))}
                </div>
              </section>
            )}
 
            <ContentModal 
              isOpen={isModalOpen}
              onClose={closeModal}
              title={result.title}
              content={result.msg}
              onDownload={handleDownloadMarkdown}
            />
          </div>
        )}
      </div>
    </main>
  );
} 