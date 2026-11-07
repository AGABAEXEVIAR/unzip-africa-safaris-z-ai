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
import { forwardRef, useEffect, useMemo, useRef } from "react";

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
    { hideToolbar = false, compact = false, className, markdown, ...props },
    externalRef
  ) {
    // Internal ref so we can drive the editor imperatively. MDXEditor
    // only reads the `markdown` prop ONCE on initial mount — changing it
    // later does NOT update the editor content (documented behavior).
    // That breaks the blog editor: when the admin opens an existing post
    // to edit, the body should appear in the editor, but if the editor
    // mounts before the markdown is settled (common inside a Radix Dialog
    // portal whose content mounts via animation), the body stays empty.
    //
    // Fix: keep our own ref and, in an effect, imperatively call
    // setMarkdown() whenever the `markdown` prop changes to a value that
    // differs from what the editor currently holds. The getMarkdown()
    // guard means we never call setMarkdown for content the editor
    // already has — so user typing (which flows back through onChange →
    // markdown prop) does NOT reset the cursor or fight the user.
    const internalRef = useRef<MDXEditorMethods>(null);

    useEffect(() => {
      const editor = internalRef.current;
      if (!editor || markdown === undefined || markdown === null) return;
      let current: string;
      try {
        current = editor.getMarkdown();
      } catch {
        return;
      }
      if (current !== markdown) {
        editor.setMarkdown(markdown);
      }
    }, [markdown]);

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
        ref={(instance) => {
          // Forward the instance to both our internal ref and any
          // externally-provided ref (so callers can still call
          // getMarkdown/setMarkdown from outside if they need to).
          internalRef.current = instance;
          if (typeof externalRef === "function") {
            externalRef(instance);
          } else if (externalRef) {
            externalRef.current = instance;
          }
        }}
        plugins={plugins}
        markdown={markdown}
        contentEditableClassName={`prose-editor ${compact ? "compact" : ""} ${
          className ?? ""
        }`}
        {...props}
      />
    );
  }
);
