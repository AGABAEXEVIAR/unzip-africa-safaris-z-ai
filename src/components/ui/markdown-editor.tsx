"use client";

/**
 * MarkdownEditor — a thin wrapper around @mdxeditor/editor with a formatting
 * toolbar (bold, italic, underline, headings, lists, quotes, links, undo/redo).
 *
 * Used by the Admin dashboard Blog editor for both the title (when
 * `allowBlockFormatting=false`) and the body.
 *
 * The editor stores its value as Markdown — perfect for rendering on the
 * front-end blog page via react-markdown.
 */

import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
  InsertThematicBreak,
  UndoRedo,
  Separator,
  codeBlockPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { forwardRef, useMemo } from "react";

export type MarkdownEditorProps = Omit<MDXEditorProps, "ref"> & {
  /** Hide the formatting toolbar (useful for a small / inline editor). */
  hideToolbar?: boolean;
  /** Compact height for use as a single-line-ish field. */
  compact?: boolean;
  /** Custom class name applied to the editor root. */
  className?: string;
};

export const MarkdownEditor = forwardRef<MDXEditorMethods, MarkdownEditorProps>(
  function MarkdownEditor(
    { hideToolbar = false, compact = false, className, ...props },
    ref
  ) {
    // Plugin set: every plugin we want enabled. Memoized so re-renders don't
    // rebuild the plugin array (which would reset the editor state).
    const plugins = useMemo(() => {
      const list = [
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        markdownShortcutPlugin(),
        codeBlockPlugin(),
      ];

      if (!hideToolbar) {
        list.push(
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <BlockTypeSelect />
                <ListsToggle />
                <Separator />
                <CreateLink />
                <InsertThematicBreak />
              </>
            ),
          })
        );
      }
      return list;
    }, [hideToolbar]);

    return (
      <MDXEditor
        ref={ref}
        plugins={plugins}
        contentEditableClassName={`prose-editor ${compact ? "compact" : ""} ${
          className ?? ""
        }`}
        {...props}
      />
    );
  }
);
