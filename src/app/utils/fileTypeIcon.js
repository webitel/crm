export default function getFileIcon(mimeType) {
	if (mimeType.includes('image')) return 'preview-tag-image';
	if (mimeType.includes('video')) return 'preview-tag-video';
	if (mimeType.includes('audio')) return 'preview-tag-audio';
	return 'attach';
}
