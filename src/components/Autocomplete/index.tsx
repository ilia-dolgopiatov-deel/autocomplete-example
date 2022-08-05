import React, { useState, useRef } from 'react';
import HighlightedText from '../HighlightedText';
import './index.css';

const scrollToChild = (parent: HTMLElement, idx: number) => {
  if (!parent) return;

  const element = parent.children[idx] as HTMLElement;
  const needScrollBottom =
    element.offsetTop + element.clientHeight >
    parent.clientHeight + parent.scrollTop;
  const needScrollTop =
    element.offsetTop - element.clientHeight < parent.scrollTop;
  if (needScrollBottom) {
    parent.scrollTop =
      element.offsetTop + element.clientHeight - parent.clientHeight;
  } else if (needScrollTop) {
    parent.scrollTop = element.offsetTop;
  }
};

const Autocomplete: React.FC<{
  value: string;
  onChange: (v: string) => void;
  suggestions: { name: string; id: string | number }[];
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, suggestions, placeholder, className }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [activeItem, setActiveItem] = useState<number>(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const selectSuggested = (idx: number) => {
    const value = suggestions[idx].name;
    if (value) {
      onChange(value);
      setActiveItem(-1);
      setShowSuggestions(false);
    }
  };
  const handleSelect = (idx: number) => {
    if (idx < 0) {
      // If there's only 1 suggest, select it, else noop
      if (suggestions.length === 1) {
        selectSuggested(0);
      }
    } else {
      selectSuggested(idx);
    }
  };

  const handleKeyboardEvents = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown': {
        return setActiveItem((active) => {
          const newIdx = Math.min(active + 1, suggestions.length - 1);
          scrollToChild(listRef.current!, newIdx);
          return newIdx;
        });
      }
      case 'ArrowUp': {
        return setActiveItem((active) => {
          const newIdx = Math.max(active - 1, 0);
          scrollToChild(listRef.current!, newIdx);
          return newIdx;
        });
      }
      case 'Enter': {
        handleSelect(activeItem);
      }
    }
  };

  const isSuggestVisible = showSuggestions && value && suggestions.length > 0;

  return (
    <div className={className}>
      <input
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)}
        onKeyDown={handleKeyboardEvents}
        type="text"
        className="input"
        value={value}
        placeholder={placeholder}
        onChange={(v) => {
          setActiveItem(-1);
          onChange(v.target.value);
          setShowSuggestions(true);
        }}
      />
      {isSuggestVisible ? (
        <ul className="suggestions" ref={listRef}>
          {suggestions.map((suggest, idx) => (
            <li
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(idx);
              }}
              onMouseEnter={() => setActiveItem(idx)}
              className={`${activeItem === idx ? 'active' : ''} suggestionItem`}
              key={suggest.id}
            >
              <HighlightedText text={value}>{suggest.name}</HighlightedText>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default Autocomplete;
