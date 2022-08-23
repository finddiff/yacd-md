import { getURLAndInit } from 'src/misc/request-helper';
import { Hashmap } from 'src/store/types';
import { ClashAPIConfig } from 'src/types';

const endpoint = '/hashmap';

export async function fetchHashmaps(apiConfig: ClashAPIConfig) {
  const { url, init } = getURLAndInit(apiConfig);
  return await fetch(url + endpoint, init);
}

export async function fetchHashmap(hashkey, apiConfig: ClashAPIConfig) {
  const { url, init } = getURLAndInit(apiConfig);
  return await fetch(url + endpoint + '/' + hashkey, init);
}

// TODO support PUT /configs
// req body
// { Path: string }

type HashmapPartial = Partial<Hashmap>;
// function configsPatchWorkaround(o: HashmapPartial) {
//   // backward compatibility for older clash  using `socket-port`
//   if ('socks-port' in o) {
//     o['socket-port'] = o['socks-port'];
//   }
//   return o;
// }

export async function updateHashmap(
  apiConfig: ClashAPIConfig,
  o: HashmapPartial,
) {
  const { url, init } = getURLAndInit(apiConfig);
  const body = JSON.stringify(o);
  return await fetch(url + endpoint, { ...init, body, method: 'POST' });
}
