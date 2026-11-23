<script setup>
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  Minus,
} from 'lucide-vue-next'

const props = defineProps({
  // Tiptap editor instance from useEditor()
  editor: {
    type: Object,
    required: true,
  },
})

const setLink = () => {
  const previousUrl = props.editor.getAttributes('link').href
  const url = window.prompt('Masukkan alamat tautan (URL):', previousUrl || 'https://')

  if (url === null) {
    return
  }

  if (url === '') {
    props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}
</script>

<template>
  <!-- Indonesian formatting toolbar -->
  <div
    class="flex flex-wrap items-center gap-1 p-2 bg-surface border-b border-secondary/15 select-none"
  >
    <!-- Tebal -->
    <button
      type="button"
      title="Tebal (Ctrl+B)"
      aria-label="Tebal"
      @click="editor.chain().focus().toggleBold().run()"
      class="p-2 rounded-lg text-xs font-bold transition cursor-pointer"
      :class="editor.isActive('bold') ? 'bg-primary text-white' : 'text-ink/80 hover:bg-white hover:text-primary'"
    >
      <Bold class="w-4 h-4" />
    </button>

    <!-- Miring -->
    <button
      type="button"
      title="Miring (Ctrl+I)"
      aria-label="Miring"
      @click="editor.chain().focus().toggleItalic().run()"
      class="p-2 rounded-lg text-xs font-bold transition cursor-pointer"
      :class="editor.isActive('italic') ? 'bg-primary text-white' : 'text-ink/80 hover:bg-white hover:text-primary'"
    >
      <Italic class="w-4 h-4" />
    </button>

    <div class="w-px h-5 bg-gray-200 mx-1" />

    <!-- Judul 2 -->
    <button
      type="button"
      title="Judul Tingkat 2"
      aria-label="Judul 2"
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      class="px-2.5 py-1.5 rounded-lg text-xs font-black transition cursor-pointer"
      :class="editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white' : 'text-ink/80 hover:bg-white hover:text-primary'"
    >
      H2
    </button>

    <!-- Judul 3 -->
    <button
      type="button"
      title="Judul Tingkat 3"
      aria-label="Judul 3"
      @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      class="px-2.5 py-1.5 rounded-lg text-xs font-black transition cursor-pointer"
      :class="editor.isActive('heading', { level: 3 }) ? 'bg-primary text-white' : 'text-ink/80 hover:bg-white hover:text-primary'"
    >
      H3
    </button>

    <div class="w-px h-5 bg-gray-200 mx-1" />

    <!-- Daftar Poin -->
    <button
      type="button"
      title="Daftar Poin"
      aria-label="Daftar Poin"
      @click="editor.chain().focus().toggleBulletList().run()"
      class="p-2 rounded-lg text-xs font-bold transition cursor-pointer"
      :class="editor.isActive('bulletList') ? 'bg-primary text-white' : 'text-ink/80 hover:bg-white hover:text-primary'"
    >
      <List class="w-4 h-4" />
    </button>

    <!-- Daftar Nomor -->
    <button
      type="button"
      title="Daftar Nomor"
      aria-label="Daftar Nomor"
      @click="editor.chain().focus().toggleOrderedList().run()"
      class="p-2 rounded-lg text-xs font-bold transition cursor-pointer"
      :class="editor.isActive('orderedList') ? 'bg-primary text-white' : 'text-ink/80 hover:bg-white hover:text-primary'"
    >
      <ListOrdered class="w-4 h-4" />
    </button>

    <!-- Kutipan -->
    <button
      type="button"
      title="Kutipan"
      aria-label="Kutipan"
      @click="editor.chain().focus().toggleBlockquote().run()"
      class="p-2 rounded-lg text-xs font-bold transition cursor-pointer"
      :class="editor.isActive('blockquote') ? 'bg-primary text-white' : 'text-ink/80 hover:bg-white hover:text-primary'"
    >
      <Quote class="w-4 h-4" />
    </button>

    <!-- Garis Pemisah -->
    <button
      type="button"
      title="Garis Pemisah"
      aria-label="Garis Pemisah"
      @click="editor.chain().focus().setHorizontalRule().run()"
      class="p-2 rounded-lg text-xs font-bold text-ink/80 hover:bg-white hover:text-primary transition cursor-pointer"
    >
      <Minus class="w-4 h-4" />
    </button>

    <div class="w-px h-5 bg-gray-200 mx-1" />

    <!-- Tautan -->
    <button
      type="button"
      title="Sisipkan Tautan"
      aria-label="Sisipkan Tautan"
      @click="setLink"
      class="p-2 rounded-lg text-xs font-bold transition cursor-pointer"
      :class="editor.isActive('link') ? 'bg-primary text-white' : 'text-ink/80 hover:bg-white hover:text-primary'"
    >
      <LinkIcon class="w-4 h-4" />
    </button>

    <button
      v-if="editor.isActive('link')"
      type="button"
      title="Hapus Tautan"
      aria-label="Hapus Tautan"
      @click="editor.chain().focus().unsetLink().run()"
      class="p-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
    >
      <Unlink class="w-4 h-4" />
    </button>

    <div class="w-px h-5 bg-gray-200 mx-1" />

    <!-- Urung & Ulangi -->
    <button
      type="button"
      title="Urung (Ctrl+Z)"
      aria-label="Urung"
      :disabled="!editor.can().undo()"
      @click="editor.chain().focus().undo().run()"
      class="p-2 rounded-lg text-xs font-bold text-ink/80 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
    >
      <Undo class="w-4 h-4" />
    </button>

    <button
      type="button"
      title="Ulangi (Ctrl+Y)"
      aria-label="Ulangi"
      :disabled="!editor.can().redo()"
      @click="editor.chain().focus().redo().run()"
      class="p-2 rounded-lg text-xs font-bold text-ink/80 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
    >
      <Redo class="w-4 h-4" />
    </button>
  </div>
</template>
