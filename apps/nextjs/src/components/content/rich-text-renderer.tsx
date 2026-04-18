import type { ReactNode } from "react";

interface LexicalNode {
  type: string;
  key?: string;
  tag?: string;
  text?: string;
  format?: number;
  attributes?: {
    url?: string;
  };
  listType?: "bullet" | "number";
  children?: LexicalNode[];
  [key: string]: unknown;
}

interface LexicalContent {
  root: LexicalNode;
  [key: string]: unknown;
}

interface RichTextRendererProps {
  content: LexicalContent | null | undefined;
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content || !content.root) {
    return null;
  }

  const renderNode = (node: LexicalNode): ReactNode => {
    if (!node) return null;

    switch (node.type) {
      case "paragraph":
        return (
          <p key={node.key || Math.random()} className="mb-4">
            {node.children?.map((child, index) => (
              <span key={child.key || index}>{renderNode(child)}</span>
            ))}
          </p>
        );
      case "heading": {
        const level = node.tag || "2";
        const HeadingTag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
        return (
          <HeadingTag key={node.key || Math.random()} className="mb-4 font-bold">
            {node.children?.map((child, index) => (
              <span key={child.key || index}>{renderNode(child)}</span>
            ))}
          </HeadingTag>
        );
      }
      case "text": {
        let text: ReactNode = node.text || "";
        if (node.format) {
          if (node.format & 1) text = <strong key={Math.random()}>{text}</strong>;
          if (node.format & 2) text = <em key={Math.random()}>{text}</em>;
          if (node.format & 4) text = <code key={Math.random()}>{text}</code>;
        }
        return <span key={node.key || Math.random()}>{text}</span>;
      }
      case "link":
        return (
          <a
            key={node.key || Math.random()}
            href={node.attributes?.url || "#"}
            className="text-primary hover:underline"
          >
            {node.children?.map((child, index) => (
              <span key={child.key || index}>{renderNode(child)}</span>
            ))}
          </a>
        );
      case "list": {
        const ListTag = node.listType === "number" ? "ol" : "ul";
        return (
          <ListTag key={node.key || Math.random()} className="mb-4 ml-6 list-disc">
            {node.children?.map((child, index) => (
              <li key={child.key || index}>{renderNode(child)}</li>
            ))}
          </ListTag>
        );
      }
      case "listitem":
        return (
          <span key={node.key || Math.random()}>
            {node.children?.map((child, index) => (
              <span key={child.key || index}>{renderNode(child)}</span>
            ))}
          </span>
        );
      default:
        if (node.children) {
          return (
            <span key={node.key || Math.random()}>
              {node.children.map((child, index) => (
                <span key={child.key || index}>{renderNode(child)}</span>
              ))}
            </span>
          );
        }
        return null;
    }
  };

  return <div>{renderNode(content.root)}</div>;
}
