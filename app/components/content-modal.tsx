'use client';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState } from 'react';
import MarkdownDisplay from './markdown-display';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | undefined;
  content: string | undefined;
  onDownload?: () => void; // Placeholder for download function
}

export default function ContentModal({
  isOpen,
  onClose,
  title,
  content,
  onDownload
}: ContentModalProps) {
  const [copyButtonText, setCopyButtonText] = useState('复制全文');

  const handleCopyToClipboard = async () => {
    if (content) {
      try {
        await navigator.clipboard.writeText(content);
        setCopyButtonText('已复制!');
        setTimeout(() => {
          setCopyButtonText('复制全文');
        }, 2000); // Reset text after 2 seconds
      } catch (err) {
        console.error('无法复制文本: ', err);
        setCopyButtonText('复制失败');
        setTimeout(() => {
          setCopyButtonText('复制全文');
        }, 2000);
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {title && (
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4"
                  >
                    {title}
                  </DialogTitle>
                )}
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                  {content ? (
                    <MarkdownDisplay markdownContent={content} />
                  ) : (
                    <p>没有可显示的内容。</p>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  {content && (
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 transition-colors disabled:opacity-50"
                      onClick={handleCopyToClipboard}
                      disabled={copyButtonText !== '复制全文'}
                    >
                      {copyButtonText}
                    </button>
                  )}
                  {onDownload && content && (
                     <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                        onClick={onDownload} >
                        下载文件
                     </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors"
                    onClick={onClose}
                  >
                    关闭
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 