/**
 * Drop-in image slots. Put files in src/assets/ with these exact names and they are
 * picked up automatically (no code change):
 *   bg-hero.webp, bg-projects.webp, bg-about.webp, bg-contact.webp,
 *   project-safepath.webp, project-sentrix.webp, project-agentbattle.webp
 * Missing files return undefined, so <Background> falls back to the CSS placeholder.
 * Usage: <Background variant="hero" src={asset('bg-hero')} />
 */
const files = import.meta.glob('/src/assets/*.{webp,jpg,jpeg,png,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export function asset(name: string): string | undefined {
  const key = Object.keys(files).find((k) => k.split('/').pop()?.replace(/\.\w+$/, '') === name)
  return key ? files[key] : undefined
}
