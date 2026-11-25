// Server-only: проверяет, лежит ли файл в public/. Используется в server-компонентах
// на этапе статической генерации, чтобы не рендерить битую картинку, пока владелец
// ещё не загрузил свои .avif.
import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

/** @param publicPath путь вида `/photos/hero1.avif` (с ведущим `/`) */
export function photoExists(publicPath: string): boolean {
  const normalized = publicPath.replace(/^\/+/, '');
  return fs.existsSync(path.join(PUBLIC_DIR, normalized));
}
