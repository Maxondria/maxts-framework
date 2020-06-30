import axios, { AxiosPromise } from "axios";

interface HasId {
  id?: number;
}

export default class ApiSync<T extends HasId> {
  constructor(public baseURL: string) {}

  fetch(id: number): AxiosPromise {
    return axios.get(`${this.baseURL}/${id}`);
  }

  save(data: T): AxiosPromise {
    const { id } = data;
    if (id) {
      return axios.put(`${this.baseURL}/${id}`, data);
    } else {
      return axios.post(this.baseURL, data);
    }
  }
}
