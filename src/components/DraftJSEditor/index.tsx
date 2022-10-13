import { useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  ContentBlock,
  DraftHandleValue,
} from "draft-js";

import "./editor.css";
import "./draft-js-default.css";
import StyleButton from "./StyledButton";

const init = EditorState.createEmpty();

function DraftJSEditor() {
  const [editorState, setEditorState] = useState<EditorState>(init);

  const onChange = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  function _handleKeyCommand(
    command: string,
    editorState: EditorState
  ): DraftHandleValue {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return "handled";
    }
    return "not-handled";
  }

  function _mapKeyToEditorCommand(e: any) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
      if (newEditorState !== editorState) {
        onChange(newEditorState);
      }
      return null;
    }
    return getDefaultKeyBinding(e);
  }

  function _toggleBlockType(blockType: any) {
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  }

  function _toggleInlineStyle(inlineStyle: string) {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  }

  const styleMap = {
    CODE: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
  };

  function getBlockStyle(block: ContentBlock) {
    switch (block.getType()) {
      case "blockquote":
        return "RichEditor-blockquote";
      default:
        return "";
    }
  }

  const BLOCK_TYPES = [
    { label: "H1", style: "header-one" },
    { label: "H2", style: "header-two" },
    { label: "H3", style: "header-three" },
    { label: "H4", style: "header-four" },
    { label: "H5", style: "header-five" },
    { label: "H6", style: "header-six" },
    { label: "Blockquote", style: "blockquote" },
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" },
    { label: "Code Block", style: "code-block" },
  ];

  const BlockStyleControls = (props: {
    editorState: EditorState;
    onToggle: any;
  }) => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <div className="RichEditor-controls">
        {BLOCK_TYPES.map((type) => (
          <StyleButton
            key={type.label}
            active={type.style === blockType}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        ))}
      </div>
    );
  };

  var INLINE_STYLES = [
    { label: "Bold", style: "BOLD" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
    { label: "Monospace", style: "CODE" },
  ];

  const InlineStyleControls = (props: {
    editorState: EditorState;
    onToggle: any;
  }) => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
      <div className="RichEditor-controls">
        {INLINE_STYLES.map((type) => (
          <StyleButton
            key={type.label}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
        ))}
      </div>
    );
  };

  let className = "RichEditor-editor";
  var contentState = editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== "unstyled") {
      className += " RichEditor-hidePlaceholder";
    }
  }

  return (
    <>
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={editorState}
          onToggle={_toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={_toggleInlineStyle}
        />
        <div className={className}>
          <Editor
            editorState={editorState}
            onChange={onChange}
            spellCheck={true}
            placeholder="What`s in your mind?"
            customStyleMap={styleMap}
            blockStyleFn={getBlockStyle}
            handleKeyCommand={_handleKeyCommand}
            keyBindingFn={_mapKeyToEditorCommand}
          />
        </div>
      </div>
    </>
  );
}

export default DraftJSEditor;
