import React from 'react';

/**
 * Simple markdown renderer utility
 * Handles basic markdown formatting for chatbot messages
 */

/**
 * Renders basic markdown formatting to HTML
 * @param {string} text - Text with markdown formatting
 * @returns {string} HTML string with formatting applied
 */
export const renderMarkdown = (text) => {
  if (!text) return '';

  let html = text;

  // Bold text: **text** -> <strong>text</strong> with inline styles
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 700;">$1</strong>');

  // Italic text: *text* -> <em>text</em> (only single asterisks, not part of bold)
  html = html.replace(/\*([^*]+?)\*/g, '<em style="font-style: italic;">$1</em>');

  // Underline: __text__ -> <u>text</u>
  html = html.replace(/__(.*?)__/g, '<u style="text-decoration: underline;">$1</u>');

  // Code blocks: `code` -> <code>code</code>
  html = html.replace(/`([^`]+)`/g, '<code style="background-color: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; font-family: monospace;">$1</code>');

  // Bullet points: * item or - item at start of line
  html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li style="margin-left: 20px;">$1</li>');
  
  // Wrap consecutive list items in <ul>
  html = html.replace(/(<li.*?<\/li>(\n|<br>)?)+/g, '<ul style="list-style-type: disc; margin: 8px 0; padding-left: 20px;">$&</ul>');

  // Line breaks: \n -> <br>
  html = html.replace(/\n/g, '<br>');

  return html;
};

/**
 * React component that renders markdown text
 * @param {Object} props
 * @param {string} props.children - Text with markdown formatting
 * @param {string} props.className - CSS classes for the element
 */
export const MarkdownText = ({ children, className = '' }) => {
  const html = renderMarkdown(children);

  return (
    <div
      className={`${className} markdown-content`}
      style={{ 
        wordWrap: 'break-word',
        whiteSpace: 'normal'
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
