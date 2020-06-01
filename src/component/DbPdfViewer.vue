<template>
  <q-dialog ref="dialog" persistent @before-show="onBeforeShow" :maximized="$q.screen.lt.md" @hide="onHide">

    <q-layout ref="layout" container view="hhh lpr fff" class="bg-white" style="max-width: 1280px;">

      <slot name="header">
        <q-header elevated >
          <q-toolbar>
            <q-toolbar-title>{{ name }}</q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
        </q-header>
      </slot>

      <q-page-container>
        <q-page padding :style-fn="styleFn">
          <q-pdfviewer :value="true" :src="pdfSrc" type="pdfjs" />
        </q-page>
      </q-page-container>

      <slot name="footer"></slot>
    </q-layout>

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
    watch: {
      src: function () {
        this.onBeforeShow();
      }
    },
    methods: {
      show() {
        this.$refs.dialog.show()
      },
      hide() {
        this.$refs.dialog.hide()
      },
      onHide() {
        this.pdfSrc = '';
      },
      styleFn(offset) {
        return this.$refs.layout ? {height: (this.$refs.layout.containerHeight - offset) + 'px'} : null;
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
