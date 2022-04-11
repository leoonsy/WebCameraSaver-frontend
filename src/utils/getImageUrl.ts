export default (name: string) => new URL(`../assets/images/${name}`, import.meta.url).href;
