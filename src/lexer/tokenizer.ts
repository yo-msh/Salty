// This module defines the tokenizer for the language.
// It takes a string input and converts it into an array of tokens.
// Each token has a type and a value.

import { KEYWORDS, SYMBOLS, Token, TokenType } from './constants';

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;

  const isLetter = (ch: string) => /[a-z]/i.test(ch);
  const isDigit = (ch: string) => /[0-9]/.test(ch);

  while (cursor < input.length) {
    const char = input[cursor];

    if (/\s/.test(char)) {
      cursor++;
      continue;
    }

    if (isLetter(char)) {
      let word = "";
      while (cursor < input.length && isLetter(input[cursor])) {
        word += input[cursor++];
      }

      const type: TokenType = KEYWORDS.includes(word) ? "keyword" : "identifier";
      tokens.push({ type, value: word });
      continue;
    }

    if (isDigit(char)) {
      let number = "";
      while (cursor < input.length && (isDigit(input[cursor]) || input[cursor] === '.')) {
        number += input[cursor++];
      }
      
      // Check for multiple decimal points
      if (number.split('.').length > 2) {
        throw new Error(`Invalid number format: ${number}`);
      }
    
      tokens.push({ type: "number", value: number });
      continue;
    }
    

    if (SYMBOLS.includes(char)) {
      tokens.push({ type: "symbol", value: char });
      cursor++;
      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  return tokens;
}
