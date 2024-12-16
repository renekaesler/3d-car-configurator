export default class Json {
  static async fetch(url) {
    const response  = await fetch(url);
    const json      = await response.json();

    return json;
  }
}