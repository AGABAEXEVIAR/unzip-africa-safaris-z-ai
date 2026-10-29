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
 *
 * CRITICAL FIX for "link dialog hidden behind modal" bug:
 * The MDXEditor's linkDialogPlugin renders its popover via a Radix Portal
 * with `container: editorRootElementRef.current` — i.e. INSIDE the editor
 * DOM tree. When the editor lives inside a shadcn Dialog modal (z-index 50),
 * the link popover is trapped in the modal's stacking context. No amount
 * of z-index on the popover can escape a parent's stacking context once
 * the parent establishes one (which `position: fixed; z-index: 50` does).
 *
 * The `portalToBodyPlugin` below publishes `null` to `editorRootElementRef$`
 * so the Portal's container becomes undefined → Radix Portal falls back to
 * `document.body`. Now the link popover is a SIBLING of the Dialog modal
 * at the root stacking context, and our `z-index: 100` rule on
 * `[data-radix-popper-content-wrapper]` in globals.css actually wins.
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
  realmPlugin,
  editorRootElementRef$,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { forwardRef, useMemo } from "react";

/**
 * Tiny plugin that publishes `null` to `editorRootElementRef$` so the
 * link dialog Portal renders at document.body (escaping the modal's
 * stacking context). Without this, the link dialog is trapped inside
 * the editor DOM and any modal containing the editor will cover it.
 */
const portalToBodyPlugin = realmPlugin({
  init: (realm) => {
    realm.pub(editorRootElementRef$, null);
  },
});

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
        // MUST come before linkDialogPlugin so the editor root ref is null
        // by the time the link dialog subscribes.
        portalToBodyPlugin(),
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
