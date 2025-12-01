package aoc

import (
	"fmt"
	"regexp"
	"strings"

	"golang.org/x/net/html"
)

// HTMLToMarkdown converts HTML content to Markdown
// This implementation aims to match the TypeScript Turndown-based converter
type HTMLToMarkdown struct {
	baseURL string
}

// NewHTMLToMarkdown creates a new converter
func NewHTMLToMarkdown() *HTMLToMarkdown {
	return &HTMLToMarkdown{
		baseURL: "https://adventofcode.com",
	}
}

// Convert converts HTML to Markdown
func (h *HTMLToMarkdown) Convert(htmlContent string) (string, error) {
	doc, err := html.Parse(strings.NewReader(htmlContent))
	if err != nil {
		return "", fmt.Errorf("failed to parse HTML: %w", err)
	}

	var result strings.Builder
	h.processNode(doc, &result, false)

	// Clean up the result
	markdown := result.String()
	markdown = h.cleanupMarkdown(markdown)

	// Ensure trailing newline
	if !strings.HasSuffix(markdown, "\n") {
		markdown += "\n"
	}

	return markdown, nil
}

// processNode recursively processes HTML nodes
func (h *HTMLToMarkdown) processNode(n *html.Node, result *strings.Builder, inCode bool) {
	switch n.Type {
	case html.TextNode:
		text := n.Data
		if !inCode {
			// Escape markdown special characters outside of code
			text = h.escapeMarkdown(text)
		}
		result.WriteString(text)

	case html.ElementNode:
		h.processElement(n, result, inCode)

	case html.DocumentNode:
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			h.processNode(c, result, inCode)
		}
	}
}

// processElement handles specific HTML elements
func (h *HTMLToMarkdown) processElement(n *html.Node, result *strings.Builder, inCode bool) {
	tag := strings.ToLower(n.Data)

	// Skip certain elements
	if tag == "script" || tag == "header" {
		return
	}

	// Check for sponsor class and skip
	if hasClass(n, "sponsor") {
		return
	}

	switch tag {
	case "h1":
		result.WriteString("# ")
		h.processChildren(n, result, inCode)
		result.WriteString("\n\n")

	case "h2":
		result.WriteString("## ")
		h.processChildren(n, result, inCode)
		result.WriteString("\n\n")

	case "h3":
		result.WriteString("### ")
		h.processChildren(n, result, inCode)
		result.WriteString("\n\n")

	case "h4":
		result.WriteString("#### ")
		h.processChildren(n, result, inCode)
		result.WriteString("\n\n")

	case "p":
		h.processChildren(n, result, inCode)
		result.WriteString("\n\n")

	case "article":
		h.processChildren(n, result, inCode)
		result.WriteString("\n")

	case "br":
		result.WriteString("\n")

	case "hr":
		result.WriteString("\n---\n")

	case "strong", "b":
		result.WriteString("**")
		h.processChildren(n, result, inCode)
		result.WriteString("**")

	case "em", "i":
		if inCode {
			// Drop emphasis within code blocks
			h.processChildren(n, result, inCode)
		} else if isParentCode(n) {
			// Handle emphasized code: move emphasis outside
			result.WriteString("**`")
			h.processChildren(n, result, true)
			result.WriteString("`**")
		} else {
			result.WriteString("**")
			h.processChildren(n, result, inCode)
			result.WriteString("**")
		}

	case "code":
		if hasOnlyEmChild(n) {
			// Emphasized code block - move emphasis outside
			result.WriteString("**`")
			h.processChildren(n, result, true)
			result.WriteString("`**")
		} else {
			result.WriteString("`")
			h.processChildren(n, result, true)
			result.WriteString("`")
		}

	case "pre":
		if isOnlyCodeChild(n) {
			result.WriteString("\n```\n")
			h.processChildren(n.FirstChild, result, true)
			result.WriteString("\n```\n\n")
		} else {
			result.WriteString("\n```\n")
			h.processChildren(n, result, true)
			result.WriteString("\n```\n\n")
		}

	case "a":
		href := getAttr(n, "href")
		if href != "" {
			// Make relative URLs absolute
			if strings.HasPrefix(href, "/") {
				href = h.baseURL + href
			}
			result.WriteString("<a href=\"")
			result.WriteString(href)
			result.WriteString("\" target=\"_blank\">")
			h.processChildren(n, result, inCode)
			result.WriteString("</a>")
		} else {
			h.processChildren(n, result, inCode)
		}

	case "ul":
		result.WriteString("\n")
		h.processListItems(n, result, "* ", inCode)
		result.WriteString("\n")

	case "ol":
		result.WriteString("\n")
		h.processOrderedListItems(n, result, inCode)
		result.WriteString("\n")

	case "li":
		h.processChildren(n, result, inCode)

	case "span":
		// Keep spans for alternate text (title attributes)
		title := getAttr(n, "title")
		if title != "" {
			result.WriteString("<span title=\"")
			result.WriteString(title)
			result.WriteString("\">")
			h.processChildren(n, result, inCode)
			result.WriteString("</span>")
		} else {
			h.processChildren(n, result, inCode)
		}

	case "blockquote":
		var content strings.Builder
		h.processChildren(n, &content, inCode)
		lines := strings.Split(strings.TrimSpace(content.String()), "\n")
		for _, line := range lines {
			result.WriteString("> ")
			result.WriteString(line)
			result.WriteString("\n")
		}
		result.WriteString("\n")

	default:
		// Process children for unknown elements
		h.processChildren(n, result, inCode)
	}
}

// processChildren processes all child nodes
func (h *HTMLToMarkdown) processChildren(n *html.Node, result *strings.Builder, inCode bool) {
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		h.processNode(c, result, inCode)
	}
}

// processListItems processes unordered list items
func (h *HTMLToMarkdown) processListItems(n *html.Node, result *strings.Builder, prefix string, inCode bool) {
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if c.Type == html.ElementNode && strings.ToLower(c.Data) == "li" {
			result.WriteString(prefix)
			var content strings.Builder
			h.processChildren(c, &content, inCode)
			// Remove leading/trailing whitespace from list items
			result.WriteString(strings.TrimSpace(content.String()))
			result.WriteString("\n")
		}
	}
}

// processOrderedListItems processes ordered list items
func (h *HTMLToMarkdown) processOrderedListItems(n *html.Node, result *strings.Builder, inCode bool) {
	index := 1
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if c.Type == html.ElementNode && strings.ToLower(c.Data) == "li" {
			result.WriteString(fmt.Sprintf("%d. ", index))
			var content strings.Builder
			h.processChildren(c, &content, inCode)
			result.WriteString(strings.TrimSpace(content.String()))
			result.WriteString("\n")
			index++
		}
	}
}

// escapeMarkdown escapes special markdown characters
func (h *HTMLToMarkdown) escapeMarkdown(text string) string {
	// Don't escape too aggressively, only escape characters that would cause issues
	// Preserve readability
	text = strings.ReplaceAll(text, "_", "\\_")
	text = strings.ReplaceAll(text, "*", "\\*")
	return text
}

// cleanupMarkdown cleans up the generated markdown
func (h *HTMLToMarkdown) cleanupMarkdown(md string) string {
	// Remove excessive blank lines (more than 2 consecutive)
	re := regexp.MustCompile(`\n{3,}`)
	md = re.ReplaceAllString(md, "\n\n")

	// Remove trailing whitespace from lines
	lines := strings.Split(md, "\n")
	for i, line := range lines {
		lines[i] = strings.TrimRight(line, " \t")
	}
	md = strings.Join(lines, "\n")

	// Collapse double spaces after periods
	md = regexp.MustCompile(`\.  `).ReplaceAllString(md, ". ")

	// Trim leading and trailing whitespace
	md = strings.TrimSpace(md)

	return md
}

// Helper functions

func getAttr(n *html.Node, key string) string {
	for _, attr := range n.Attr {
		if attr.Key == key {
			return attr.Val
		}
	}
	return ""
}

func hasClass(n *html.Node, class string) bool {
	classes := getAttr(n, "class")
	for _, c := range strings.Fields(classes) {
		if c == class {
			return true
		}
	}
	return false
}

func isParentCode(n *html.Node) bool {
	if n.Parent != nil && n.Parent.Type == html.ElementNode {
		return strings.ToLower(n.Parent.Data) == "code"
	}
	return false
}

func hasOnlyEmChild(n *html.Node) bool {
	emCount := 0
	otherCount := 0
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if c.Type == html.ElementNode && strings.ToLower(c.Data) == "em" {
			emCount++
		} else if c.Type == html.TextNode && strings.TrimSpace(c.Data) != "" {
			otherCount++
		} else if c.Type == html.ElementNode {
			otherCount++
		}
	}
	return emCount == 1 && otherCount == 0
}

// isOnlyCodeChild returns true if n has exactly one child and it is a <code> element
func isOnlyCodeChild(n *html.Node) bool {
	return n.FirstChild != nil &&
		n.FirstChild.Type == html.ElementNode &&
		strings.ToLower(n.FirstChild.Data) == "code" &&
		n.FirstChild.NextSibling == nil
}
