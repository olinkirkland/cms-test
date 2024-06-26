interface TextNode {
  text: string;
  type: 'text';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

interface LinkNode {
  url: string;
  type: 'link';
  children: Array<TextNode>;
}

interface ParagraphBlock {
  type: 'paragraph';
  children: Array<TextNode | LinkNode>;
}

interface ListItemBlock {
  type: 'list-item';
  children: Array<TextNode>;
}

interface ListBlock {
  type: 'list';
  format: 'ordered' | 'unordered';
  children: Array<ListItemBlock>;
}

interface QuoteBlock {
  type: 'quote';
  children: Array<TextNode>;
}

interface ImageNode {
  type: 'image';
  image: {
    formats: {
      thumbnail: {
        url: string;
      };
      small: {
        url: string;
      };
      medium: {
        url: string;
      };
      large: {
        url: string;
      };
    };
  };
}

export type MarkdownBlock = ParagraphBlock | ListBlock | QuoteBlock | ImageNode;

export function markdownJSONToHTML(markdown: MarkdownBlock[]): string {
  let html: string[] = [];

  markdown.forEach((block) => {
    switch (block.type) {
      case 'paragraph':
        html.push('<p>');
        block.children.forEach((child) => {
          if (child.type === 'text') {
            let text = child.text || '';
            if (child.bold) text = '<strong>' + text + '</strong>';
            if (child.italic) text = '<em>' + text + '</em>';
            if (child.underline) text = '<u>' + text + '</u>';
            if (child.strikethrough) text = '<s>' + text + '</s>';
            html.push(text);
          } else if (child.type === 'link') {
            let link = "<a href='" + child.url + "'>";
            child.children.forEach((linkChild) => {
              if (linkChild.type === 'text') {
                link += linkChild.text;
              }
            });
            link += '</a>';
            html.push(link);
          }
        });
        html.push('</p>');
        break;
      case 'quote':
        html.push('<blockquote>');
        block.children.forEach((child) => {
          if (child.type === 'text') html.push(child.text);
        });
        html.push('</blockquote>');
        break;
      case 'list':
        if (block.format === 'unordered') html.push('<ul>');
        else if (block.format === 'ordered') html.push('<ol>');
        block.children.forEach((listItem) => {
          html.push('<li>');
          listItem.children.forEach((listItemChild) => {
            if (listItemChild.type === 'text') html.push(listItemChild.text);
          });
          html.push('</li>');
        });
        if (block.format === 'unordered') html.push('</ul>');
        else if (block.format === 'ordered') html.push('</ol>');
        break;

      case 'image':
        const { url } = block.image.formats.thumbnail;
        html.push('<img src="' + url + '" />');
        console.log(block);
        break;
    }
  });

  return html.join('\n');
}
