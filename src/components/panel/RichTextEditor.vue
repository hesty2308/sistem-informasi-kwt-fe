<script setup>
import { watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import RichTextToolbar from '@/components/panel/RichTextToolbar.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Tulis isi artikel kegiatan di sini...',
  },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [2, 3],
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline font-medium',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose max-w-none focus:outline-none min-h-[220px] p-4 text-ink leading-relaxed',
    },
  },
  onUpdate: () => {
    emit('update:modelValue', editor.value.getHTML())
  },
})

watch(
  () => props.modelValue,
  (val) => {
    if (!editor.value) return
    const isSame = editor.value.getHTML() === val
    if (!isSame) {
      editor.value.commands.setContent(val, false)
    }
  }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="border border-secondary/25 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-accent focus-within:border-secondary transition">
    <RichTextToolbar v-if="editor" :editor="editor" />

    <!-- Area Editor Konten -->
    <EditorContent :editor="editor" />
  </div>
</template>
