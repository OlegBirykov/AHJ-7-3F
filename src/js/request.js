export const url = 'https://ahj-7-3.herokuapp.com';

export function runRequest(options = {}) {
  return new Promise((resolve, reject) => {
    const {
      headers, data, responseType, method,
    } = options;

    let params;
    if (method === 'GET') {
      params = new URLSearchParams();
    } else {
      params = new FormData();
    }

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        params.append(key, data[key]);
      }
    }

    const request = new XMLHttpRequest();

    if (method === 'GET') {
      request.open('GET', `${url}?${params}`);
    } else {
      request.open('POST', url);
    }

    for (const header in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, header)) {
        request.setRequestHeader(header, headers[header]);
      }
    }
    request.responseType = responseType;

    if (method === 'GET') {
      request.send();
    } else {
      request.send(params);
    }

    request.addEventListener('load', () => {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject(new Error(`Ошибка ${request.status}\n${request.statusText}`));
      }
    });

    request.addEventListener('error', () => {
      reject(new Error('Нет связи с сервером'));
    });
  });
}
