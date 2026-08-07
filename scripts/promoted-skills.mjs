export function parsePromotedPath(skillPath) {
  const match = String(skillPath).match(/^\.\/skills\/(engineering|productivity)\/([^/]+)$/);
  return match ? { bucket: match[1], name: match[2] } : null;
}
