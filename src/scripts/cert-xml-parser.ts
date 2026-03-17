/**
 * Certification XML Parser
 * Loads and parses certification exam XML files
 */

export interface CertExamData {
  metadata: CertExamMetadata;
  questions: CertQuestion[];
  glossary: Record<string, CertGlossaryTerm>;
}

export interface CertExamMetadata {
  examCode: string;
  examTitle: string;
  provider: string;
  description: string;
  totalQuestions: number;
  createdDate: string;
  lastModified: string;
  categories: Record<string, string>;
}

export interface CertQuestion {
  id: number;
  categoryRef: string;
  difficulty: string;
  title: string;
  scenario: string;
  questionText: string;
  choices: CertChoice[];
  correctAnswer: string;
  hints: CertHint[];
  tags: string[];
}

export interface CertChoice {
  letter: string;
  text: string;
}

export interface CertHint {
  level: number;
  label: string;
  content: string;
}

export interface CertGlossaryTerm {
  id: string;
  category: string;
  name: string;
  definition: string;
  examNote: string;
  relatedTerms: string[];
}

export class CertXMLParser {
  private parser: DOMParser;

  constructor() {
    this.parser = new DOMParser();
  }

  async loadExam(examPath: string): Promise<CertExamData> {
    try {
      const xmlText = await this.fetchXML(examPath);
      return this.parseExam(xmlText);
    } catch (fetchError) {
      if (window.location.protocol === 'file:') {
        try {
          const xmlText = await this.loadXMLHttpRequest(examPath);
          return this.parseExam(xmlText);
        } catch {
          throw new Error(
            'Cannot load exam files with file:// protocol. ' +
            'Please use a local server.'
          );
        }
      }
      throw fetchError;
    }
  }

  private async fetchXML(examPath: string): Promise<string> {
    const response = await fetch(examPath);
    if (!response.ok) {
      throw new Error(`Failed to load exam: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }

  private loadXMLHttpRequest(examPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', examPath, true);
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 0) {
          resolve(xhr.responseText);
        } else {
          reject(new Error(`XHR failed: ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error('XHR network error'));
      xhr.send();
    });
  }

  private parseExam(xmlText: string): CertExamData {
    const doc = this.parser.parseFromString(xmlText, 'application/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error('XML parsing error: ' + parseError.textContent);
    }

    return {
      metadata: this.parseMetadata(doc),
      questions: this.parseQuestions(doc),
      glossary: this.parseGlossary(doc)
    };
  }

  private parseMetadata(doc: Document): CertExamMetadata {
    const metadata = doc.querySelector('metadata');
    if (!metadata) {
      throw new Error('No metadata found in exam XML');
    }

    return {
      examCode: this.getText(metadata, 'exam-code'),
      examTitle: this.getText(metadata, 'exam-title'),
      provider: this.getText(metadata, 'provider'),
      description: this.getText(metadata, 'description'),
      totalQuestions: parseInt(this.getText(metadata, 'total-questions')) || 0,
      createdDate: this.getText(metadata, 'created-date'),
      lastModified: this.getText(metadata, 'last-modified'),
      categories: this.parseCategories(metadata)
    };
  }

  private parseCategories(metadata: Element): Record<string, string> {
    const categories: Record<string, string> = {};
    const categoryElements = metadata.querySelectorAll('categories > category');
    categoryElements.forEach(cat => {
      const id = cat.getAttribute('id');
      if (id) {
        categories[id] = (cat.textContent || '').trim();
      }
    });
    return categories;
  }

  private parseQuestions(doc: Document): CertQuestion[] {
    const questions: CertQuestion[] = [];
    const questionElements = doc.querySelectorAll('questions > question');

    questionElements.forEach(q => {
      const categoryRef = q.getAttribute('category-ref') || this.getText(q, 'category-ref') || '';
      const difficulty = q.getAttribute('difficulty') || this.getText(q, 'difficulty') || 'intermediate';

      questions.push({
        id: parseInt(q.getAttribute('id') || '') || questions.length + 1,
        categoryRef,
        difficulty,
        title: this.getText(q, 'title'),
        scenario: this.getInnerHTML(q, 'scenario'),
        questionText: this.getInnerHTML(q, 'question-text'),
        choices: this.parseChoices(q),
        correctAnswer: this.getText(q, 'correct-answer'),
        hints: this.parseHints(q),
        tags: this.parseTags(q)
      });
    });

    return questions;
  }

  private parseChoices(questionElement: Element): CertChoice[] {
    const choices: CertChoice[] = [];
    const choiceElements = questionElement.querySelectorAll('choices > choice');

    choiceElements.forEach(c => {
      const letter = c.getAttribute('letter') || c.getAttribute('id') || '';
      choices.push({
        letter,
        text: (c.textContent || '').trim()
      });
    });

    choices.sort((a, b) => a.letter.localeCompare(b.letter));
    return choices;
  }

  private parseHints(questionElement: Element): CertHint[] {
    const hints: CertHint[] = [];
    const hintElements = questionElement.querySelectorAll('hints > hint');

    hintElements.forEach(h => {
      let content = this.getInnerHTML(h, 'content');
      if (!content) {
        content = (h.textContent || '').trim();
      }

      hints.push({
        level: parseInt(h.getAttribute('level') || '1') || 1,
        label: h.getAttribute('label') || `Level ${h.getAttribute('level')}`,
        content
      });
    });

    hints.sort((a, b) => a.level - b.level);
    return hints;
  }

  private parseTags(questionElement: Element): string[] {
    const tags: string[] = [];
    const tagElements = questionElement.querySelectorAll('tags > tag');
    tagElements.forEach(t => tags.push((t.textContent || '').trim()));
    return tags;
  }

  private parseGlossary(doc: Document): Record<string, CertGlossaryTerm> {
    const glossary: Record<string, CertGlossaryTerm> = {};
    const termElements = doc.querySelectorAll('glossary > term');

    termElements.forEach(t => {
      const id = t.getAttribute('id');
      if (id) {
        glossary[id] = {
          id,
          category: t.getAttribute('category') || '',
          name: this.getText(t, 'name'),
          definition: this.getInnerHTML(t, 'definition'),
          examNote: this.getText(t, 'exam-note'),
          relatedTerms: this.parseRelatedTerms(t)
        };
      }
    });

    return glossary;
  }

  private parseRelatedTerms(termElement: Element): string[] {
    const refs: string[] = [];
    const refElements = termElement.querySelectorAll('related-terms > term-ref');
    refElements.forEach(r => refs.push((r.textContent || '').trim()));
    return refs;
  }

  private getText(parent: Element, selector: string): string {
    const element = parent.querySelector(selector);
    return element ? (element.textContent || '').trim() : '';
  }

  private getInnerHTML(parent: Element, selector: string): string {
    const element = parent.querySelector(selector);
    if (!element) return '';

    let html = '';
    element.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        html += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        html += this.elementToHTML(node as Element);
      }
    });

    return html.trim();
  }

  private elementToHTML(element: Element): string {
    const tagName = element.tagName.toLowerCase();
    const allowedTags = ['p', 'strong', 'em', 'code', 'ul', 'ol', 'li'];

    if (allowedTags.includes(tagName)) {
      let inner = '';
      element.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          inner += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          inner += this.elementToHTML(node as Element);
        }
      });
      return `<${tagName}>${inner}</${tagName}>`;
    }

    return element.textContent || '';
  }
}
