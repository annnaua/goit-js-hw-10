export function fetchCountries(url, name, fields) {
  return fetch(`${url}${name}?fields=${fields}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
