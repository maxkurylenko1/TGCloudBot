export const code = (s: string) => `\`${s}\``;
export const pre = (s: string) => `\n<pre>${escapeHtml(s)}</pre>`;
function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!),
  );
}
