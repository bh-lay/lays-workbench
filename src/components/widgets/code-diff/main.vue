<style lang="less" scoped>
.code-diff-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .caption {
    padding: 0 10px 10px;
    font-size: 16px;
  }
  .code-diff-content {
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, .1);
  }
  :deep(.monaco-editor, .monaco-diff-editor) {
    --vscode-focusBorder: transparent;
    --vscode-editor-background: transparent;
    --vscode-editorGutter-background: transparent;
    --vscode-editorLineNumber-foreground: rgba(255, 255, 255, .2);
    --vscode-editorLineNumber-activeForeground: rgba(255, 255, 255, .6);
  }
  :deep(.monaco-diff-editor.side-by-side .editor) {
    box-shadow: none;
  }
  :deep(.codicon) {
    // padding-left: 4px;
    opacity: 0 !important;
  }
  :deep(.line-numbers) {
    font-size: 12px;
  }
  :deep(.monaco-editor .view-overlays .current-line-exact) {
    border: none;
    background: rgba(255, 255, 255, .1);
  }
}
</style>

<template>
  <div class="code-diff-container">
    <div class="caption">
      文本对比
    </div>
    <div
      ref="editorRef"
      class="code-diff-content"
    />
  </div>
</template>

<script lang="ts">
import { Ref, ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'CodeDiffWidgets',
  setup() {
    const editorRef: Ref<HTMLDivElement | null> = ref(null)
    let destroyEditorFn: (() => void) | null = null
    async function render() {
      destroyEditorFn?.()
      const monaco = await import('monaco-editor/esm/vs/editor/editor.api')
      const monacoEditor = monaco.editor
      var originalModel = monacoEditor.createModel(
        `Hello !
I'm 剧中人.
Blog is https://bh-lay.com`,
        'text/plain'
      )
      var modifiedModel = monacoEditor.createModel(
        `hello !
I'm 剧中人.
Email is mail@bh-lay.com
Nice to meet you`,
        'text/plain'
      )
      const diffEditor = monacoEditor.createDiffEditor(
        editorRef.value as HTMLDivElement,
        {
          enableSplitViewResizing: true,
          splitViewDefaultRatio: 0.5,
          originalEditable: true,
          automaticLayout: true,
          theme: 'vs-dark',
          fontSize: 16,
          lineNumbersMinChars: 1,
          lineDecorationsWidth: 22,
        }
      )
      diffEditor.setModel({
        original: originalModel,
        modified: modifiedModel,
      })
      destroyEditorFn = () => {
        diffEditor?.dispose?.()
      }
    }

    onMounted(() => {
      render()
    })
    onUnmounted(() => {
      destroyEditorFn?.()
    })
    return {
      editorRef,
    }
  },
}
</script>
