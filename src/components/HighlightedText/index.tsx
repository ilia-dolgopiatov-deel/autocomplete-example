import React, { Fragment } from 'react';

function highlightText(text: string, query: string, className?: string) {
  const result = [];
  for (let i = 0; i < text.length; ) {
    for (let q = 0; q < query.length; q++) {
      if (text[i + q]?.toLowerCase() !== query[q].toLowerCase()) {
        result.push(text.slice(i, i + 1));
        break;
      }
      if (q === query.length - 1) {
        result.push(
          <mark className={className}>{text.slice(i, i + q + 1)}</mark>
        );
        i += q;
      }
    }
    i++;
  }
  return result.length ? result : [text];
}

const HighlightedText: React.FC<{
  text: string;
  className?: string;
  children: string;
}> = ({ children, text, className }) => {
  const highlightedArray = highlightText(children, text, className);

  return (
    <>
      {highlightedArray.map((content, idx) => (
        <Fragment key={idx}>{content}</Fragment>
      ))}
    </>
  );
};

export default HighlightedText;
