import DbPdfViewer from '../component/DbPdfViewer';

export default {
  methods: {
    async viewPdf(file) {
      try {
        this.$q.loading.show({message: 'Завантаження...'});
        if (file.__status !== 'uploaded') {
          return false;
        }
        if (!file.__presignedUrl) {
          file.__presignedUrl = await this.$api.minio.getPresignedUrlForGet(file.__fullName);
        }
        this.$q.dialog({
          component: DbPdfViewer,
          parent: this,
          name: file.name,
          src: file.__presignedUrl
        });
      } catch (err) {
        throw err;
      } finally {
        this.$q.loading.hide();
      }
    }
  }
}
