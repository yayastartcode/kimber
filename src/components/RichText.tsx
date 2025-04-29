import React from 'react';

interface RichTextProps {
  content: any;
}

const RichText: React.FC<RichTextProps> = ({ content }) => {
  // If content is not provided or null
  if (!content) {
    return null;
  }

  // If content is a string, render it directly
  if (typeof content === 'string') {
    return <p>{content}</p>;
  }

  // Handle rich text object with root property (common in rich text editors)
  if (typeof content === 'object') {
    try {
      // Handle Lexical editor format (with type, format, children array)
      if (content.type === 'paragraph' && Array.isArray(content.children)) {
        return (
          <div className="rich-text">
            <p>
              {content.children.map((child: any, i: number) => {
                let textContent = child.text || '';
                
                // Apply formatting based on format property if available
                if (child.format && (child.format & 1)) textContent = <strong key={`bold-${i}`}>{textContent}</strong>;
                if (child.format && (child.format & 2)) textContent = <em key={`italic-${i}`}>{textContent}</em>;
                if (child.format && (child.format & 4)) textContent = <u key={`underline-${i}`}>{textContent}</u>;
                
                return <React.Fragment key={i}>{textContent}</React.Fragment>;
              })}
            </p>
          </div>
        );
      }
      
      // For simple rich text objects that have text content (Slate/Payload format)
      if (content.root && Array.isArray(content.root.children)) {
        return (
          <div className="rich-text">
            {content.root.children.map((node: any, i: number) => {
              // Text node
              if (node.text) {
                let textContent = node.text;
                
                // Apply formatting if available
                if (node.bold) textContent = <strong key={i}>{textContent}</strong>;
                if (node.italic) textContent = <em key={i}>{textContent}</em>;
                if (node.underline) textContent = <u key={i}>{textContent}</u>;
                
                return <span key={i}>{textContent}</span>;
              }
              
              // Paragraph node
              if (node.type === 'paragraph') {
                return (
                  <p key={i}>
                    {node.children?.map((child: any, j: number) => {
                      let textContent = child.text || '';
                      
                      // Apply formatting if available
                      if (child.bold) textContent = <strong key={`bold-${j}`}>{textContent}</strong>;
                      if (child.italic) textContent = <em key={`italic-${j}`}>{textContent}</em>;
                      if (child.underline) textContent = <u key={`underline-${j}`}>{textContent}</u>;
                      
                      return <React.Fragment key={j}>{textContent}</React.Fragment>;
                    })}
                  </p>
                );
              }
              
              // Heading nodes
              if (node.type === 'h1') return <h1 key={i}>{node.children?.[0]?.text || ''}</h1>;
              if (node.type === 'h2') return <h2 key={i}>{node.children?.[0]?.text || ''}</h2>;
              if (node.type === 'h3') return <h3 key={i}>{node.children?.[0]?.text || ''}</h3>;
              if (node.type === 'h4') return <h4 key={i}>{node.children?.[0]?.text || ''}</h4>;
              
              // List nodes
              if (node.type === 'ul') {
                return (
                  <ul key={i}>
                    {node.children?.map((li: any, k: number) => (
                      <li key={k}>
                        {li.children?.map((liChild: any, l: number) => (
                          <React.Fragment key={l}>{liChild.text || ''}</React.Fragment>
                        ))}
                      </li>
                    ))}
                  </ul>
                );
              }
              
              if (node.type === 'ol') {
                return (
                  <ol key={i}>
                    {node.children?.map((li: any, k: number) => (
                      <li key={k}>
                        {li.children?.map((liChild: any, l: number) => (
                          <React.Fragment key={l}>{liChild.text || ''}</React.Fragment>
                        ))}
                      </li>
                    ))}
                  </ol>
                );
              }
              
              // Default fallback
              return <span key={i}>{JSON.stringify(node)}</span>;
            })}
          </div>
        );
      }
      
      // Fallback for unknown rich text format
      return <div>{JSON.stringify(content)}</div>;
    } catch (error) {
      console.error('Error rendering rich text:', error);
      return <div>Error rendering content</div>;
    }
  }

  // Fallback for unknown content type
  return <div>{String(content)}</div>;
};

export default RichText;
