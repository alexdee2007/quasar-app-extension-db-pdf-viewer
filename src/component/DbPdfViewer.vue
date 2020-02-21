<template>
  <q-dialog ref="dialog" no-backdrop-dismiss no-esc-dismiss @before-show="onBeforeShow" :maximized="$q.screen.lt.md">

    <db-dialog-layout ref="dialogLayout" :context="{label: name, dialogWidth: '1280px', styleFn }">
      <q-pdfviewer
        :value="true"
        :src="pdfSrc"
        type="pdfjs"
        />
      <template v-slot:footer>
        <q-toolbar>
          <q-space />
          <q-btn label="Відміна" color="primary" @click="hide" />
        </q-toolbar>
      </template>
    </db-dialog-layout>

  </q-dialog>
</template>

<script>

  import axios from 'axios';

  export default {
    name: 'DbPdfViewer',
    props: {
      src: [String, Blob],
      name: {
        type: String,
        default: 'Переглянути PDF'
      }
    },
    data() {
      return {
        pdfSrc: ''
      }
    },
    methods: {
      show() {
        this.$refs.dialog.show()
      },
      hide() {
        this.$refs.dialog.hide()
      },
      styleFn(offset) {
        return this.$refs.dialogLayout ? {height: (this.$refs.dialogLayout.$refs.layout.containerHeight - offset) + 'px'} : null;
      },
      async onBeforeShow() {
        try {
          this.$q.loading.show({message: 'Завантаження...'});
          const {data} = this.src instanceof Blob ? {data: this.src} : await axios.get(this.src, {responseType: 'blob'});
          this.pdfSrc = (window.URL || window.webkitURL || window || {}).createObjectURL(data);
        } catch (err) {
          throw err;
        } finally {
          this.$q.loading.hide();
        }
      }
    }
  }
</script>