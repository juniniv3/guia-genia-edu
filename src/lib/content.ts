import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/locales';
import { localizeModules, type LocalizedModule } from './modules';

export type GuideModule = LocalizedModule<CollectionEntry<'modulos'>>;

/** Every module of the guide in `locale`, falling back to the Spanish original where there's no translation. */
export async function getModules(locale: Locale): Promise<GuideModule[]> {
  return localizeModules(await getCollection('modulos'), locale);
}
