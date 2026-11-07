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
    { hideToolbar = false, compact = false, className, markdown, onChange, ...props },
    externalRef
  ) {
    // Internal ref so we can drive the editor imperatively. MDXEditor only
    // reads the `markdown` prop ONCE — it is passed as `initialMarkdown` to
    // the core plugin at mount (see MDXEditor.js line 156:
    //   `initialMarkdown: props.markdown`
    // ). Changing the prop later does NOT reload the editor.
    //
    // This breaks the blog editor: when the admin opens an existing post to
    // edit, the body should appear in the editor, but inside a Radix Dialog
    // portal (whose content mounts via animation), the editor can mount
    // before Lexical is ready, so the initial value is missed and the body
    // stays empty.
    //
    // Two-pronged fix below:
    //   (A) Suppress onChange events fired during initial-markdown
    //       normalization (the 2nd arg `initialMarkdownNormalize === true`).
    //       Without this, the editor's normalization pass can fire
    //       onChange("") during mount and CLEAR the parent's form.body
    //       before the real content is shown — a feedback loop that makes
    //       the body disappear even when it's correctly stored.
    //   (B) Imperatively push the markdown prop into the editor via
    //       setMarkdown(), with retries (backoff) to handle the editor not
    //       being ready immediately. The getMarkdown() guard means we only
    //       call setMarkdown when the editor's content actually differs from
    //       the prop — so user typing (which echoes back via onChange →
    //       markdown prop) does NOT trigger a redundant setMarkdown that
    //       would reset the cursor.
    const internalRef = useRef<MDXEditorMethods>(null);

    // Last markdown value we successfully synced INTO the editor (via mount
    // or setMarkdown). Used to skip redundant setMarkdown calls when the
    // prop changes only because of the user's own typing echoing back.
    const lastSyncedRef = useRef<string | null>(null);

    // (B) Imperative sync with retry.
    useEffect(() => {
      const editor = internalRef.current;
      if (!editor) return;
      if (markdown === undefined || markdown === null) return;
      const target = String(markdown);
      // Already synced this exact value — skip (user typing echoing back).
      if (lastSyncedRef.current === target) return;

      let attempts = 0;
      let cancelled = false;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const trySync = () => {
        if (cancelled) return;
        attempts++;
        try {
          const current = editor.getMarkdown();
          if (current !== target) {
            editor.setMarkdown(target);
          }
          lastSyncedRef.current = target;
        } catch {
          // Editor / Lexical not ready yet (common right after mount inside
          // a Dialog portal). Retry with backoff — ~10 attempts over ~3s.
          if (attempts < 10) {
            timer = setTimeout(trySync, 60 * attempts);
          }
        }
      };
      trySync();

      return () => {
        cancelled = true;
        if (timer) clearTimeout(timer);
      };
    }, [markdown]);

    // (A) Suppress onChange events fired during initial-markdown
    // normalization. MDXEditor's onChange signature is
    //   (markdown: string, initialMarkdownNormalize: boolean) => void
    // where the 2nd arg is true when the event is just the editor
    // normalizing its initial markdown (NOT a user edit). Forwarding those
    // to the parent can overwrite form.body with a normalized/empty value
    // before the real content is shown.
    const handleChange = useMemo(() => {
      if (!onChange) return undefined;
      return (md: string, isInitNormalize: boolean) => {
        if (isInitNormalize) return;
        onChange(md);
      };
    }, [onChange]);

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
        onChange={handleChange}
        contentEditableClassName={`prose-editor ${compact ? "compact" : ""} ${
          className ?? ""
        }`}
        {...props}
      />
    );
  }
);
